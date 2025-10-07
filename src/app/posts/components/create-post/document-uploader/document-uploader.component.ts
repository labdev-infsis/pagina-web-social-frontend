import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, WritableSignal, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrl: './document-uploader.component.scss'
})
export class DocumentUploaderComponent implements OnChanges {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Input() isVisibleModal: boolean = false;
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadFileDoc = new EventEmitter<File>(); 
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public readonly SIZE = 100;
  private readonly MAX_FILE_SIZE = this.SIZE * 1024 * 1024; // 100MB en bytes
  showPreviewDoc = false;
  fileDoc!: File; //El doc que se selecciona para crear post
  typesDocs = {
    pdf : 'application/pdf',
    document : ['application/doc','application/docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    presentation: ['application/pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    text : 'application/txt' 
  }
  fileType!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isVisibleModal'] && !this.isVisibleModal){
      this.closeCleanPreviewDoc();
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

      this.fileType = this.getTypeFile(this.fileDoc.type);
      this.showPreviewDoc = true;
      this.loadFileDoc.emit(this.fileDoc);
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
    this.fileInput.nativeElement.click();
  }

  closeCleanPreviewDoc(){
    this.fileDoc = new File([''],'');
    this.showPreviewDoc = false;
    this.showAreaDoc.set(false);
    
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.closeAreaDocEvent.emit(this.showAreaDoc());
  }
}
