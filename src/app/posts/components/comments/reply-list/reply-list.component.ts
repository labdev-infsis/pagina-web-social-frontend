import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reply-list',
  templateUrl: './reply-list.component.html',
  styleUrls: ['./reply-list.component.scss']
})
export class ReplyListComponent {
  @Input() parentUuid: string = '';
  @Input() replies: any[] = [];
  @Input() currentUser: any;
  @Input() replyInputVisible: any;
  @Input() replyText: any;
  @Input() replyLimit: any = {};
  @Input() authenticated: boolean = false;

  @Output() toggleReplyInput = new EventEmitter<any>();
  @Output() addReply = new EventEmitter<any>();
  @Output() showAllReplies = new EventEmitter<any>();
  @Output() showLessReplies = new EventEmitter<any>();

  getLimit(uuid: string): number {
    return this.replyLimit && this.replyLimit[uuid] ? this.replyLimit[uuid] : 2;
  }
}