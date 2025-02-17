import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../models/comment';
import { Institution } from '../../models/institution';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../models/post';
import { Media } from '../../models/media';
import { PostComment } from '../../models/post-comment';
import { ChangeDetectorRef } from '@angular/core';
import { ViewCommentsComponent } from '../view-comments/view-comments.component';
import { UserDetail } from '../../models/user-detail';
import moment from 'moment';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild(ViewCommentsComponent) viewCommentsComponent!: ViewCommentsComponent;

  @Input() institution !: Institution;
  @Input() post !: Post;
  @Input() postUuid!: string;
  @Input() postImages!: [Media]; // Imagen del post  
  @Input() postAuthor!: string; // Autor del post  
  @Input() postTime!: string; // Tiempo del post  
  @Input() postDescription!: string; // Descripción del post  
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup 
  @Output() commentAdded = new EventEmitter<void>(); // 🔥 Emitir evento cuando se agrega un comentario
  newComments: PostComment[] = [];
  showCommentInput: boolean = false;
  newComment: string = ''; // Nuevo comentario  
  comments!: Comment[]; // Lista de comentarios  
  authenticated: boolean;
  currentUser!: UserDetail;
  currentComment!: Comment;


  constructor(
    private postService: PostService,

    public modal: NgbModal,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // ⬅️ Añadir esta línea

  ) {
    this.authenticated = authService.isAuthenticated();
  }


  ngOnInit(): void {
    this.loadComments();

    this.postService.getUser().subscribe({
      next: (user: UserDetail) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual', error);
      }
    });
  }

  // Simulación de carga de comentarios  
  loadComments(): void {
    console.log("Post UUID: " + this.postUuid);
    console.log("Post: " + this.post);
    this.postService.getPostComments(this.postUuid).subscribe({
      next: (data: Comment[]) => {
        this.comments = data.reverse(); // Asegurarnos de mostrar los más recientes primero
        this.cdr.detectChanges(); // Forzar la actualización de la vista
      },
      error: (error) => {
        console.error('Error al obtener comentarios', error);
      }
    });
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

  // Método para alternar la visibilidad del input de comentarios
  toggleCommentInput() {
    this.showCommentInput = true;

    //  Espera un pequeño tiempo y luego pone foco en el input
    setTimeout(() => {
      this.commentInput?.nativeElement.focus();
    }, 100);
  }



  addComment() {
    if (!this.newComment.trim()) return;


    if (!this.post || !this.post.uuid) {
      
      return;
    }

   
    this.postService.getUser().subscribe({
      next: (user: UserDetail) => {
        this.currentUser = user;
      
        const commentToAdd: Comment = {
          uuid: '',
          content: this.newComment,
          date:  moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          user_name: this.currentUser.name + ' ' + this.currentUser.lastName,
          user_photo: this.currentUser.photo_profile_path,
          userId: this.currentUser.uuid,
          moderated: false,
          state: '',
          reply_count: 0
        };

        this.comments.push(commentToAdd);

        console.log("Date: ", moment());

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual', error);
      }
    });

const commentData: PostComment = {
    date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
    postId: this.post.uuid,
    id_user: this.authService.getUserId(),  // ✅ Corregido a `id_user`
    content: this.newComment
};

    
    
    

    console.log("Datos del comentario que se enviarán:", commentData);

    this.postService.addComment(this.post.uuid, commentData).subscribe({
      next: (newComment) => {
        console.log(" Comentario agregado en backend:", newComment);

        this.newComment = ''; //  Limpiar input
        this.showCommentInput = false; //  Ocultar input

        // 🔥 Llamar explícitamente a loadComments() en ViewCommentsComponent
        if (this.viewCommentsComponent) {
          this.viewCommentsComponent.loadComments();
        }
      },
      error: (err) => console.error("❌ Error al agregar comentario", err)
    });
  }

}  