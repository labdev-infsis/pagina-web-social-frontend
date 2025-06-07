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
  @Input() replyInputVisible: { [key: string]: boolean } = {};
  @Input() replyText: { [key: string]: string } = {};
  @Input() replyLimit: { [key: string]: number } = {};
  @Input() authenticated: boolean = false;

  @Output() toggleReplyInput = new EventEmitter<string>();
  @Output() addReply = new EventEmitter<{ replyUuid: string, isTopLevel: boolean }>();
  @Output() showAllReplies = new EventEmitter<string>();
  @Output() showLessReplies = new EventEmitter<string>();

  // Devuelve el límite de respuestas a mostrar para un uuid
  getLimit(uuid: string): number {
    return this.replyLimit && this.replyLimit[uuid] ? this.replyLimit[uuid] : 0;
  }

  // Calcula el tiempo desde la fecha (puedes mejorar esto usando moment.js si lo tienes)
  calculateTimeFromNow(date: string): string {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
    if (diff < 60) return 'hace unos segundos';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return created.toLocaleDateString();
  }
  
}