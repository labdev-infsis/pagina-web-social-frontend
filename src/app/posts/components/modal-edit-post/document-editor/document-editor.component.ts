import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, WritableSignal } from '@angular/core';
import { Media } from '../../../models/media';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent implements OnInit {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Input() mediaDocPost!: Media[] | undefined; //Documento que se recibe del post
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadNewFileDoc = new EventEmitter<File>(); 
  @Output() documentRemovedEvent = new EventEmitter<boolean>(); // Nuevo evento para notificar la eliminación
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public readonly SIZE = 100;
  private readonly MAX_FILE_SIZE = this.SIZE * 1024 * 1024; // 100MB en bytes
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
    if(this.mediaDocPost?.length == 1){

      this.fileMediaDoc = this.mediaDocPost[0];
      this.fileType = this.getTypeFile(this.fileMediaDoc.type);
      this.showAreaDoc.set(true);
      this.showPreviewDoc = true;
    }

  }

  changeInputMediaDoc(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0){
      this.fileDoc = event.target.files[0];

      // Validar tipo archivo pdf
      if(this.fileDoc && !this.isValidFileType(this.fileDoc.type)){
        alert('Por favor, seleccione un documento tipo PDF');
        //Limpiar el input file
        event.target.files = new DataTransfer().files;
        return;
      }

      // Validar tamaño de archivo
      if(this.fileDoc && !this.isValidFileSize(this.fileDoc.size)){
        alert(`El archivo es demasiado grande. Máximo permitido: ${this.SIZE}MB.`);
        //Limpiar el input file
        event.target.files = new DataTransfer().files;
        return;
      }

      this.fileType = this.getTypeFile(this.fileDoc.name);
      
      this.showPreviewDoc = true;      
      this.loadNewFileDoc.emit(this.fileDoc);
    } else {
      console.error('No se seleccionó ningún archivo o el evento no contiene archivos');
    }
  }

  private isValidFileType(type: string): boolean {
    return type.includes('pdf');
  }

  private isValidFileSize(size: number): boolean {
    return size <= this.MAX_FILE_SIZE;
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
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('No se pudo encontrar el elemento de entrada de archivo');
    }
  }

  closeCleanPreviewDoc(){
    // Verificar si había un documento existente que estamos eliminando
    const hadExistingDocument = this.mediaDocPost && this.mediaDocPost.length > 0;
    
    this.mediaDocPost = undefined; 
    this.fileDoc = new File([''],'');
    this.showPreviewDoc = false;
    this.showAreaDoc.set(false);
    
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }

    // Emitir que se cerró el área de documentos
    this.closeAreaDocEvent.emit(false);
    
    // Si había un documento existente, emitir que se eliminó
    if (hadExistingDocument) {
      this.documentRemovedEvent.emit(true);
    }
  }
}
