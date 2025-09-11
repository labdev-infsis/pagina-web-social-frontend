// import { Component, Input, signal } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';
// import { Post } from '../../../models/post';

// // Si quieres reutilizar el tipo Post del otro componente, impórtalo de tu models
// interface Media {
//   number: number;
//   type: string;
//   name: string;
//   path: string;
//   fb_media_id?: string | null;
// }

// @Component({
//   selector: 'app-page',
//   templateUrl: './page.component.html',
//   styleUrl: './page.component.scss'
// })
// export class PageComponent {
//   public post: Post | null = null;
//   loading: boolean = true;
//   error: string | null = null;
//   posts: Post[] = [];
//   private apiUrl = 'https://devpws.cs.umss.edu.bo/api/v1/posts';

//   /** ✅ nuevo: indica si el usuario está logueado */
//   authenticated = true; // o leerlo desde tu AuthService

//   /** contadores que vienen desde el padre - borrar???*/
//   @Input() totalReactions = signal(0);
//   @Input() totalComments = signal(0);
//   // totalReactions = signal(0);
//   // totalComments = signal(0);

//   /** nuevo: reusa la misma estructura de reacción que PostComponent */
//   myReaction = {
//     class: 'default',
//     emoji: 'fa-regular fa-thumbs-up',
//     name: 'Me gusta'
//   };

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient
//   ) { }

//   ngOnInit() {
//     this.route.paramMap.subscribe(params => {
//       const postId = params.get('id');
//       if (postId) {
//         this.loadPost(postId);
//       } else {
//         this.error = 'ID de publicación no válido';
//         this.loading = false;
//       }
//     });
//   }

//   loadPost(postId: string) {
//     this.loading = true;
//     this.error = null;

//     this.http.get<Post>(`${this.apiUrl}/${postId}`)
//       .pipe(
//         catchError(error => {
//           this.error = 'Error al cargar la publicación';
//           this.loading = false;
//           console.error('Error:', error);
//           return throwError(() => error);
//         })
//       )
//       .subscribe({
//         next: (post) => {
//           this.post = post;
//           this.loading = false;
//         },
//         error: () => {
//           this.loading = false;
//         }
//       });
//   }

//   /** ✅ nuevo: llamado desde (likeClicked) */
//   reactUserBoton(postUuid: string) {
//     // Aquí puedes reusar la lógica del PostComponent o hacer algo simple:
//     console.log('Like en post', postUuid);
//     // Ejemplo: cambiar solo visualmente:
//     this.myReaction = {
//       class: 'thumbs-up',
//       emoji: 'fa-solid fa-thumbs-up',
//       name: 'Me gusta'
//     };
//   }

//   /** ✅ nuevo: llamado desde (commentClicked) */
//   openViewPostComments(post: Post) {
//     // Aquí puedes abrir tu modal de comentarios o navegar
//     console.log('Abrir comentarios del post', post.uuid);
//     // this.modalService.open(...)
//   }

//   sharePost(post: Post) {
//     console.log('Share post:', post.uuid);
//     const url = `localhost:4200/post/${post.uuid}`;
//     navigator.clipboard.writeText(url).then(() => {
//       alert('Enlace del post copiado al portapapeles');
//     });
//   }

// }


import { Component, Input, signal, inject, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Post } from '../../../models/post';
import { Institution } from '../../../models/institution';
import { Media } from '../../../models/media';
import { PostService } from '../../../services/post.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDetail } from '../../../models/user-detail';
import { CommentsComponent } from '../../comments/comments.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  private modalService = inject(NgbModal);
  private postService = inject(PostService);

  public post: Post | null = null;
  loading: boolean = true;
  error: string | null = null;
  private apiUrl = 'https://devpws.cs.umss.edu.bo/api/v1/posts';

  // Propiedades del PostComponent original
  institution!: Institution;
  listMediaPost: Media[] = [];
  showOptions = signal(false);
  openModalEdit = signal(false);
  typeImages = ['image', 'image/jpeg', 'image/jpg', 'image/png'];
  typeVideos = ['video', 'video/mp4'];

  authenticated = true; // Cambiar según tu lógica de autenticación
  currentUser!: UserDetail; // Debes obtener esto de tu servicio de autenticación

  // Reacción del usuario
  myReaction = {
    class: 'default',
    emoji: 'fa-regular fa-thumbs-up',
    name: 'Me gusta'
  };

  like = false;
  emoji_type_id = {
    thumbs_up: "3f696a78-c73f-475c-80a6-f5a858648af1",
    red_heart: "7v236a78-c73f-475c-80a6-f5a858648af1",
    crying_face: "n1596a78-c73f-475c-80a6-f5a858648af1",
    angry_face: "4c806a78-c73f-475c-80a6-f5a858648af1"
  };

  // Signals para contadores
  totalReactions = signal(0);
  totalComments = signal(0);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Obtener usuario actual (debes implementar según tu auth service)
    // this.currentUser = this.authService.getCurrentUser();

    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');
      if (postId) {
        this.loadPost(postId);
      } else {
        this.error = 'ID de publicación no válido';
        this.loading = false;
      }
    });
  }

  loadPost(postId: string) {
    this.loading = true;
    this.error = null;

    this.http.get<Post>(`${this.apiUrl}/${postId}`)
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar la publicación';
          this.loading = false;
          console.error('Error:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (post) => {
          this.post = post;
          this.initializePostData(post);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  private initializePostData(post: Post) {
    if (!post) return;

    // Cargar medios
    this.listMediaPost = this.loadMediaPost(post);

    // Cargar institución
    this.loadInstitution(post.institution_id);

    // Configurar reacciones y comentarios
    if (post.reactions) {
      this.totalReactions.set(post.reactions.total_reactions);
      this.recuperarReaccion(post);
    }

    if (post.commentCounter) {
      this.totalComments.set(post.commentCounter.totalComments);
    }
  }

  private loadMediaPost(post: Post): Media[] {
    return [...post.content.media];
  }

  private loadInstitution(institutionId: string) {
    this.postService.getInstitution(institutionId).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log('Error loading institution:', error);
      }
    });
  }

  // Métodos del PostComponent original
  calculateTimePost(): string {
    if (!this.post) return '';

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

  getGridClass(media: Media[]): string {
    if (media.length === 1) return 'single';
    if (media.length === 2) return 'two';
    if (media.length === 3) return 'three';
    return 'four';
  }

  allowedTextLength(): boolean {
    return this.post ? this.post.content.text.length <= 480 : false;
  }

  adjustedTextLength(): string {
    return this.post ? this.post.content.text.slice(0, 480) + '... ' : '';
  }

  showAllText(id: string) {
    const textPost = document.getElementById('text-post-' + id) as HTMLParagraphElement;
    if (textPost && this.post) {
      textPost.innerHTML = this.post.content.text;
    }
  }

  // Métodos de reacciones
  reactUserBoton(postUuid: any) {
    if (!this.like) {
      this.react(postUuid, this.emoji_type_id.thumbs_up);
      this.myReaction = {
        class: 'thumbs-up',
        emoji: 'fa-solid fa-thumbs-up',
        name: 'Me gusta'
      };
      this.incrementTotalReactions();
    } else {
      this.removeReaction(postUuid);
    }
  }

  removeReaction(postUuid: string) {
    this.postService.deleteReaction(postUuid).subscribe({
      next: () => {
        this.like = false;
        this.myReaction = {
          class: 'default',
          emoji: 'fa-regular fa-thumbs-up',
          name: 'Me gusta'
        };
        this.totalReactions.update(valor => valor - 1);
      },
      error: (error) => {
        console.log('No se pudo eliminar la reacción', error);
      }
    });
  }

  clickReaction(postUuid: string, typeReaction: string, event: Event) {
    event.stopPropagation();

    if (typeReaction === 'thumbs-up') {
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-thumbs-up',
        name: 'Me gusta'
      };
      this.incrementTotalReactions();
      this.react(postUuid, this.emoji_type_id.thumbs_up);
    } else if (typeReaction === 'red-heart') {
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-heart',
        name: 'Me encanta'
      };
      this.incrementTotalReactions();
      this.react(postUuid, this.emoji_type_id.red_heart);
    } else if (typeReaction === 'crying-face') {
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me entristece'
      };
      this.incrementTotalReactions();
      this.react(postUuid, this.emoji_type_id.crying_face);
    } else if (typeReaction === 'angry-face') {
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me enfada'
      };
      this.incrementTotalReactions();
      this.react(postUuid, this.emoji_type_id.angry_face);
    }
  }

  incrementTotalReactions() {
    if (this.like == false) {
      this.totalReactions.update(valor => valor + 1);
    }
  }

  react(postUuid: string, emoji_id: string) {
    const newReaction = {
      "emoji_type_id": emoji_id,
      "reaction_date": new Date()
    };

    this.postService.postReaction(postUuid, newReaction).subscribe({
      next: () => {
        this.like = true;
        console.log('Reacción exitosa');
      },
      error: (error) => {
        console.log('No se pudo reaccionar', error);
      }
    });
  }

  private recuperarReaccion(post: Post) {
    let reaccionUser = post.reactions.my_reaction_emoji;
    if (reaccionUser) {
      this.like = true;
      if (reaccionUser === 'thumbs-up') {
        this.myReaction = {
          class: reaccionUser,
          emoji: 'fa-solid fa-thumbs-up',
          name: 'Me gusta'
        };
      } else if (reaccionUser === 'red-heart') {
        this.myReaction = {
          class: reaccionUser,
          emoji: 'fa-solid fa-heart',
          name: 'Me encanta'
        };
      } else if (reaccionUser === 'crying-face') {
        this.myReaction = {
          class: reaccionUser,
          emoji: '',
          name: 'Me entristece'
        };
      } else if (reaccionUser === 'angry-face') {
        this.myReaction = {
          class: reaccionUser,
          emoji: '',
          name: 'Me enfada'
        };
      }
    } else {
      this.like = false;
    }
  }

  // Métodos de comentarios
  openViewPostComments(post: Post) {
    const modalRef = this.modalService.open(CommentsComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.institution = this.institution;
    modalRef.componentInstance.post = post;
    modalRef.componentInstance.postUuid = post.uuid;
    modalRef.componentInstance.postImages = post.content.media;
    modalRef.componentInstance.postAuthor = this.institution.name;
    modalRef.componentInstance.postDate = this.calculateTimePost();
    modalRef.componentInstance.postDescription = post.content.text;

    modalRef.dismissed.subscribe(() => {
      this.totalComments.set(modalRef.componentInstance.comments.length);
    });
  }

  // Métodos auxiliares para el template
  amountReactions(): number {
    return this.totalReactions();
  }

  amountComments(): number {
    return this.totalComments();
  }

  //----------------------------------------------
  updatePost(postUpdated: Post) {
    if (this.post) {
      this.post = { ...postUpdated };

      this.initializePostData(this.post);

      console.log('Post actualizado:', this.post);

      alert('La publicación fue actualizada exitosamente');
    }
  }

  sendCopyPost(): Post {
    if (!this.post) {
      throw new Error('No post available to copy');
    }

    const copyPost: Post = JSON.parse(JSON.stringify(this.post));
    return copyPost;
  }

  deletePost(confirm: boolean) {
    if (confirm && this.post) {
      this.postService.deletePost(this.post.uuid).subscribe({
        next: () => {
          console.log('Post eliminado exitosamente');
          alert('La publicación fue eliminada exitosamente');

          this.post = null;
        },
        error: (error) => {
          console.error('Error al eliminar el post:', error);
          alert('No se pudo eliminar la publicación');
        }
      });
    }
  }
}