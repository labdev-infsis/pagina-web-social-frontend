import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-options-post',
  templateUrl: './options-post.component.html',
  styleUrl: './options-post.component.scss'
})
export class OptionsPostComponent {
  @Input() post!: Post;     // Post que se va a modificar
  showOptions: boolean = false; // Controla la visibilidad de las opciones del post, no toma en cuenta el 1° click
  @Output() clickOutside = new EventEmitter<void>(); // Evento para cerrar el menu de opciones
  @ViewChild('menuOptions', { static: false }) menuOptions!: ElementRef;// Elemento del menu de opciones

  constructor(private postService: PostService) {}

  ngOnInit() {
    
  }

  // Método para cerrar el menu de opciones al hacer click fuera de él
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!this.menuOptions.nativeElement.contains(clickedElement) && this.showOptions) {
      this.clickOutside.emit();
    }
    this.showOptions = true;// Se activa para que el 2° click cierre el menu
  }

  updatePost() {

  }

  deletePost(postUuid: string) {
    this.postService.deletePost(postUuid).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log('Error al eliminar el post',error);
      }
    })
  }
}
