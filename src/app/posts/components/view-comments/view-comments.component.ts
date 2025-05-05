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
  @Input() postUuid!: string;
  @Output() close = new EventEmitter<void>();
  @Input() post!: Post;
  @Output() reactionUpdated = new EventEmitter<string>();

  comments: Comment[] = [];
  newComment: string = ''; // Nuevo comentario

  ngOnInit(): void {}

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
