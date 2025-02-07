import { Component, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent {
  @Input() commentUuid!: string;
  selectedReaction: string | null = null;
  totalReactions = 0;
  showReactions = false;

  emojis: string[] = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  isMouseOverReactions: any;

  constructor(private commentService: CommentService) {}


  toggleReactions(show: boolean) {
    this.showReactions = show;
  }


  delayedCloseReactions() {
    setTimeout(() => {
      if (!this.isMouseOverReactions) {
        this.showReactions = false;
      }
    }, 300); // Espera 300ms antes de cerrar
  }
  
  reactToComment(commentUuid: string, emoji: string) {
    this.selectedReaction = emoji;
    this.showReactions = false; // Cierra el menú después de seleccionar

    const reactionData = { emojiTypeId: emoji, reactionDate: new Date() };

    this.commentService.reactToComment(commentUuid, reactionData).subscribe({
      next: (response) => {
        console.log('✅ Reacción agregada:', response);
        this.totalReactions = response.totalReactions; // Actualizar con el valor real desde el backend
      },
      error: (err) => console.error('❌ Error al reaccionar:', err)
    });
  }
}
