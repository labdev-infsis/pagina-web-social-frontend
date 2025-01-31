import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { Media } from '../../../models/media';

@Component({
  selector: 'app-image-video-editor',
  templateUrl: './image-video-editor.component.html',
  styleUrl: './image-video-editor.component.scss'
})
export class ImageVideoEditorComponent {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Input() listMediaPost!: Media[] | undefined; // Lista de imagenes o videos del post
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista de media
  @Output() loadFilesMediaEvent = new EventEmitter<File[]>(); //Devolver las imagenes/videos seleccionadas
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreview: string[] = []; //Imagenes videos a mostrar en formato base64
  listFileMedia: File[] = []; //Lista de archivos seleccionados
  listFileMediaPost: Media[] = []; //Lista de archivos del post

  ngOnInit(){
    if(this.listMediaPost && this.listMediaPost.length > 0){
      // Array.from(this.listMediaPost).forEach((media: Media) => {
      //   this.listFileMedia.push(new File([media.path], media.name, { type: media.type }));
      // });
      // this.chargeMediaPost();
      this.listFileMediaPost = this.listMediaPost;
      this.showAreaMedia.set(true);
      this.showPreviewMedia = true;
    }
  }

  async chargeMediaPost(){
    const mediaPromises = this.listFileMedia.map(file => this.readFileAsDataURL(file));
      
    this.mediaListPreview = await Promise.all(mediaPromises);
  }

  //Cerrar y limpiar la seleccion y prevista de imagenes videos
  closeCleanPreviewMedia(){
    this.mediaListPreview = [];
    this.listFileMedia = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileMedia(){
    const inputFile = document.getElementById('input-file-img-vid')
    inputFile?.click()
  }

  async changeInputMedia(event: Event | DragEvent){
    event.preventDefault();
    let valueMedia;
    if (event instanceof DragEvent && event.dataTransfer) {
      // Evento de arrastrar y soltar
      valueMedia = event.dataTransfer;
    } else if (event.target instanceof HTMLInputElement && event.target.files) {
      // Evento de entrada de archivo
      valueMedia = event.target;
    }
    
    
    if(valueMedia?.files && valueMedia.files.length >0 ){
      this.showPreviewMedia = true;
      //Renderizar imagenes videos seleccionados
      this.listFileMedia = Array.from(valueMedia.files);
      //Emitir al padre las images precargadas para habilitar el boton de publicar
      this.loadFilesMediaEvent.emit(this.listFileMedia);

      const mediaPromises = this.listFileMedia.map(file => this.readFileAsDataURL(file));
      
      this.mediaListPreview = await Promise.all(mediaPromises);
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Error al leer el archivo');
        }
      };
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(file);
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  getGridClass(): string {
    if (this.listFileMediaPost.length === 1) return 'single';
    if (this.listFileMediaPost.length === 2) return 'two';
    if (this.listFileMediaPost.length === 3) return 'three';
    if (this.listFileMediaPost.length === 4) return 'four';
    return 'more';
  }

  isImage(mediaBase64: string): boolean{
    let response = false;
    mediaBase64.includes('image')? response = true : response = false;
    return response;
  }

  //Eliminar imagen prevista NO USADA AUN
  deletePreviewMedia(media:string){
    let index = this.mediaListPreview.indexOf(media);
    this.mediaListPreview.splice(index,1);
    const fileInput = document.getElementById('input-file') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      const files = Array.from(fileInput.files);

      if (index >= 0 && index < files.length) {
        files.splice(index, 1); // Elimina el archivo en la posición indicada
      }

      // Usa DataTransfer para crear una nueva lista de archivos
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));

      // Asigna la nueva lista de archivos al input
      fileInput.files = dataTransfer.files;
    }
  }
}
