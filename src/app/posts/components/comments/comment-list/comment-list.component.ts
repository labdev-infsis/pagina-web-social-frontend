import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, Reply } from '../../../models/comment';
import { UserDetail } from '../../../models/user-detail';
import moment from 'moment-timezone';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments']) {
      this.initializeReplyLimits();
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
}