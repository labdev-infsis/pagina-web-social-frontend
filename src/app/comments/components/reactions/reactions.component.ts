import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {
  @Input() commentUuid!: string; // ID del comentario
  selectedReaction: string | null = null;
  totalReactions = 0;
  showReactions = false;
  userId: string | null = null; // Variable para almacenar el userId

  emojis: string[] = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  emojiMap: { [key: string]: string } = {
    '👍': 'like',
    '❤️': 'love',
    '😂': 'haha',
    '😮': 'wow',
    '😢': 'sad',
    '😡': 'angry'
  };

  isMouseOverReactions: any;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log("🔍 ID del usuario en `ReactionsComponent` obtenido desde AuthService:", this.userId);

    if (!this.userId) {
      console.warn("⚠️ No se encontró el ID del usuario, verificando manualmente en localStorage...");
      this.userId = localStorage.getItem('userid');
    }
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

  reactToComment(commentUuid: string, emoji: string) {
    if (!this.userId) {
      console.error("❌ No se encontró el ID del usuario. Asegúrate de que el usuario ha iniciado sesión.");
      return;
    }

    const reactionData = {
      userId: this.userId, 
      commentId: commentUuid, 
      emojiTypeId: emoji, 
      reactionDate: new Date().toISOString()
    };

    console.log("✅ Enviando reacción:", reactionData);

    this.commentService.reactToComment(commentUuid, reactionData).subscribe({
      next: (response) => {
        console.log("✅ Reacción agregada con éxito:", response);
      },
      error: (err) => console.error("❌ Error al reaccionar:", err)
    });
  }
}
