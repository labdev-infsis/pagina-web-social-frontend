import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-images-uploader',
  templateUrl: './images-uploader.component.html',
  styleUrl: './images-uploader.component.scss'
})
export class ImagesUploaderComponent {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista de media
  @Output() loadFilesMediaEvent = new EventEmitter<File[]>(); //Devolver las imagenes/videos seleccionadas
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreview: string[] = []; //Imagenes videos a mostrar en formato base64
  listFileMedia!: File[]; //Lista de archivos seleccionados


  //Cerrar y limpiar la seleccion y prevista de imagenes videos
  closeCleanPreviewImgVid(){
    this.mediaListPreview = [];
    this.listFileMedia = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileImgVid(){
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
    if (this.mediaListPreview.length === 1) return 'single';
    if (this.mediaListPreview.length === 2) return 'two';
    if (this.mediaListPreview.length === 3) return 'three';
    if (this.mediaListPreview.length === 4) return 'four';
    return 'more';
  }

  isImage(mediaBase64: string): boolean{
    let response = false;
    mediaBase64.includes('image')? response = true : response = false;
    return response;
  }

  //Eliminar imagen prevista NO USADA AUN
  deletePreviewImg(img:string){
    let index = this.mediaListPreview.indexOf(img)
    this.mediaListPreview.splice(index,1)
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
