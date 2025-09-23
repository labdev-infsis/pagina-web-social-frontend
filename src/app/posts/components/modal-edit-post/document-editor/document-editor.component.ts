import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, WritableSignal } from '@angular/core';
import { Media } from '../../../models/media';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Input() mediaDocPost!: Media[] | undefined; //Documento que se recibe del post
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadNewFileDoc = new EventEmitter<File>(); 
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  showPreviewDoc = false;
  fileMediaDoc!: Media; //El doc del post - not undefined
  fileDoc!: File; //El doc nuevo que se puede añadir
  typesDocs = {
    pdf : 'application/pdf',
    document : ['application/doc','application/docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    presentation: ['application/pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    text : 'application/txt' 
  }
  fileType!: string;

  ngOnInit(){
    if(this.mediaDocPost && this.mediaDocPost.length == 1){

      this.fileMediaDoc = this.mediaDocPost[0];
      this.fileType = this.getTypeFile(this.fileMediaDoc.type);
      this.showAreaDoc.set(true);
      this.showPreviewDoc = true;
    }

  }

  changeInputMediaDoc(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0){
      this.fileDoc = event.target.files[0];

      this.fileType = this.getTypeFile(this.fileDoc.name);
      
      this.showPreviewDoc = true;      
      this.loadNewFileDoc.emit(this.fileDoc);
    } else {
      console.error('No se seleccionó ningún archivo o el evento no contiene archivos');
    }
  }

  getTypeFile(type: string){
    if(type === this.typesDocs.pdf)
      return 'File PDF'
    else if(this.typesDocs.document.includes(type))
      return 'File DOCUMENTO'
    else if(this.typesDocs.presentation.includes(type))
      return 'File PRESENTACION'
    else
      return 'File PDF'
  }

  openInputFileDoc(){
    // Usar ViewChild para acceder al input
    if (this.fileInput && this.fileInput.nativeElement) {
      console.log('Abriendo selector de archivos');
      this.fileInput.nativeElement.click();
    } else {
      console.error('No se pudo encontrar el elemento de entrada de archivo');
    }
  }

  closeCleanPreviewDoc(){
    this.mediaDocPost = undefined; 
    this.fileDoc = new File([''],'');
    this.showPreviewDoc = false;
    this.showAreaDoc.set(false);

    this.closeAreaDocEvent.emit(false); 
  }
}
