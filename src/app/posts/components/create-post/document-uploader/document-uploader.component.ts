import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrl: './document-uploader.component.scss'
})
export class DocumentUploaderComponent {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadFileDoc = new EventEmitter<File>(); 
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  showPreviewDoc = false;
  fileDoc!: File; //El doc que se selecciona para crear post
  typesDocs = {
    pdf : 'application/pdf',
    document : ['application/doc','application/docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    presentation: ['application/pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    text : 'application/txt' 
  }
  fileType!: string;

  changeInputMediaDoc(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0){
      this.fileDoc = event.target.files[0];
      this.fileType = this.getTypeFile(this.fileDoc.type);
      this.showPreviewDoc = true;
      this.loadFileDoc.emit(this.fileDoc);
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
