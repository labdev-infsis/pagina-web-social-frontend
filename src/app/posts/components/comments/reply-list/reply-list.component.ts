import { Component, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment-timezone';
import { PostService } from '../../../services/post.service';
import { EmojiType } from '../../../models/emoji-type';
import { AuthService } from '../../../../authentication/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reply-list',
  templateUrl: './reply-list.component.html',
  styleUrls: ['./reply-list.component.scss']
})
export class ReplyListComponent {
  @Input() parentUuid: string = '';
  @Input() replies: any[] = [];
  @Input() currentUser: any;
  @Input() replyInputVisible: { [key: string]: boolean } = {};
  @Input() replyText: { [key: string]: string } = {};
  @Input() replyLimit: { [key: string]: number } = {};
  @Input() authenticated: boolean = false;

  @Output() toggleReplyInput = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<{ replyUuid: string, isTopLevel: boolean }>();
  @Output() showAllReplies = new EventEmitter<string>();
  @Output() showLessReplies = new EventEmitter<string>();
  emojis: EmojiType[] = [];
  selectedReactions: { [key: string]: string } = {};
  replyReactionsCount: { [replyUuid: string]: number } = {};
  showEmojiOptions: { [uuid: string]: boolean } = {};
  defaultEmoji: any = {
    uuid: '',
    emoji_code: '👍',
    emoji_name: 'thumbs-up',
    class: 'thumbs-up'
  };
  emojiClassMap: { [key: string]: string } = {
    'thumbs-up': 'thumbs-up',
    'red-heart': 'red-heart',
    'crying-face': 'crying-face',
    'angry-face': 'angry-face',
    'grinning-squinting-face': 'grinning-squinting-face',
    'astonished-face': 'astonished-face'
  };

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadEmojis();
    this.loadUserReactionsForReplies();
    this.loadRepliesReactionsCount();
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
      this.emojis = emojis.map(e => ({
        ...e,
        class: this.emojiClassMap[e.emoji_name] || 'default'
      }));
      if (this.emojis.length) {
        this.defaultEmoji = { ...this.emojis[0], class: this.emojiClassMap[this.emojis[0].emoji_name] };
      }
    });
  }

  getEmojiClass(replyUuid: string): string {
    const emoji = this.getSelectedEmoji(replyUuid);
    if (!emoji) return 'default';
    return this.emojiClassMap[emoji.emoji_name] || 'default';
  }

  getSelectedEmoji(replyUuid: string) {
    const emojiUuid = this.selectedReactions[replyUuid];
    return this.emojis.find(e => e.uuid === emojiUuid);
  }

  // ...existing code...
  reactToReply(replyUuid: string, emojiTypeUuid: string, forceChange: boolean = false) {
    if (this.selectedReactions[replyUuid] && !forceChange) {
      this.removeReplyReaction(replyUuid);
      return;
    }
    const body = {
      emoji_type_id: emojiTypeUuid, // <-- nombre correcto
      reaction_date: new Date().toISOString() // <-- nombre correcto
    };
    this.postService.reactToReply(replyUuid, body).subscribe(() => {
      this.selectedReactions[replyUuid] = emojiTypeUuid;
      this.loadRepliesReactionsCount();
    });
  }
  // ...existing code...

  removeReplyReaction(replyUuid: string) {
    this.postService.deleteReplyReaction(replyUuid).subscribe(() => {
      this.selectedReactions[replyUuid] = '';
      this.loadRepliesReactionsCount();
    });
  }

  loadUserReactionsForReplies() {
    const userId = this.authService.getUserId();
    if (!userId || !this.replies) return;
    const reactionsObservables = this.replies.map(reply =>
      this.postService.getReplyReactions(reply.uuid)
    );
    forkJoin(reactionsObservables).subscribe(allReactions => {
      allReactions.forEach((reactions, idx) => {
        const reply = this.replies[idx];
        // Cambia a user_id y emoji_type_id
        const myReaction = reactions.find((r: any) => r.user_id === userId);
        if (myReaction) {
          this.selectedReactions[reply.uuid] = myReaction.emoji_type_id;
        } else {
          this.selectedReactions[reply.uuid] = '';
        }
      });
    });
  }

  loadRepliesReactionsCount() {
    if (!this.replies) return;
    this.replies.forEach(reply => {
      this.postService.getReplyReactions(reply.uuid).subscribe(reactions => {
        this.replyReactionsCount[reply.uuid] = reactions.length;
      });
    });
  }

  getReplyReactionsCount(reply: any): number {
    return this.replyReactionsCount[reply.uuid] || 0;
  }
  // Devuelve el límite de respuestas a mostrar para un uuid
  getLimit(uuid: string): number {
    return this.replyLimit && this.replyLimit[uuid] ? this.replyLimit[uuid] : 0;
  }

  // Calcula el tiempo desde la fecha
  calculateTimeFromNow(date: string): string {
    return moment.utc(date).local().fromNow();
  }

}