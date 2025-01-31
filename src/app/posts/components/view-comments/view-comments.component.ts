import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-view-comments',
  templateUrl: './view-comments.component.html',
  styleUrl: './view-comments.component.scss'
})
export class ViewCommentsComponent implements OnInit {
  @Input() postUuid!: string; // UUID del post  
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup  
  comments!: Comment[]; // Lista de comentarios  
  newComment: string = ''; // Nuevo comentario  
  authenticated: boolean

  constructor(private postService: PostService,
    private authService: AuthService
  ) {
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit(): void {
    this.loadComments();
  }

  // Cargado de comentarios  
  loadComments(): void {
    //const uuid = "5f9ab4e8-0856-4aad-b3aa-747e2dba76d9";
    this.postService.getPostComments(this.postUuid).subscribe({
      next: (data: Comment[]) => {
        this.comments = data.reverse();
        console.log("Holaaa:" + this.comments[0])
      },
      error: (error) => {
        console.error('Error to retrieve comments', error);
      }
    });
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
