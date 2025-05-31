import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';

import { Comment } from '../../models/comment';
import { Reply } from '../../models/comment';
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
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild(ViewCommentsComponent)
  viewCommentsComponent!: ViewCommentsComponent;
  @ViewChild('replyInput') replyInputElement!: ElementRef;

  @Input() institution!: Institution;
  @Input() post!: Post;
  @Input() postUuid!: string;
  @Input() postImages!: [Media];
  @Input() postAuthor!: string;
  @Input() postTime!: string;
  @Input() postDescription!: string;
  @Output() close = new EventEmitter<void>();
  @Output() commentAdded = new EventEmitter<void>();
  newComments: PostComment[] = [];
  showCommentInput: boolean = false;
  newComment: string = '';
  comments!: Comment[];
  authenticated: boolean;
  currentUser: UserDetail | null = null;
  currentComment!: Comment;
  replyInputVisible: { [key: string]: boolean } = {};
  replyText: { [key: string]: string } = {};
  replyLimit: { [key: string]: number } = {};
  replyVisibility: { [key: string]: boolean } = {};
  showReplies: { [key: string]: boolean } = {};


  constructor(
    private postService: PostService,

    public modal: NgbModal,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {    
    this.authenticated = authService.isAuthenticated();
  }

  showLessReplies(uuid: string) {
    this.replyLimit[uuid] = 2;
    this.replyVisibility[uuid] = false;
    this.cdr.detectChanges();
  }

  showAllReplies(uuid: string) {
    const item = this.findItemByUuid(uuid, this.comments);
    if (item) {
      this.replyLimit[uuid] = item.replies?.length || 0;
      this.replyVisibility[uuid] = true;
      this.cdr.detectChanges();
    }
  }

  findItemByUuid(uuid: string, items: any[]): any {
    for (let item of items) {
      if (item.uuid === uuid) return item;
      if (item.replies && item.replies.length) {
        let found = this.findItemByUuid(uuid, item.replies);
        if (found) return found;
      }
    }
    return null;
  }

  toggleReplies(replyUuid: string) {
    this.showReplies[replyUuid] = !this.showReplies[replyUuid];
  }

  ngOnInit(): void {
    this.loadComments();
    if (this.authenticated) {
      this.postService.getUser().subscribe({
        next: (user: UserDetail) => {
          this.currentUser = user || null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener el usuario actual', error);
          this.currentUser = null;
        },
      });
    }

  }

  loadComments(): void {
    this.postService.getPostComments(this.postUuid).subscribe({
      next: (data: Comment[]) => {
        this.comments = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.comments.forEach((comment) => {
          this.replyLimit[comment.uuid] = 2;
          this.replyVisibility[comment.uuid] = false;
          this.loadReplies(comment.uuid);
        });

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error al obtener comentarios', error);
      },
    });
  }

  loadReplies(commentUuid: string): void {
    this.postService.getRepliesByCommentUuid(commentUuid).subscribe({
      next: (data) => {
        const parentComment = this.comments.find(
          (comment) => comment.uuid === commentUuid
        );
        if (parentComment) {
          parentComment.replies = data.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          );

          parentComment.replies.forEach((reply) => {
            this.replyLimit[reply.uuid] = 2;
            this.replyVisibility[reply.uuid] = false;
            if (reply.replies) {
              this.initializeNestedReplies(reply.replies);
            }
          });
        }

        this.cdr.detectChanges();
      },
      error: (error) => console.error('❌ Error al obtener respuestas:', error),
    });
  }

  initializeNestedReplies(replies: any[]): void {
    replies.forEach((reply) => {
      if (reply.replies && reply.replies.length > 0) {
        reply.replies = reply.replies.sort(
          (
            a: { createdDate: string | number | Date },
            b: { createdDate: string | number | Date }
          ) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );
        this.initializeNestedReplies(reply.replies);
      }
      this.replyLimit[reply.uuid] = 2;
      this.replyVisibility[reply.uuid] = false;
    });
  }

  likeComment(comment: any): void { }

  replyToComment(comment: any): void { }

  calculateTimeFromNow(date: string) {
    const utcDate = moment.utc(date);

    const userTimeZone = moment.tz.guess();

    const localDate = utcDate.clone().tz(userTimeZone, true);

    return localDate.fromNow();
  }

  calculateTimePost() {
    const postDate = new Date(this.post.date);
    const currentDate = new Date(Date.now());
    const diferenciaMs: number = currentDate.getTime() - postDate.getTime();
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

  toggleCommentInput() {
    this.showCommentInput = true;

    setTimeout(() => {
      this.commentInput?.nativeElement.focus();
    }, 100);
  }
  toggleReplyInput(replyUuid: string) {
    Object.keys(this.replyInputVisible).forEach((key) => {
      this.replyInputVisible[key] = false;
    });

    this.replyInputVisible[replyUuid] = true;

    setTimeout(() => {
      const input = document.querySelector(
        `#replyInput-${replyUuid}`
      ) as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  addReply(
    commentUuid: string,
    parentUuid: string | null,
    isReplyToComment: boolean
  ) {
    const replyContent = this.replyText[parentUuid || commentUuid]?.trim();
    if (!replyContent) return;

    const replyData = {
      content: replyContent,
      userId: this.authService.getUserId(),
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      parentReplyUuid: isReplyToComment ? null : parentUuid,
    };

    this.postService.addReply(commentUuid, replyData).subscribe({
      next: (newReply: any) => {
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

            if (isReplyToComment) {
              const parentComment = this.comments.find(
                (c) => c.uuid === commentUuid
              );
              if (parentComment) {
                parentComment.replies = parentComment.replies || [];
                parentComment.replies.unshift(formattedReply);
              }
            } else {
              const findParentReply = (
                replies: Reply[],
                uuid: string
              ): Reply | undefined => {
                for (const reply of replies) {
                  if (reply.uuid === uuid) return reply;
                  if (reply.replies?.length) {
                    const found = findParentReply(reply.replies, uuid);
                    if (found) return found;
                  }
                }
                return undefined;
              };

              let parentReplyFound = false;
              for (const comment of this.comments) {
                const parentReply = findParentReply(
                  comment.replies || [],
                  parentUuid || commentUuid
                );
                if (parentReply) {
                  parentReply.replies = parentReply.replies || [];
                  parentReply.replies.unshift(formattedReply);

                  parentReplyFound = true;
                  break;
                }
              }

              if (!parentReplyFound) {
                console.error(
                  `❌ No se encontró la respuesta padre con UUID: ${parentUuid}`
                );
              }
            }

            this.replyText[parentUuid || commentUuid] = '';
            this.replyInputVisible[parentUuid || commentUuid] = false;

            this.cdr.detectChanges();
          },
          error: (error) =>
            console.error('❌ Error al obtener el usuario:', error),
        });
      },
      error: (error) => console.error('❌ Error al agregar respuesta:', error),
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    if (!this.post || !this.post.uuid) {
      return;
    }

    const commentData: PostComment = {
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      postId: this.post.uuid,
      id_user: this.authService.getUserId(),
      content: this.newComment,
    };

    this.postService.addComment(this.post.uuid, commentData).subscribe({
      next: (newComment) => {
        this.postService.getUser().subscribe({
          next: (user: UserDetail) => {
            this.currentUser = user;

            const commentToAdd: Comment = {
              uuid: newComment.uuid || '',
              content: newComment.content,
              date: newComment.date,
              user_name:
                this.currentUser.name + ' ' + this.currentUser.lastName,
              user_photo: this.currentUser.photo_profile_path,
              userId: this.currentUser.uuid,
              moderated: false,
              state: '',
              reply_count: 0,
              replies: [],
              reactions: [],
            };

            this.comments.unshift(commentToAdd);
            this.cdr.detectChanges();

            this.newComment = '';
            this.showCommentInput = false;
          },
          error: (error) => {
            console.error('❌ Error al obtener el usuario actual', error);
          },
        });
      },
      error: (err) => {
        console.error('❌ Error al agregar comentario', err);
      },
    });
  }
}