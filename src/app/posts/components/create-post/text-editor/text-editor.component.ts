import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss'
})
export class TextEditorComponent {
  @Output() textChangeEvent = new EventEmitter<string>();
  @ViewChild('textareaRef') textarea!: ElementRef<HTMLTextAreaElement>;


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
