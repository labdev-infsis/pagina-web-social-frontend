import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Post } from '../../../models/post';

@Component({
  selector: 'app-edit-text',
  templateUrl: './edit-text.component.html',
  styleUrl: './edit-text.component.scss'
})
export class EditTextComponent {
  @Input() contentText!: string | undefined;
  @Input() post!: Post;
  @Output() textChangeEvent = new EventEmitter<string>();
  @ViewChild('textareaRef') textarea!: ElementRef<HTMLTextAreaElement>;

  ngOnInit(){
    // console.log('fuera if', this.textarea, this.contentText);
    if(this.textarea && this.contentText){  
      this.textarea.nativeElement.value = this.contentText;
      // console.log('dentro if', this.textarea.nativeElement.value);
      //this.adjustTextAreaHeight();
      this.textarea.nativeElement.style.height = 'auto'; // Restablece la altura
      this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`; // Ajusta la altura según el contenido
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
    // const textareaElement = this.textarea.nativeElement;
    // textareaElement.style.height = 'auto'; // Restablece la altura
    // textareaElement.style.height = `${textareaElement.scrollHeight}px`; // Ajusta la altura según el contenido
    this.textarea.nativeElement.style.height = 'auto'; // Restablece la altura
    // console.log('dentro ajuste1', this.textarea.nativeElement.style.height);
    this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`; // Ajusta la altura según el contenido
    // console.log('dentro ajuste2', this.textarea.nativeElement.style.height);
  }
}
