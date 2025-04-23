import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../../posts/models/comment';
import { ChangeDetectorRef } from '@angular/core';
import { ViewCommentsComponent } from '../../../posts/components/view-comments/view-comments.component';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss'],
})
export class ReactionsComponent implements OnInit {
  @Input() commentUuid!: string;
  userId: string = '';
  @ViewChild(ViewCommentsComponent)
  viewCommentsComponent!: ViewCommentsComponent;
  @Output() reactionUpdated = new EventEmitter<string>();

  comments: Comment[] = [];
  selectedReaction: string | null = null;
  totalReactions = 0;
  showReactions = false;
  emojis: string[] = ['👍', '❤️', '😢', '😡'];

  getReactionText(reaction: string | null): string {
    const reactionTexts: Record<string, string> = {
      '👍': 'Me gusta',
      '❤️': 'Me encanta',
      '😢': 'Me entristece',
      '😡': 'Me enoja',
    };
    return reaction ? reactionTexts[reaction] || 'Me gusta' : 'Me gusta';
  }

  emojiMap: Record<string, string> = {
    '👍': '3f696a78-c73f-475c-80a6-f5a858648af1',
    '❤️': '7v236a78-c73f-475c-80a6-f5a858648af1',
    '😢': 'n1596a78-c73f-475c-80a6-f5a858648af1',
    '😡': '4c806a78-c73f-475c-80a6-f5a858648af1',
  };

  emojiUuidMap: Record<string, string> = Object.fromEntries(
    Object.entries(this.emojiMap).map(([emoji, uuid]) => [uuid, emoji])
  );
  isMouseOverReactions: any;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() || '';

    if (!this.userId) {
      this.userId = localStorage.getItem('userid') || '';
    }

    this.loadTotalReactions();
  }

  loadTotalReactions() {
    if (!this.commentUuid) {
      return;
    }

    this.commentService.getCommentReactions(this.commentUuid).subscribe({
      next: (reactions) => {
        this.totalReactions = reactions.length;
        this.updateReactionCounts(reactions);

        const userReaction = reactions.find((r) => r.userId === this.userId);
        if (userReaction) {
          this.selectedReaction = this.getEmojiByUuid(userReaction.emojiTypeId);
        } else {
          this.selectedReaction = null;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {},
    });
  }

  loadReactions(comment: Comment) {
    if (!comment || !comment.uuid) {
      return;
    }

    this.commentService.getCommentReactions(comment.uuid).subscribe({
      next: (reactions) => {
        this.totalReactions = reactions.length;
        this.updateReactionCounts(reactions);

        Object.assign(comment, { totalReactions: reactions.length });

        this.cdr.detectChanges();
      },
      error: (error) => {},
    });
  }

  reactionCounts: { emoji: string; count: number }[] = [];

  updateReactionCounts(reactions: any[]) {
    const countsMap = new Map<string, number>();
    const userReactions = new Map<string, string>();

    reactions.forEach((reaction) => {
      const emoji = this.getEmojiByUuid(reaction.emojiTypeId);

      userReactions.set(reaction.userId, emoji);

      countsMap.set(emoji, (countsMap.get(emoji) || 0) + 1);
    });

    if (userReactions.has(this.userId)) {
      this.selectedReaction = userReactions.get(this.userId)!;
    } else {
      this.selectedReaction = null;
    }

    this.reactionCounts = Array.from(countsMap.entries()).map(
      ([emoji, count]) => ({ emoji, count })
    );
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

  reactToComment(commentUuid: string, emoji: string) {
    const userId = this.authService.getUserId();

    if (!userId) {
    }

    const emojiUuid = this.emojiMap[emoji] || emoji;

    this.commentService.getCommentReactions(commentUuid).subscribe({
      next: (reactions) => {
        const existingReaction = reactions.find((r) => r.userId === userId);

        if (existingReaction) {
          existingReaction.emojiTypeId = emojiUuid;
          this.commentService
            .updateReaction(existingReaction.uuid, existingReaction)
            .subscribe({
              next: () => {
                this.selectedReaction = this.getEmojiByUuid(emojiUuid);
                this.loadTotalReactions();
              },
              error: (err) =>
                console.error('Error al actualizar la reacción:', err),
            });
        } else {
          const reactionData = {
            userId: userId,
            commentId: commentUuid,
            emojiTypeId: emojiUuid,
            reactionDate: new Date().toISOString(),
          };

          this.commentService
            .reactToComment(commentUuid, reactionData)
            .subscribe({
              next: (response) => {
                this.selectedReaction = this.getEmojiByUuid(emojiUuid);
                this.loadTotalReactions();
              },
              error: (err) =>
                console.error('❌ Error al agregar la reacción:', err),
            });
        }
      },
      error: (err) =>
        console.error('❌ Error al verificar reacciones existentes:', err),
    });
  }
}
