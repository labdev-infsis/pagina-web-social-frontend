import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment, Reply } from '../../../posts/models/comment';
import { ChangeDetectorRef } from '@angular/core';
import { ViewCommentsComponent } from '../../../posts/components/view-comments/view-comments.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalListReactionsCommentsComponent } from './../modal-list-reactions-comments/modal-list-reactions-comments.component';
import { PostService } from '../../../posts/services/post.service';
import { EmojiType } from '../../../posts/models/emoji-type';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
})
export class ReactionsComponent implements OnInit {
  private modalService = inject(NgbModal);
  @Input() commentUuid!: string;
  @Input() replyUuid!: string;

  userId: string = '';
  @ViewChild(ViewCommentsComponent)
  viewCommentsComponent!: ViewCommentsComponent;
  @Output() reactionUpdated = new EventEmitter<string>();

  comments: Comment[] = [];
  reply: Reply[] = [];
  selectedReaction: string | null = null;
  totalReactions = 0;
  showReactions = false;
  showReactionDetails = false;
  emojis: string[] = ['👍', '❤️', '😢', '😡', '😆', '😲'];
  reactionCounts: {  emojiTypeId:string; emoji: string; count: number }[] = [];
  detailedReactions: { userName: string; userPhoto: string; emoji: string }[] =
    [];

  getReactionText(reaction: string | null): string {
    const reactionTexts: Record<string, string> = {
      '👍': 'Me gusta',
      '❤️': 'Me encanta',
      '😢': 'Me entristece',
      '😡': 'Me enoja',
      '😆': 'Me divierte',
      '😲': 'Me sorprende',
    };
    return reaction ? reactionTexts[reaction] || 'Me gusta' : 'Me gusta';
  }
  emojiMap: Record<string, string> = {
    '👍': '3f696a78-c73f-475c-80a6-f5a858648af1',
    '❤️': '7v236a78-c73f-475c-80a6-f5a858648af1',
    '😢': 'n1596a78-c73f-475c-80a6-f5a858648af1',
    '😡': '4c806a78-c73f-475c-80a6-f5a858648af1',
    '😆': 'l6m3bd82-c73f-475c-80a6-f5a858648af1',
    '😲': 'c5n1m4f0-c73f-475c-80a6-f5a858648af1',
  };

  emojiUuidMap: Record<string, string> = Object.fromEntries(
    Object.entries(this.emojiMap).map(([emoji, uuid]) => [uuid, emoji])
  );
  isMouseOverReactions: any;
  listEmojiType!: EmojiType[];

  constructor(
    private readonly commentService: CommentService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() || '';

    if (!this.userId) {
      this.userId = localStorage.getItem('userid') || '';
    }

    this.postService.getEmojisType().subscribe({
      next: (response: EmojiType[]) => {
        this.listEmojiType = response;
      },
      error: (error) => {
        console.log('Error al obtener los tipos de emojis', error);
      }
    });

    this.loadTotalReactions();
  }

  loadTotalReactions() {
    const uuid = this.replyUuid || this.commentUuid;
    if (!uuid) return;

    const getFn = this.replyUuid
      ? this.commentService.getReplyReactions.bind(this.commentService)
      : this.commentService.getCommentReactions.bind(this.commentService);

    getFn(uuid).subscribe({
      next: (reactions) => {
        this.totalReactions = reactions.length;
        this.updateReactionCounts(reactions);

        this.detailedReactions = reactions.map((r) => ({
          userName: r.userName,
          userPhoto: r.userPhoto,
          emoji: this.getEmojiByUuid(
            this.replyUuid ? r.emoji_type_id : r.emojiTypeId
          ),
        }));

        const userReaction = reactions.find((r) =>
          this.replyUuid ? r.user_id === this.userId : r.userId === this.userId
        );

        this.selectedReaction = userReaction
          ? this.getEmojiByUuid(
              this.replyUuid
                ? userReaction.emoji_type_id
                : userReaction.emojiTypeId
            )
          : null;

        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error al cargar reacciones:', error),
    });
  }

  updateReactionCounts(reactions: any[]) {
    const countsMap = new Map<string, { emojiTypeId: string; emoji: string; count: number }>();
    const userReactions = new Map<string, string>();

    reactions.forEach((reaction) => {
      const emojiTypeId = this.replyUuid
        ? reaction.emoji_type_id
        : reaction.emojiTypeId;

      const userId = this.replyUuid ? reaction.user_id : reaction.userId;

      const emoji = this.getEmojiByUuid(emojiTypeId);

      userReactions.set(userId, emoji);
      const current = countsMap.get(emojiTypeId);
      if (current) {
        current.count++;
      } else {
        countsMap.set(emojiTypeId, {
          emojiTypeId,
          emoji,
          count: 1
        });
      }
    });

    this.selectedReaction = userReactions.get(this.userId) || null;

    this.reactionCounts = Array.from(countsMap.values());
  }

  openModalReactionsComments(){
    const modalRef = this.modalService.open(ModalListReactionsCommentsComponent, { centered: true });
    modalRef.componentInstance.reactionsCount = this.reactionCounts;
    modalRef.componentInstance.detailReactions = this.detailedReactions;
    modalRef.componentInstance.listEmojiType = this.listEmojiType;
    modalRef.componentInstance.commentOrReplyUuid = this.commentUuid || this.replyUuid;
  }

  getEmojiByUuid(uuid: string): string {
    return this.emojiUuidMap[uuid];
  }

  toggleReactions(show: boolean) {
    this.showReactions = show;
  }

  delayedCloseReactions() {
    setTimeout(() => {
      if (!this.isMouseOverReactions) {
        this.showReactions = false;
      }
    }, 300);
  }

  keepPopupOpen(event: Event) {
    event.stopPropagation();
  }

  reactToTarget(emoji: string) {
    const userId =
      this.authService.getUserId() || localStorage.getItem('userid');
    const targetUuid = this.replyUuid || this.commentUuid;
    if (!userId || !targetUuid) return;

    const emojiUuid = this.emojiMap[emoji] || emoji;

    const isReply = !!this.replyUuid;

    const getReactions = isReply
      ? this.commentService.getReplyReactions.bind(this.commentService)
      : this.commentService.getCommentReactions.bind(this.commentService);

    const postReaction = isReply
      ? this.commentService.reactToReply.bind(this.commentService)
      : this.commentService.reactToComment.bind(this.commentService);

    const updateReaction = isReply
      ? this.commentService.updateReplyReaction.bind(this.commentService)
      : this.commentService.updateReaction.bind(this.commentService);

    getReactions(targetUuid).subscribe({
      next: (reactions) => {
        const existingReaction = reactions.find((r) =>
          isReply ? r.user_id === userId : r.userId === userId
        );

        if (existingReaction) {
          const cleanedReaction = isReply
            ? {
                user_id: userId,
                reply_id: targetUuid,
                emoji_type_id: emojiUuid,
                reaction_date: new Date().toISOString(),
              }
            : {
                userId: userId,
                commentId: targetUuid,
                emojiTypeId: emojiUuid,
                reactionDate: new Date().toISOString(),
              };

          updateReaction(existingReaction.uuid, cleanedReaction).subscribe({
            next: () => {
              this.selectedReaction = this.getEmojiByUuid(emojiUuid);
              this.loadTotalReactions();
            },
            error: (err) => {
              console.error('❌ Error al actualizar la reacción:', err);
            },
          });
        } else {
          const newReaction = isReply
            ? {
                user_id: userId,
                reply_id: targetUuid,
                emoji_type_id: emojiUuid,
                reaction_date: new Date().toISOString(),
              }
            : {
                userId: userId,
                commentId: targetUuid,
                emojiTypeId: emojiUuid,
                reactionDate: new Date().toISOString(),
              };

          postReaction(targetUuid, newReaction).subscribe({
            next: () => {
              this.selectedReaction = this.getEmojiByUuid(emojiUuid);
              this.loadTotalReactions();
            },
            error: (err) => {
              console.error('❌ Error al agregar la reacción:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar reacciones existentes:', err);
      },
    });
  }
}
