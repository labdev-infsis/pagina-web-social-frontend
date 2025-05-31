import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {
  @Input() comment: any;
  @Input() currentUser: any;
  @Input() replyInputVisible: any;
  @Input() replyText: any;
  @Input() replyLimit: any;
  @Input() authenticated: boolean = false;

  @Output() toggleReplyInput = new EventEmitter<any>();
  @Output() addReply = new EventEmitter<any>();
  @Output() showAllReplies = new EventEmitter<any>();
  @Output() showLessReplies = new EventEmitter<any>();

  calculateTimeFromNow(date: string) {
    // Implementa tu lógica de tiempo aquí
    return '';
  }

  onToggleReplyInput(uuid: string) {
    this.toggleReplyInput.emit(uuid);
  }

  onAddReply(commentUuid: string, parentUuid: string, isReplyToComment: boolean) {
    this.addReply.emit({ commentUuid, parentUuid, isReplyToComment });
  }
}