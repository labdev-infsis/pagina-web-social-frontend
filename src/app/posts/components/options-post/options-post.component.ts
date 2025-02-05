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

  openModalEditPost(id: string){
    console.log('entro 1')
    this.openEdit.emit(true);
    // const modalElement = document.getElementById('edit-'+id);
    // if (modalElement) {
    //   console.log('entro')
    //   const modal = new Modal(modalElement);
    //   modal.show();
    // }
    console.log('entro 2')
    setTimeout(()=>{
      this.openActual(id);
    },500)
  }
  
  
  openActual(id:string){
    const modalElement = document.getElementById('edit-'+id);
    console.log('entro 3')
    console.log(modalElement)
    if (modalElement) {
      console.log('entro 4')
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
