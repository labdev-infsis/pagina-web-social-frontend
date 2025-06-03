import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Comment } from '../../models/comment';
import { Institution } from '../../models/institution';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../models/post';
import { Media } from '../../models/media';
import { PostComment } from '../../models/post-comment';
import { UserDetail } from '../../models/user-detail';
import moment from 'moment-timezone';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @ViewChild('commentInput') commentInput!: ElementRef;
  @Input() institution!: Institution;
  @Input() post!: Post;
  @Input() postUuid!: string;
  @Input() postImages!: Media[];
  @Input() postAuthor!: string;
  @Input() postTime!: string;
  @Input() postDescription!: string;
  @Output() close = new EventEmitter<void>();

  newComment: string = '';
  comments: Comment[] = [];
  authenticated: boolean;
  currentUser: UserDetail | null = null;
  showCommentInput: boolean = false;

  constructor(
    private postService: PostService,
    public modal: NgbModal,
    private authService: AuthService
  ) {
    this.authenticated = authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.loadComments();
    if (this.authenticated) {
      this.loadCurrentUser();
    }
  }

  loadCurrentUser(): void {
    this.postService.getUser().subscribe({
      next: (user: UserDetail) => {
        this.currentUser = user || null;
      },
      error: (error) => {
        console.error('Error al obtener el usuario actual', error);
        this.currentUser = null;
      },
    });
  }

  

  toggleCommentInput(): void {
    this.showCommentInput = true;
    setTimeout(() => {
      this.commentInput?.nativeElement.focus();
    }, 100);
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.post?.uuid) return;

    const commentData: PostComment = {
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      postId: this.post.uuid,
      id_user: this.authService.getUserId(),
      content: this.newComment,
    };

    this.postService.addComment(this.post.uuid, commentData).subscribe({
      next: (newComment) => {
        if (this.currentUser) {
          const commentToAdd: Comment = {
            uuid: newComment.uuid || '',
            content: newComment.content,
            date: newComment.date,
            user_name: `${this.currentUser.name} ${this.currentUser.lastName}`,
            user_photo: this.currentUser.photo_profile_path,
            userId: this.currentUser.uuid,
            moderated: false,
            state: '',
            reply_count: 0,
            replies: [],
            reactions: [],
          };
          this.comments.unshift(commentToAdd);
          this.newComment = '';
          this.showCommentInput = false;
        }
      },
      error: (err) => {
        console.error('Error al agregar comentario', err);
      },
    });
  }

  handleAddReply(event: { parentUuid: string; replyText: string; isTopLevel: boolean }): void {
    if (!event.replyText.trim()) return;

    const replyData = {
      content: event.replyText,
      userId: this.authService.getUserId(),
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      parentReplyUuid: event.isTopLevel ? null : event.parentUuid,
    };

    this.postService.addReply(event.parentUuid, replyData).subscribe({
      next: (newReply) => {
        this.postService.getUser().subscribe({
          next: (user: UserDetail) => {
            const formattedReply = {
              uuid: newReply.uuid,
              content: newReply.content,
              createdDate: newReply.date || newReply.createdDate,
              name: user.name,
              lastName: user.lastName,
              user_photo: user.photo_profile_path,
              replies: [],
            };

            if (event.isTopLevel) {
              const parentComment = this.comments.find(
                (c) => c.uuid === event.parentUuid
              );
              if (parentComment) {
                parentComment.replies = parentComment.replies || [];
                parentComment.replies.unshift(formattedReply);
              }
            } else {
              this.updateNestedReplies(this.comments, event.parentUuid, formattedReply);
            }
          },
          error: (error) => console.error('Error al obtener el usuario:', error),
        });
      },
      error: (error) => console.error('Error al agregar respuesta:', error),
    });
  }

 

  calculateTimeFromNow(date: string): string {
    return moment.utc(date).local().fromNow();
  }

  calculateTimePost(): string {
    const postDate = new Date(this.post.date);
    const currentDate = new Date();
    const diferenciaMs = currentDate.getTime() - postDate.getTime();
    const unMinuto = 60 * 1000;
    const unaHora = 60 * unMinuto;
    const unDia = 24 * unaHora;
    const sieteDias = 7 * unDia;

    if (diferenciaMs < unMinuto) return 'Hace un momento';
    if (diferenciaMs < unaHora) return `Hace ${Math.floor(diferenciaMs / unMinuto)} min`;
    if (diferenciaMs < unDia) return `Hace ${Math.floor(diferenciaMs / unaHora)} h`;
    if (diferenciaMs < sieteDias) return `Hace ${Math.floor(diferenciaMs / unDia)} d`;
    
    return postDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  // Agregar este método para cargar respuestas
private loadAllReplies(): void {
  this.comments.forEach(comment => {
    this.postService.getRepliesByCommentUuid(comment.uuid).subscribe({
      next: (replies) => {
        comment.replies = replies.sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      },
      error: (error) => console.error('Error al obtener respuestas:', error)
    });
  });
}

// Modificar loadComments para cargar también las respuestas

// Agrega este método para cargar respuestas de un comentario
private loadCommentReplies(comment: Comment): void {
  this.postService.getRepliesByCommentUuid(comment.uuid).subscribe({
    next: (replies) => {
      comment.replies = replies.sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      // Cargar respuestas anidadas si existen
      if (comment.replies) {
        comment.replies.forEach(reply => {
          if (reply.replies && reply.replies.length > 0) {
            this.loadReplyReplies(reply);
          }
        });
      }
    },
    error: (error) => console.error('Error al obtener respuestas:', error)
  });
}

// Método para cargar respuestas de respuestas (anidadas)
private loadReplyReplies(reply: any): void {
  this.postService.getRepliesByCommentUuid(reply.uuid).subscribe({
    next: (nestedReplies) => {
      reply.replies = nestedReplies.sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    },
    error: (error) => console.error('Error al obtener respuestas anidadas:', error)
  });
}

// Modifica loadComments para cargar también las respuestas
loadComments(): void {
  this.postService.getPostComments(this.postUuid).subscribe({
    next: (data: Comment[]) => {
      this.comments = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      // Cargar respuestas para cada comentario
      this.comments.forEach(comment => {
        this.loadCommentReplies(comment);
      });
    },
    error: (error) => {
      console.error('Error al obtener comentarios', error);
    },
  });
}

// Asegúrate que updateNestedReplies esté correctamente implementado
private updateNestedReplies(items: any[], parentUuid: string, newReply: any): boolean {
  for (const item of items) {
    if (item.uuid === parentUuid) {
      item.replies = item.replies || [];
      item.replies.unshift(newReply);
      return true;
    }
    if (item.replies && item.replies.length > 0) {
      const found = this.updateNestedReplies(item.replies, parentUuid, newReply);
      if (found) return true;
    }
  }
  return false;
}
}