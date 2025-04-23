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

import moment from 'moment-timezone';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild(ViewCommentsComponent) viewCommentsComponent!: ViewCommentsComponent;
  @ViewChild('replyInput') replyInputElement!: ElementRef;

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
  replyInputVisible: { [key: string]: boolean } = {}; // Controla qué input está visible
  replyText: { [key: string]: string } = {}; // Almacena el texto de cada respuesta
  // Controla cuántas respuestas se muestran inicialmente
replyLimit: { [key: string]: number } = {};

  constructor(
    private postService: PostService,
    

    public modal: NgbModal,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // ⬅️ Añadir esta línea

  ) {
    this.authenticated = authService.isAuthenticated();
  }


// 🔥 Mostrar TODAS las respuestas
showAllReplies(commentUuid: string) {
  // Encuentra el total de respuestas para este comentario
  const totalReplies = this.comments.find(c => c.uuid === commentUuid)?.replies?.length || 0;
  
  // Muestra TODAS las respuestas
  this.replyLimit[commentUuid] = totalReplies;
}

// 🔥 Mostrar menos respuestas
showLessReplies(commentUuid: string) {
  // Restar 2 al límite actual
  this.replyLimit[commentUuid] = (this.replyLimit[commentUuid] || 2) - 2;

  // Asegurarse de que siempre muestre al menos 2 respuestas
  if (this.replyLimit[commentUuid] < 2) {
    this.replyLimit[commentUuid] = 2;
  }
}

  ngOnInit(): void {
    this.loadComments();
    console.log("Videos: " + JSON.stringify(this.postImages));
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
  console.log("Post: ", this.post);

  this.postService.getPostComments(this.postUuid).subscribe({
    next: (data: Comment[]) => {
      

      this.comments = data; // Deja los comentarios en el orden natural que llegan
      this.comments.forEach((comment) => {
        this.loadReplies(comment.uuid);
      });
      this.cdr.detectChanges(); // Forzar la actualización de la vista
    },
    error: (error) => {
      console.error('❌ Error al obtener comentarios', error);
    }
  });
}

loadReplies(commentUuid: string): void {
  this.postService.getRepliesByCommentUuid(commentUuid).subscribe({
    next: (data) => {
      console.log("✅ Respuestas recibidas:", data); // 🔥 Verifica la estructura de las respuestas

      const parentComment = this.comments.find(comment => comment.uuid === commentUuid);
      if (parentComment) {
        // 📌 Ordenar las respuestas en orden descendente (de más reciente a más antiguo)
        parentComment.replies = data.sort((a, b) => {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        });
      }

      this.cdr.detectChanges(); // 🔥 Forzar la actualización de la vista
    },
    error: (error) => console.error('❌ Error al obtener respuestas:', error)
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

  calculateTimeFromNow(date: string) {
    //  Interpretar la fecha con la zona horaria incluida (evitando doble conversión)
    const utcDate = moment.utc(date);

  
    //  Obtener la zona horaria real del usuario
    const userTimeZone = moment.tz.guess();
  
    //  Convertir la fecha a la zona horaria del usuario SIN modificar la hora
    const localDate = utcDate.clone().tz(userTimeZone, true); 
  
   
  
    return localDate.fromNow(); // "Hace 5 minutos", "Hace 2 horas", etc.
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

// Mostrar/Cerrar el input de respuesta
toggleReplyInput(commentUuid: string) {
  this.replyInputVisible[commentUuid] = !this.replyInputVisible[commentUuid];

  // 🔥 Espera un pequeño tiempo y luego pone foco en el input
  setTimeout(() => {
    const inputElement = document.querySelector(`#replyInput-${commentUuid}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, 100);
}



  //  Agregar respuesta a un comentario
addReply(commentUuid: string) {
  const replyContent = this.replyText[commentUuid]?.trim();
  if (!replyContent) return;

  this.postService.getUser().subscribe({
    next: (user: UserDetail) => {
      const replyData = {
        content: replyContent,
        user_name: user.name + ' ' + user.lastName,
        user_photo: user.photo_profile_path,
        userId: user.uuid,
        date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS') // 🔥 Formato correcto de fecha
      };

      // 🔥 Llamada al backend para crear respuesta
      this.postService.addReply(commentUuid, replyData).subscribe({
        next: (newReply: any) => {
          console.log("🔥 Nueva respuesta agregada:", newReply);

          // 📌 Añadir la respuesta solo a este comentario
          const parentComment = this.comments.find(c => c.uuid === commentUuid);
          if (parentComment) {
            parentComment.replies = parentComment.replies || [];

            // Convertir `newReply` en un objeto que tenga todas las propiedades de `Reply`
            const formattedReply = {
              uuid: newReply.uuid, //  UUID devuelto por el backend
              content: newReply.content,
              createdDate: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
              user_name: newReply.user_name,
              user_photo: newReply.user_photo
            };

            parentComment.replies.push(formattedReply); //  Agregar respuesta sin recargar
            
            // 🔥 Ordenar las respuestas en orden descendente (más reciente primero)
            parentComment.replies.sort((a, b) => {
              return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            });
          }

          this.replyText[commentUuid] = ""; // Limpiar el input
          this.replyInputVisible[commentUuid] = false; //  Ocultar el input
          this.cdr.detectChanges();
        },
        error: (error) => console.error('❌ Error al agregar respuesta:', error)
      });
    },
    error: (error) => console.error('❌ Error al obtener el usuario:', error)
  });
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

    
           // 🔥 Recargar comentarios para obtener la fecha correcta desde el backend
      this.loadComments();
      },
      error: (err) => console.error("❌ Error al agregar comentario", err)
    });
  }

}  