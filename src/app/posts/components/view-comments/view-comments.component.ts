import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../../comments/services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../models/comment';
import { PostComponent } from '../post/post.component';
import { ChangeDetectorRef } from '@angular/core';

import { Post } from '../../models/post';

import moment from 'moment';
//import moment from 'moment-timezone';
import 'moment/locale/es';

@Component({
  selector: 'app-view-comments',
  templateUrl: './view-comments.component.html',
  styleUrl: './view-comments.component.scss',
})
export class ViewCommentsComponent implements OnInit {
  @Input() postUuid!: string; // UUID del post
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup
  @Input() post!: Post;
  @Output() reactionUpdated = new EventEmitter<string>(); // Emitirá el UUID del comentario actualizado

  comments: Comment[] = [];
  newComment: string = ''; // Nuevo comentario
  authenticated: boolean;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,

    private cdr: ChangeDetectorRef // 👈 Agregar esto
  ) {
    this.authenticated = authService.isAuthenticated();
    moment.locale();
  }

  ngOnInit(): void {
    this.loadComments();

    // 🔥 Escuchar cuando `reactionUpdated` se emite desde `ReactionsComponent`
    this.reactionUpdated.subscribe((commentUuid) => {
      console.log(
        `🔄 Recibida actualización de reacciones para comentario: ${commentUuid}`
      );
      this.updateReactions(commentUuid);
    });
  }

  // Cargado de comentarios
  loadComments(): void {
    console.log('Cargando Comentarios....:');
    this.postService.getPostComments(this.postUuid).subscribe({
      next: (data: Comment[]) => {
        if (!data || data.length === 0) {
          console.warn('⚠️ No hay comentarios aún, esperando carga.'); // ✅ SOLO si está vacío
          this.comments = [];
          return;
        }

        this.comments = [...data.reverse()]; // 🔄 Recargar lista de comentarios
        console.log('✅ Comentarios recargados:', this.comments);

        // ✅ Llamamos `loadReactions` después de confirmar que `comments` está definido
        this.comments.forEach((comment) => this.loadReactions(comment));

        this.cdr.detectChanges(); // 🔄 Forzar actualización de la vista
      },
      error: (error) => {
        console.error('❌ Error al recuperar comentarios', error);
      },
    });
  }

  loadReactions(comment: Comment) {
    if (!comment || !comment.uuid) {
      console.error(
        '❌ No se puede cargar reacciones porque `comment` es undefined.'
      );
      return;
    }

    this.commentService.getCommentReactions(comment.uuid).subscribe({
      next: (reactions) => {
        comment.reactions = reactions || [];
        comment.totalReactions = reactions.length; // ✅ Actualizamos la cantidad de reacciones

        console.log(
          `🔄 Total de reacciones actualizado: ${comment.totalReactions}`
        );

        this.cdr.detectChanges(); // 🔥 Asegurar que la UI se actualice con los nuevos datos
      },
      error: (error) => {
        console.error('❌ Error al obtener reacciones del comentario:', error);
      },
    });
  }

  updateReactions(commentUuid: string) {
    const comment = this.comments.find((c) => c.uuid === commentUuid);
    if (comment) {
      this.loadReactions(comment);
    } else {
      console.warn(
        '⚠️ No se encontró el comentario en `ViewCommentsComponent`.'
      );
    }
  }

  calculateTime(comment: Comment) {
    var dateComment = moment(comment.date).add(4, 'hours');
    return dateComment.fromNow();
    /*
    const postDate = new Date(comment.date)
    const currentDate = new Date(Date.now());
    const diferenciaMs: number = currentDate.getTime() - postDate.getTime(); // Diferencia en milisegundos
    const unMinuto = 60 * 1000;
    const unaHora = 60 * unMinuto;
    const unDia = 24 * unaHora;
    const sieteDias = 7 * unDia;

    if (diferenciaMs < unMinuto) {
      return 'Hace un momento';
    } else if (diferenciaMs < unaHora) {
      const minutos = Math.floor(diferenciaMs / unMinuto);
      return `Hace ${minutos} min`;
    } else if (diferenciaMs < unDia) {
      const horas = Math.floor(diferenciaMs / unaHora);
      return `Hace ${horas} h`;
    } else if (diferenciaMs < sieteDias) {
      const dias = Math.floor(diferenciaMs / unDia);
      return `Hace ${dias} d`;

    } else {
      const opciones: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return postDate.toLocaleDateString('es-ES', opciones);
    }*/
  }

  // Agregar un nuevo comentario
  /* 
addComment(): void {
  if(this.newComment.trim()) {
  this.comments.push({
    user: 'Usuario actual',
    content: this.newComment,
  });
  this.newComment = '';
}  
  }
*/

  // Cerrar el popup
  closePopup(): void {
    this.close.emit();
  }

  // Simulación de "Me gusta"
  likeComment(comment: any): void {
    console.log(`Me gusta en el comentario: ${comment.content}`);
  }

  // Simulación de "Responder"
  replyToComment(comment: any): void {
    console.log(`Responder al comentario: ${comment.content}`);
  }
}
