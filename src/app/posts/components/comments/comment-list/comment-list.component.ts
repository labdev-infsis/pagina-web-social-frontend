import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, Reply } from '../../../models/comment';
import { UserDetail } from '../../../models/user-detail';
import moment from 'moment-timezone';
import { PostService } from '../../../services/post.service';
import { EmojiType } from '../../../models/emoji-type';
import { CreateReaction } from '../../../models/create-reaction';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../authentication/services/auth.service';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnChanges {
  @Input() comments: Comment[] = [];
  @Input() currentUser: UserDetail | null = null;
  @Input() authenticated: boolean = false;
  @Output() onAddReply = new EventEmitter<{ parentUuid: string, replyText: string, isTopLevel: boolean }>();

  replyInputVisible: { [key: string]: boolean } = {};
  replyText: { [key: string]: string } = {};
  replyLimit: { [key: string]: number } = {};
  replyVisibility: { [key: string]: boolean } = {};
  emojis: EmojiType[] = [];
  selectedReactions: { [key: string]: string } = {}; // Guarda el emoji seleccionado por comentario
  // ...existing code...

  showEmojiOptions: { [uuid: string]: boolean } = {};
  defaultEmoji: any = {
    uuid: '',
    emoji_code: '👍',
    emoji_name: 'thumbs-up',
    class: 'thumbs-up'
  };

  // Mapea emoji_name a una clase CSS para estilos tipo Facebook
  emojiClassMap: { [key: string]: string } = {
    'thumbs-up': 'thumbs-up',
    'red-heart': 'red-heart',
    'crying-face': 'crying-face',
    'angry-face': 'angry-face',
    'grinning-squinting-face': 'grinning-squinting-face',
    'astonished-face': 'astonished-face'
  };

  ngOnInit() {
    this.loadEmojis();
    this.loadUserReactionsForComments();
  }
  getEmojiLabel(emojiName?: string): string {
    switch (emojiName) {
      case 'thumbs-up': return 'Me gusta';
      case 'red-heart': return 'Me encanta';
      case 'crying-face': return 'Me entristece';
      case 'angry-face': return 'Me enoja';
      case 'grinning-squinting-face': return 'Me divierte';
      case 'astonished-face': return 'Me asombra';
      default: return 'Me gusta';
    }
  }
  loadEmojis() {
    this.postService.getEmojisType().subscribe(emojis => {
      // Agrega la clase a cada emoji para usar en el botón
      this.emojis = emojis.map(e => ({
        ...e,
        class: this.emojiClassMap[e.emoji_name] || 'default'
      }));
      // El primer emoji será el default (👍)
      if (this.emojis.length) {
        this.defaultEmoji = { ...this.emojis[0], class: this.emojiClassMap[this.emojis[0].emoji_name] };
      }
      console.log('Emojis loaded:', this.emojis);
    });
  }

  getEmojiClass(commentUuid: string): string {
    const emoji = this.getSelectedEmoji(commentUuid);
    if (!emoji) return 'default';
    switch (emoji.emoji_name) {
      case 'thumbs-up': return 'thumbs-up';
      case 'red-heart': return 'red-heart';
      case 'crying-face': return 'crying-face';
      case 'angry-face': return 'angry-face';
      case 'grinning-squinting-face': return 'grinning-squinting-face';
      case 'astonished-face': return 'astonished-face';
      default: return 'default';
    }
  }
  // Devuelve el objeto emoji seleccionado para el comentario
  getSelectedEmoji(commentUuid: string) {
    const emojiUuid = this.selectedReactions[commentUuid];
    return this.emojis.find(e => e.uuid === emojiUuid);
  }

  constructor(private postService: PostService,
    private authService: AuthService
  ) { }

  reactToComment(commentUuid: string, emojiTypeUuid: string, forceChange: boolean = false) {
    // Si ya hay reacción y NO es un cambio forzado (click en botón principal), elimina la reacción
    if (this.selectedReactions[commentUuid] && !forceChange) {
      this.removeReaction(commentUuid);
      return;
    }
    // Si ya hay reacción y es un cambio forzado (click en emoji diferente), actualiza la reacción
    const body = {
      emojiTypeId: emojiTypeUuid,
      reactionDate: new Date().toISOString()
    };
    this.postService.reactToComment(commentUuid, body).subscribe(() => {
      this.selectedReactions[commentUuid] = emojiTypeUuid;
    });
  }

  removeReaction(commentUuid: string) {
    this.postService.deleteCommentReaction(commentUuid).subscribe(() => {
      this.selectedReactions[commentUuid] = '';
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments']) {
      this.initializeReplyLimits();
      this.loadUserReactionsForComments();
    }
  }

  private initializeReplyLimits(): void {
    this.comments.forEach(comment => {
      this.replyLimit[comment.uuid] = 0;
      this.replyVisibility[comment.uuid] = false;

      if (comment.replies) {
        comment.replies.forEach(reply => {
          this.initializeReply(reply);
        });
      }
    });
  }

  private initializeReply(reply: Reply): void {
    this.replyLimit[reply.uuid] = 1;
    this.replyVisibility[reply.uuid] = false;

    if (reply.replies) {
      reply.replies.forEach(nestedReply => {
        this.initializeReply(nestedReply);
      });
    }
  }

  toggleReplyInput(uuid: string): void {
    this.replyInputVisible[uuid] = !this.replyInputVisible[uuid];
    if (this.replyInputVisible[uuid]) {
      this.replyText[uuid] = '';
    }
  }

  addReply(parentUuid: string, replyUuid: string, isTopLevel: boolean): void {
    if (this.replyText[replyUuid]?.trim()) {
      this.onAddReply.emit({
        parentUuid,
        replyText: this.replyText[replyUuid],
        isTopLevel
      });
      this.replyText[replyUuid] = '';
      this.replyInputVisible[replyUuid] = false;
    }
  }

  showLessReplies(uuid: string): void {
    this.replyLimit[uuid] = 0;
    this.replyVisibility[uuid] = false;
  }

  showAllReplies(uuid: string): void {
    const item = this.findItemByUuid(uuid, this.comments);
    if (item) {
      this.replyLimit[uuid] = item.replies?.length || 0;
      this.replyVisibility[uuid] = true;
    }
  }

  private findItemByUuid(uuid: string, items: any[]): any {
    for (let item of items) {
      if (item.uuid === uuid) return item;
      if (item.replies && item.replies.length) {
        let found = this.findItemByUuid(uuid, item.replies);
        if (found) return found;
      }
    }
    return null;
  }

  calculateTimeFromNow(date: string): string {
    return moment.utc(date).local().fromNow();
  }

  loadUserReactionsForComments() {
    const userId = this.authService.getUserId();
    if (!userId || !this.comments) return;

    // Llama a getCommentsReactions para cada comentario
    const reactionsObservables = this.comments.map(comment =>
      this.postService.getCommentsReactions(comment.uuid)
    );

    forkJoin(reactionsObservables).subscribe(allReactions => {
      allReactions.forEach((reactions, idx) => {
        const comment = this.comments[idx];
        const myReaction = reactions.find((r: any) => r.userId === userId);
        if (myReaction) {
          this.selectedReactions[comment.uuid] = myReaction.emojiTypeId;
        }
      });
    });
  }
}