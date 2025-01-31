import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Post } from '../../../models/post';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
  styleUrl: './edit-text.component.scss'
})
export class EditTextComponent {
  @Input() contentText!: string | undefined;
  @Input() postUuid!: string;
  @Output() textChangeEvent = new EventEmitter<string>();
  @ViewChild('textareaRef') textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(){
    // Obtén una referencia al modal de Bootstrap
    const modalElement = document.getElementById('edit-'+this.postUuid);
    if (modalElement) {
      // Escucha el evento 'shown.bs.modal'
      const modal = new Modal(modalElement);
      modalElement.addEventListener('shown.bs.modal', () => {
        if(modalElement.style.display == 'block')
          this.adjustTextAreaHeight();
      });
    }
  }

  onTextChange(event: Event){
    const contentPost = (event.target as HTMLTextAreaElement).value;

    //Emitir el evento al componente padre
    this.textChangeEvent.emit(contentPost);

    //Ajustar la altura del textarea automáticamente
    this.adjustTextAreaHeight();
  }

  private adjustTextAreaHeight(): void {
    const textareaElement = this.textarea.nativeElement;
    textareaElement.style.height = 'auto'; // Restablece la altura
    textareaElement.style.height = `${textareaElement.scrollHeight}px`; // Ajusta la altura según el contenido
  }
}
