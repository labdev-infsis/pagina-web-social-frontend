import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-options-post',
  templateUrl: './options-post.component.html',
  styleUrl: './options-post.component.scss'
})
export class OptionsPostComponent {
  @Input() postReference!: string;
  showOptions: boolean = false; // Controla la visibilidad de las opciones del post, no toma en cuenta el 1° click
  @Output() clickOutside = new EventEmitter<void>(); // Evento para cerrar el menu de opciones
  @Output() openEdit = new EventEmitter<boolean>();
  @ViewChild('menuOptions', { static: false }) menuOptions!: ElementRef;// Elemento del menu de opciones

  // Método para cerrar el menu de opciones al hacer click fuera de él
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!this.menuOptions.nativeElement.contains(clickedElement) && this.showOptions) {
      this.clickOutside.emit();
    }
    this.showOptions = true;// Se activa para que el 2° click cierre el menu
  }

  //Abrir modal de edición de post
  openModalEditPost(id: string){
    this.openEdit.emit(true); //Activar la renderizacion en el DOM del modal
    //Esperar que el modal exista en el DOM para mostrarlo
    setTimeout(()=>{
      const modalElement = document.getElementById('edit-'+id);
      if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
    },300)
  }

}
