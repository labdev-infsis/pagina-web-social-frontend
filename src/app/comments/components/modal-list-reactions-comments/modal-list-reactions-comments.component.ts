import { Component, ElementRef, inject, Input, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { EmojiType } from '../../../posts/models/emoji-type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-list-reactions-comments',
  templateUrl: './modal-list-reactions-comments.component.html',
  styleUrl: './modal-list-reactions-comments.component.scss'
})
export class ModalListReactionsCommentsComponent {
  public activeModal = inject(NgbActiveModal)
  @Input() reactionsCount!: {
    emojiTypeId: string;
    emoji: string; 
    count: number;
  }[];
  @Input() detailReactions!: {
    userName: string;
    userPhoto: string;
    emoji: string;
  }[];
  @Input() commentOrReplyUuid!: string; //Uuid del comentario/respuesta que sera id del modal
  @Input() listEmojiType!: EmojiType[]; //Lista de los tipos de emojis guardados en el back
  @ViewChildren('modal') modalElements!: QueryList<ElementRef>;

  public showPopupUser: WritableSignal<boolean> = signal(false);

  constructor() { }
  
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
    const modalId = modalElement.id.replace('reactions-', ''); // Obtener ID del comment

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

  //Obtener todas las reacciones de usuarios con cierto emoji, ejm todos los users que tienen 👍
  getUsersReactionsType(emoji: string){
    return this.detailReactions.filter((reactionUser) => reactionUser.emoji === emoji);
  }

  //Obtener el tipo de emoji (thumbs-up, red-heart) a partir del id del emoji
  getReactionType(emojiTypeId: string): string{
    const emojiName = this.listEmojiType.find((emojiType)=> emojiType.uuid === emojiTypeId)?.emoji_name;
    return emojiName || '';
  }
}
