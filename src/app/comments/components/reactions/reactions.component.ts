import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../../posts/models/comment';
import { ChangeDetectorRef } from '@angular/core';
import { ViewCommentsComponent } from '../../../posts/components/view-comments/view-comments.component';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {
  @Input() commentUuid!: string; // ID del comentario
  userId: string = "";
  @ViewChild(ViewCommentsComponent) viewCommentsComponent!: ViewCommentsComponent;
  @Output() reactionUpdated = new EventEmitter<string>(); // 🔥 Emitir UUID cuando hay una reacción nueva

 comments: Comment[] = []; 
  selectedReaction: string | null = null;
  totalReactions = 0;
  showReactions = false;
  emojis: string[] = ['👍', '❤️',  '😢', '😡'];

  // Devuelve el texto adecuado según la reacción seleccionada
getReactionText(reaction: string | null): string {
  const reactionTexts: Record<string, string> = {
    '👍': 'Me gusta',
    '❤️': 'Me encanta',
    '😢': 'Me entristece',
    '😡': 'Me enoja'
  };
  return reaction ? reactionTexts[reaction] || 'Me gusta' : 'Me gusta';
}

  // Mapeo de emojis a UUIDs 
  emojiMap: Record<string, string> = {
    '👍': '3f696a78-c73f-475c-80a6-f5a858648af1',
    '❤️': '7v236a78-c73f-475c-80a6-f5a858648af1',
     '😢': 'n1596a78-c73f-475c-80a6-f5a858648af1',
    '😡': '4c806a78-c73f-475c-80a6-f5a858648af1'
  };

  // Mapeo inverso UUID → Emoji
  emojiUuidMap: Record<string, string> = Object.fromEntries(
    Object.entries(this.emojiMap).map(([emoji, uuid]) => [uuid, emoji])
  );
  isMouseOverReactions: any;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // 👈 Inyectar ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId() || "";

    if (!this.userId) {
      console.warn("⚠️ No se encontró el ID del usuario en AuthService.");
      this.userId = localStorage.getItem('userid') || "";
    }

    

    this.loadTotalReactions(); // 🔥 Cargar total de reacciones al inicializar
  }



  loadTotalReactions() {
    if (!this.commentUuid) {
      console.error("❌ No se puede cargar reacciones: `commentUuid` es undefined.");
      return;
    }

    this.commentService.getCommentReactions(this.commentUuid).subscribe({
      next: (reactions) => {
       

        this.totalReactions = reactions.length;
        this.updateReactionCounts(reactions);

        const userReaction = reactions.find(r => r.userId === this.userId);
        if (userReaction) {
          this.selectedReaction = this.getEmojiByUuid(userReaction.emojiTypeId); 
        } else {
          this.selectedReaction = null;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error al obtener reacciones del comentario:', error);
      }
    });
  }


  loadReactions(comment: Comment) {
    if (!comment || !comment.uuid) {
      console.error("❌ No se puede cargar reacciones porque `comment` es undefined.");
      return;
    }
  
    this.commentService.getCommentReactions(comment.uuid).subscribe({
      next: (reactions) => {
       
        
        this.totalReactions = reactions.length; // 🔄 Actualizar el contador
        this.updateReactionCounts(reactions); // 🔥 Actualizar el resumen de reacciones

        Object.assign(comment, { totalReactions: reactions.length });

        this.cdr.detectChanges(); // 👈 Forzar actualización en la UI

        console.log("🔄 Total de reacciones actualizado:", comment.totalReactions);
      },
      error: (error) => {
        console.error('❌ Error al obtener reacciones del comentario:', error);
      }
    });
}



  
  reactionCounts: { emoji: string, count: number }[] = [];

updateReactionCounts(reactions: any[]) {
  const countsMap = new Map<string, number>();
  const userReactions = new Map<string, string>(); // Mapear userId → emoji

  reactions.forEach(reaction => {
    const emoji = this.getEmojiByUuid(reaction.emojiTypeId);
    
    // 🔥 Solo se guarda la última reacción del usuario
    userReactions.set(reaction.userId, emoji);
    
    // 📌 Contar reacciones por tipo de emoji
    countsMap.set(emoji, (countsMap.get(emoji) || 0) + 1);
  });

  // 🔄 Actualizar la reacción del usuario en la interfaz
  if (userReactions.has(this.userId)) {
    this.selectedReaction = userReactions.get(this.userId)!;
  } else {
    this.selectedReaction = null; // Si el usuario no reaccionó
  }

  this.reactionCounts = Array.from(countsMap.entries()).map(([emoji, count]) => ({ emoji, count }));
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
// ✅ Nuevo método para mantener abierto el popup si el usuario hace clic en él
keepPopupOpen(event: Event) {
  event.stopPropagation();
}

  reactToComment(commentUuid: string, emoji: string) {
    const userId = this.authService.getUserId();
  
    if (!userId) {
      console.error("❌ No se encontró el ID del usuario. Asegúrate de que el usuario ha iniciado sesión.");
      return;
    }
  
    const emojiUuid = this.emojiMap[emoji] || emoji;
    console.log("🎯 UUID de la reacción:", emojiUuid);
  
    // 🔍 Verificar si el usuario ya reaccionó antes
    this.commentService.getCommentReactions(commentUuid).subscribe({
      next: (reactions) => {
        const existingReaction = reactions.find(r => r.userId === userId);
        
        if (existingReaction) {
          // 📌 Si el usuario ya reaccionó, actualizar el emoji en lugar de eliminarlo
          console.log("🔄 Actualizando reacción...");
          existingReaction.emojiTypeId = emojiUuid;
          this.commentService.updateReaction(existingReaction.uuid, existingReaction).subscribe({
            next: () => {
              console.log("✅ Reacción actualizada correctamente.");
              this.selectedReaction = this.getEmojiByUuid(emojiUuid);
              this.loadTotalReactions(); // 🔄 Recargar contador
            },
            error: (err) => console.error("❌ Error al actualizar la reacción:", err)
          });
        } else {
          // 📌 Si el usuario nunca reaccionó, agregar una nueva reacción
          const reactionData = {
            userId: userId,
            commentId: commentUuid,
            emojiTypeId: emojiUuid,
            reactionDate: new Date().toISOString()
          };
  
          console.log("🔥 Enviando nueva reacción...", reactionData);
  
          this.commentService.reactToComment(commentUuid, reactionData).subscribe({
            next: (response) => {
              console.log("✅ Nueva reacción agregada correctamente:", response);
              this.selectedReaction = this.getEmojiByUuid(emojiUuid);
              this.loadTotalReactions();
            },
            error: (err) => console.error("❌ Error al agregar la reacción:", err)
          });
        }
      },
      error: (err) => console.error("❌ Error al verificar reacciones existentes:", err)
    });
  }
  
  

}
