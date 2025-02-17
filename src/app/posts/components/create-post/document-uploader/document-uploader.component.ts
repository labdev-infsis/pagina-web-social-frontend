import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrl: './document-uploader.component.scss'
})
export class DocumentUploaderComponent {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadFileDoc = new EventEmitter<File>(); 
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
    if(event.target instanceof HTMLInputElement && event.target.files){
      this.fileDoc = event.target.files[0];
      this.fileType = this.getTypeFile(this.fileDoc.name);
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
    const inputFileDoc = document.getElementById('input-file-doc');
    inputFileDoc?.click();
  }

  closeCleanPreviewDoc(){
    this.fileDoc = new File([''],'');
    this.showPreviewDoc  = false;
    this.showAreaDoc.set(false);
    this.closeAreaDocEvent.emit(this.showAreaDoc())
  }
}
