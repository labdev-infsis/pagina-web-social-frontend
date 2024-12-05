import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number; // ID del post
  @Input() postTitle!: string; // Título del post
  @Input() postImage!: string; // Imagen del post
  @Input() postDescription!: string; // Descripción del post
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup
  comments: any[] = []; // Lista de comentarios
  newComment: string = ''; // Nuevo comentario

  constructor() {}

  ngOnInit(): void {
    this.loadComments();
  }

  // Simulación de carga de comentarios
  loadComments(): void {
    this.comments = [
      { user: 'Usuario 1', content: '¡Gran publicación!' },
      { user: 'Usuario 2', content: 'Muy interesante, gracias por compartir.' },
    ];
  }

  // Agregar un nuevo comentario
  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        user: 'Usuario actual',
        content: this.newComment,
      });
      this.newComment = '';
    }
  }

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