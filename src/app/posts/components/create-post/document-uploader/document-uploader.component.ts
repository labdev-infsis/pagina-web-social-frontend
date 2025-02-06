import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { Media } from '../../../models/media';

@Component({
  selector: 'app-document-uploader',
  templateUrl: './document-uploader.component.html',
  styleUrl: './document-uploader.component.scss'
})
export class DocumentUploaderComponent {
  @Input() showAreaDoc!: WritableSignal<boolean>;
  @Input() mediaDocPost!: Media[] | undefined; //Documento que se recibe del post
  @Output() closeAreaDocEvent = new EventEmitter<boolean>(); 
  @Output() loadFileDoc = new EventEmitter<File>(); 
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
    if(event.target instanceof HTMLInputElement && event.target.files){
      this.fileDoc = event.target.files[0]
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
    inputFileDoc?.click()
  }

  closeCleanPreviewDoc(){
    this.fileDoc = new File([''],'');
    this.showPreviewDoc  = false;
    this.showAreaDoc.set(false);
    this.closeAreaDocEvent.emit(this.showAreaDoc())
  }
}
