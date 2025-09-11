import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../models/post';
import { UserDetail } from '../../../models/user-detail';

@Component({
  selector: 'app-post-reactions',
  templateUrl: './post-actions.component.html',
  styleUrls: ['./post-actions.component.scss']
})
export class PostActionsComponent {
  @Input() post!: Post;
  @Input() authenticated: boolean = false;
  @Input() currentUser!: UserDetail;
  @Input() myReaction: any;
  @Input() totalReactions: number = 0;
  @Input() totalComments: number = 0;
  @Input() postUrl!: string;

  @Output() reactionChanged = new EventEmitter<void>();
  @Output() likeClicked = new EventEmitter<void>();
  @Output() commentClicked = new EventEmitter<void>();
  @Output() reactionSelected = new EventEmitter<{ type: string, event: Event }>();

  onLikeClicked() {
    this.likeClicked.emit();
  }

  onCommentClicked() {
    this.commentClicked.emit();
  }

  onReactionSelected(type: string, event: Event) {
    event.stopPropagation();
    this.reactionSelected.emit({ type, event });
  }

  onShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Mira esta publicación',
        url: this.postUrl
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(this.postUrl).then(() => {
        alert('URL copiada al portapapeles');
      });
    }
  }
}