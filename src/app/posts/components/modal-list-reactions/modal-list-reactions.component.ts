import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Reactions } from '../../models/reactions';
import { PostService } from '../../services/post.service';
import { EmojiType } from '../../models/emoji-type';
import { ReactionsByType } from '../../models/reactions-by-type';

@Component({
  selector: 'app-modal-list-reactions',
  templateUrl: './modal-list-reactions.component.html',
  styleUrl: './modal-list-reactions.component.scss'
})
export class ModalListReactionsComponent {
  @Input() reactions!: Reactions;
  @Input() postReference!: string; //Uuid del post que sera id del modal
  listEmojiType!: EmojiType[]; //Lista de los tipos de emojis guardados en el back
  listEmojiTypeExisting!: ReactionsByType[];//Lista de las reacciones existentes en el post
  @ViewChildren('modal') modalElements!: QueryList<ElementRef>;

  constructor(private postService: PostService) { }

  ngOnInit(){
    //Obtener los tipos de emoji
    this.postService.getEmojisType().subscribe({
      next: (response: EmojiType[]) => {
        this.listEmojiType = response;
      },
      error: (error) => {
        console.log('Error al obtener los tipos de emojis', error);
      }
    });

    this.listEmojiTypeExisting = this.reactions.reactions_by_type.filter((reactByType) => reactByType.amount > 0 );
  }

  ngAfterViewInit() {
    this.modalElements.forEach(modalRef => {
      const modalElement = modalRef.nativeElement;

      modalElement.addEventListener('hidden.bs.modal', () => {
        this.resetTabs(modalElement);
      });
    });
  }

  //Resetear seleccion de tabs al cerrar modal
  private resetTabs(modalElement: HTMLElement) {
    const modalId = modalElement.id.replace('reactions-', ''); // Obtener ID del post

    // Seleccionamos la primera pestaña y su contenido correspondientes a este modal
    const firstTab = document.querySelector(`#listTabs-${modalId} a:first-child`) as HTMLElement;
    const firstTabContent = document.querySelector(`#generalEmoji-tab-pane-${modalId}`) as HTMLElement;
    
    if(firstTab && firstTabContent){
      // Removemos la clase 'active' de todas las pestañas y contenido dentro de este modal
      document.querySelectorAll(`#listTabs-${modalId} a`).forEach(tab => tab.classList.remove("active"));
      document.querySelectorAll(`#reactions-${modalId} .tab-pane`).forEach(content => content.classList.remove("show", "active"));
      
      // Activamos la primera pestaña y su contenido
      firstTab.classList.add("active");
      firstTabContent.classList.add("show", "active");
    }

  }

  //Obtener el codigo emoji(icono) segun su nombre 
  getEmojiReactionType(typeReactionName: string){
    if(this.listEmojiType)
      return this.listEmojiType.find((typeEmoji) => typeEmoji.emoji_name === typeReactionName)?.emoji_code;
    else
      return typeReactionName;
  }

  //Obtener todas las reacciones de usuarios de un tipo, ejm todos los users que dieron me gusta
  getUsersReactionsType(typeReactionName: string){
    return this.reactions.reactions_by_user.filter((reactionUser) => reactionUser.user_reaction == typeReactionName);
  }
}
