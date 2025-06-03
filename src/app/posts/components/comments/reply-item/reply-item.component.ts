import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reply-item',
  templateUrl: './reply-item.component.html',
  styleUrls: ['./reply-item.component.scss']
})
export class ReplyItemComponent {
  @Input() reply: any;
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