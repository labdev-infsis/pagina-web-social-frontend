import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss'
})
export class TextEditorComponent implements OnChanges, AfterViewInit {
  @Output() textChangeEvent = new EventEmitter<string>();
  @ViewChild('textareaRef') textarea!: ElementRef<HTMLTextAreaElement>;
  @Input() isVisibleModal: boolean = false;
  private shouldClearTextarea = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isVisibleModal'] && !this.isVisibleModal){
      // Marcar que debemos limpiar el textarea cuando esté disponible
      this.shouldClearTextarea = true;
      
      // Si el textarea ya está disponible, limpiarlo de inmediato
      if (this.textarea) {
        this.clearTextarea();
      }
    }
  }
  
  ngAfterViewInit(): void {
    // Si se ha marcado para limpiar y ahora el textarea está disponible
    if (this.shouldClearTextarea && this.textarea) {
      this.clearTextarea();
    }
  }
  
  private clearTextarea(): void {
    this.textarea.nativeElement.value = '';
    this.shouldClearTextarea = false;
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
