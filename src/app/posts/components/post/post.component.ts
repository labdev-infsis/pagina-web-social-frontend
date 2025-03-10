import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { CreateReaction } from '../../models/create-reaction';
import { Post } from '../../models/post';
import { Institution } from '../../models/institution';
import { UploadedDocument } from '../../models/uploaded-document';
import { ReactionsByType } from '../../models/reactions-by-type';
import { Media } from '../../models/media';
import { PostComment } from '../../models/comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post: any;
  comments: PostComment[] = [];
  newComment: string = '';
  showCommentInput: boolean = false;

  @Output() requestDeletePost = new EventEmitter<string>();
  @Output() requestUpdatePost = new EventEmitter<Post>();
  institution!: Institution
  listMediaPost!: Media[]; // Lista de imagenes videos o documento del post 
  showComments: boolean = false; // Controla la visibilidad del popup
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


  constructor(private postService: PostService){}

  ngOnInit() {
    console.log("this.post en ngOnInit():", this.post);
  
    if (!this.post) {
      console.error("Error: this.post es undefined en ngOnInit()");
      return;
    }
  
    this.loadComments();
    this.listMediaPost = this.loadMediaPost();
  
    this.postService.getInstitution(this.post.institution_id).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  
    if (this.post.reactions) {
      this.totalReactions.set(this.post.reactions.total_reactions);
    } else {
      console.warn("Advertencia: this.post.reactions es undefined");
    }
  }
  

  loadComments() {
    this.postService.getComments(this.post.id).subscribe({
      next: (data: any) => {
        this.comments = data.map((c: any) => ({
          postId: c.postId,
          userId: c.userId,
          content: c.content,
          createdAt: c.createdAt || new Date()
        }));
      },
      error: (err) => console.error('Error al cargar comentarios', err)
    });
  }
    // Método para alternar la visibilidad del input de comentarios
    toggleCommentInput() {
      this.showCommentInput = !this.showCommentInput;
    }
  
  addComment() {
    if (!this.newComment.trim()) return;
  
    console.log("this.post antes de crear comentario:", this.post);
  
    if (!this.post || !this.post.uuid) {
      console.error("Error: this.post o this.post.uuid es undefined");
      return;
    }
  
    const commentData = {
      postId: this.post.uuid,
      userId: this.post.user_id,  
      content: this.newComment
    };
    
  
    console.log("Datos del comentario que se enviarán:", commentData);
  
    this.postService.addComment(this.post.uuid, commentData).subscribe({
      next: (newComment) => {
        this.comments.push(newComment); // Agregar el comentario a la lista
        this.newComment = ''; // Limpiar input
        this.showCommentInput = false; // 🔥 Ocultar input después de comentar
      },
      error: (err) => console.error("Error al agregar comentario", err)
    });
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

  // Mostrar el popup de comentarios
  openComments() {
    this.showComments = true;
  }
  
  // Cerrar el popup de comentarios
  closeComments() {
    this.showComments = false;
  }

  getGridClass(media: Media[]): string {
    if (media.length === 1) return 'single';
    if (media.length === 2) return 'two';
    if (media.length === 3) return 'three';
    return 'four';
  }

  // Cargar las imagenes o videos del post
  loadMediaPost(){
    let mediaOfPost: Media[] = []
    for (const media of this.post.content.media) {
      mediaOfPost.push(media);
    }
    return mediaOfPost;
  }

  calculateTimePost(){
    const postDate = new Date(this.post.date)
    const currentDate = new Date(Date.now());
    const diferenciaMs:number = currentDate.getTime() - postDate.getTime(); // Diferencia en milisegundos
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


  reactUserBoton(postUuid:any){
    if(!this.like){ //No seleccionaron ningun emoji por default Me gusta
      this.react(postUuid, this.emoji_type_id.thumbs_up)
    }else{
      //Si reaccionaron y hacen click en el boton quitar la reaccion
    }
    //Info reactions
    //"emoji_type": "thumbs-up" like id: 
    //"emoji_type": "red-heart" encanta id:
    //"emoji_type": "crying-face"  id: 
    //"emoji_type": "angry-face" id: 

  }

  getTypeDoc(typeDoc: string){
    if(typeDoc == 'application/pdf')
      return 'PDF';
    else if(typeDoc == 'application/pptx')
      return 'PRESENTACIÓN';
    else
      return 'DOCUMENTO';
  }

  getReactions(index:number){
    const reactionsByType: ReactionsByType[] = this.post.reactions.reactions_by_type;
    const arrayOrdered:any[] = [...reactionsByType].sort((a:any,b:any)=> b.amount - a.amount )
    const arrayFinal = arrayOrdered.filter((reaction) => reaction.amount >  0)
    // return arrayOrdered[index].emoji_type
    if(arrayFinal[index]){
      return arrayFinal[index].emoji_type
    }else{
      return 'no hay mas reacciones'
    }
  }

  amountReactions(){
    return this.totalReactions();
  }

  amountComments(){
    return this.post.commentCounter.totalComments
  }

  recuperarReaccion(){
    let reaccionUser = this.post.reactions.reactions_by_user[0]?.user_reaction
    if(reaccionUser){
      if(reaccionUser == 'thumbs-up'){
        this.like = true
      }else{
        this.like = false
      }
    }else{
      this.like = false
    }
  }

  clickReaction(postUuid:string, typeReaction: string){
    this.like = true;
    if(typeReaction === 'thumbs-up'){
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-thumbs-up',
        name: 'Me gusta'
      }
      this.react(postUuid, this.emoji_type_id.thumbs_up)
    }else if(typeReaction === 'red-heart'){
      this.myReaction = {
        class: typeReaction,
        emoji: 'fa-solid fa-heart',
        name: 'Me encanta'
      }
      this.react(postUuid, this.emoji_type_id.red_heart)
    }else if(typeReaction === 'crying-face'){
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me entristece'
      }
      this.react(postUuid, this.emoji_type_id.crying_face)
    }else if(typeReaction === 'angry-face'){
      this.myReaction = {
        class: typeReaction,
        emoji: '',
        name: 'Me enfada'
      }
      this.react(postUuid, this.emoji_type_id.angry_face)
    }
  }

  react(postUuid:string, emoji_id:string){
    const newReaction: CreateReaction = {
      "emoji_type_id" : emoji_id,
      "reaction_date" : new Date()
    }
    this.postService.postReaction(postUuid, newReaction).subscribe({
      next: ()=>{
        this.like = !this.like
        console.log('Reaccion exitosa')
        this.totalReactions.update(valor => valor + 1)
      },
      error:(error)=>{
        console.log('No se pudo reaccionar', error)
      }
    })
  }
}
