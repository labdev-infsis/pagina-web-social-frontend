import { Component, Input, Output, EventEmitter, OnInit, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../models/comment';
import { Institution } from '../../models/institution';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../models/post';
import { Media } from '../../models/media';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  private modalService = inject(NgbModal);
  @Input() institution !: Institution;
  @Input() post !: Post;
  @Input() postUuid!: string;
  @Input() postImages!: [Media]; // Imagen del post  
  @Input() postAuthor!: string; // Autor del post  
  @Input() postTime!: string; // Tiempo del post  
  @Input() postDescription!: string; // Descripción del post  
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup 


  newComment: string = ''; // Nuevo comentario  
  comments!: Comment[]; // Lista de comentarios  
  authenticated: boolean

  constructor(private postService: PostService,
    public modal: NgbModal,
    private authService: AuthService
  ) {
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit(): void {
    this.loadComments();
  }

  // Simulación de carga de comentarios  
  loadComments(): void {
    console.log("Post UUID: " + this.postUuid);
    console.log("Post: " + this.post);
    this.postService.getPostComments(this.postUuid).subscribe({
      next: (data: Comment[]) => {
        this.comments = data.reverse();
      },
      error: (error) => {
        console.error('Error to retrieve comments', error);
      }
    });
  }

  // Agregar un nuevo comentario  
  addComment(): void {
    
  }


  // Simulación de "Me gusta"  
  likeComment(comment: any): void {
    console.log(`Me gusta en el comentario: ${comment.content}`);
  }

  // Simulación de "Responder"  
  replyToComment(comment: any): void {
    console.log(`Responder al comentario: ${comment.content}`);
  }

  calculateTimePost() {
    const postDate = new Date(this.post.date)
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
    }
  }
}  