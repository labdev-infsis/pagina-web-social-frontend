import { Component, EventEmitter, Input, Output, signal, WritableSignal, inject, TemplateRef, ViewEncapsulation} from '@angular/core';
import { PostService } from '../../services/post.service';
import { CreateReaction } from '../../models/create-reaction';
import { Post } from '../../models/post';
import { Modal } from 'bootstrap';
import { Institution } from '../../models/institution';
import { UploadedDocument } from '../../models/uploaded-document';
import { ReactionsByType } from '../../models/reactions-by-type';
import { Media } from '../../models/media';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentsComponent } from './../comments/comments.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  private modalService = inject(NgbModal);
  @Input() post: any;

  @Output() requestDeletePost = new EventEmitter<string>();
  @Output() requestUpdatePost = new EventEmitter<Post>();
  institution!: Institution;
  listMediaPost!: Media[]; // Lista de imagenes videos o documento del post 
  showOptions: WritableSignal<boolean> = signal(false); // Controla la visibilidad de las opciones del post
  like = false
  myReaction = {
    class: 'default',
    emoji: 'fa-regular fa-thumbs-up',
    name: 'Me gusta'
  };
  emoji_type_id = {
    thumbs_up: "3f696a78-c73f-475c-80a6-f5a858648af1",
    red_heart: "7v236a78-c73f-475c-80a6-f5a858648af1",
    crying_face: "n1596a78-c73f-475c-80a6-f5a858648af1",
    angry_face: "4c806a78-c73f-475c-80a6-f5a858648af1"
  }
  typeImages = ['image', 'image/jpeg', 'image/jpg', 'image/png'];
  typeVideos = ['video', 'video/mp4'];
  totalReactions = signal(0);


  constructor(
    private postService: PostService
  ) {
    
   }

  ngOnInit() {

    this.listMediaPost = this.loadMediaPost();
    this.postService.getInstitution(this.post.institution_id).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.totalReactions.set(this.post.reactions.total_reactions);
  }

  deletePost(confirm: boolean) {
    if (confirm) {
      this.requestDeletePost.emit(this.post.uuid);
    }
  }

  updatePost(postUpdated: Post) {
    this.requestUpdatePost.emit(postUpdated);
  }

  sendCopyPost(): Post {//Enviar copia del post para editar
    const copyPost: Post = { ...this.post };
    return copyPost;
  }

  openViewPostComments(post: Post) {
		const modalRef = this.modalService.open(CommentsComponent, { size: 'xl' });
    modalRef.componentInstance.institution = this.institution;
    modalRef.componentInstance.post = post;
    modalRef.componentInstance.postUuid = post.uuid;
    modalRef.componentInstance.postImages = post.content.media;
    modalRef.componentInstance.postAuthor = this.institution.name;
    modalRef.componentInstance.postDate = this.calculateTimePost;
    modalRef.componentInstance.postDescription = post.content.text;
	}

  getGridClass(media: Media[]): string {
    if (media.length === 1) return 'single';
    if (media.length === 2) return 'two';
    if (media.length === 3) return 'three';
    return 'four';
  }

  // Cargar las imagenes o videos del post
  loadMediaPost() {
    let mediaOfPost: Media[] = []
    for (const media of this.post.content.media) {
      mediaOfPost.push(media);
    }
    return mediaOfPost;
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


  reactUserBoton(postUuid: any) {
    if (!this.like) { //No seleccionaron ningun emoji por default Me gusta
      this.react(postUuid, this.emoji_type_id.thumbs_up)
    } else {
      //Si reaccionaron y hacen click en el boton quitar la reaccion
    }
    //Info reactions
    //"emoji_type": "thumbs-up" like id: 
    //"emoji_type": "red-heart" encanta id:
    //"emoji_type": "crying-face"  id: 
    //"emoji_type": "angry-face" id: 

  }

  getTypeDoc(typeDoc: string) {
    if (typeDoc == 'application/pdf')
      return 'PDF';
    else if (typeDoc == 'application/pptx')
      return 'PRESENTACIÓN';
    else
      return 'DOCUMENTO';
  }

  getReactions(index: number) {
    const reactionsByType: ReactionsByType[] = this.post.reactions.reactions_by_type;
    const arrayOrdered: any[] = [...reactionsByType].sort((a: any, b: any) => b.amount - a.amount)
    const arrayFinal = arrayOrdered.filter((reaction) => reaction.amount > 0)
    // return arrayOrdered[index].emoji_type
    if (arrayFinal[index]) {
      return arrayFinal[index].emoji_type
    } else {
      return 'no hay mas reacciones'
    }
  }

  amountReactions() {
    return this.totalReactions();
  }

  amountComments() {
    return this.post.commentCounter.totalComments
  }

  recuperarReaccion() {
    let reaccionUser = this.post.reactions.reactions_by_user[0]?.user_reaction
    if (reaccionUser) {
      if (reaccionUser == 'thumbs-up') {
        this.like = true
      } else {
        this.like = false
      }
    } else {
      this.like = false
    }
  }

  clickReaction(postUuid: string, typeReaction: string) {
    this.like = true;
    if (typeReaction === 'thumbs-up') {
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-thumbs-up',
        name: 'Me gusta'
      }
      this.react(postUuid, this.emoji_type_id.thumbs_up)
    } else if (typeReaction === 'red-heart') {
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-heart',
        name: 'Me encanta'
      }
      this.react(postUuid, this.emoji_type_id.red_heart)
    } else if (typeReaction === 'crying-face') {
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me entristece'
      }
      this.react(postUuid, this.emoji_type_id.crying_face)
    } else if (typeReaction === 'angry-face') {
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me enfada'
      }
      this.react(postUuid, this.emoji_type_id.angry_face)
    }
  }

  react(postUuid: string, emoji_id: string) {
    const newReaction: CreateReaction = {
      "emoji_type_id": emoji_id,
      "reaction_date": new Date()
    }
    this.postService.postReaction(postUuid, newReaction).subscribe({
      next: () => {
        this.like = !this.like
        console.log('Reaccion exitosa')
        this.totalReactions.update(valor => valor + 1)
      },
      error: (error) => {
        console.log('No se pudo reaccionar', error)
      }
    })
  }
}
