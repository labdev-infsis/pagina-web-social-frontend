import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-images-uploader',
  templateUrl: './images-uploader.component.html',
  styleUrl: './images-uploader.component.scss'
})
export class ImagesUploaderComponent {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista de media
  @Output() loadFilesMediaEvent = new EventEmitter<File[]>(); //Devolver las imagenes/videos seleccionadas
  @ViewChild('fileInput') fileInput!: ElementRef; // Referencia al input file
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreview: string[] = []; //Imagenes videos a mostrar en formato base64
  listFileMedia!: File[]; //Lista de archivos seleccionados


  //Cerrar y limpiar la seleccion y prevista de imagenes videos
  closeCleanPreviewMedia(){
    this.mediaListPreview = [];
    this.listFileMedia = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);
    this.resetFileInput();
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileMedia(){
    this.resetFileInput();
    const inputFile = document.getElementById('input-file-img-vid')
    inputFile?.click()
  }

  // Método para resetear el input file
  private resetFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
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
  // deletePreviewMedia(media:string){
  //   let index = this.mediaListPreview.indexOf(media);
  //   this.mediaListPreview.splice(index,1);
  //   const fileInput = document.getElementById('input-file') as HTMLInputElement;
  //   if (fileInput && fileInput.files) {
  //     const files = Array.from(fileInput.files);

  //     if (index >= 0 && index < files.length) {
  //       files.splice(index, 1); // Elimina el archivo en la posición indicada
  //     }

  //     // Usa DataTransfer para crear una nueva lista de archivos
  //     const dataTransfer = new DataTransfer();
  //     files.forEach(file => dataTransfer.items.add(file));

  //     // Asigna la nueva lista de archivos al input
  //     fileInput.files = dataTransfer.files;
  //   }
  // }

   deletePreviewMedia(index: number){
    if (index >= 0 && index < this.mediaListPreview.length) {
      // Liberar la URL del objeto para evitar memory leaks
      URL.revokeObjectURL(this.mediaListPreview[index]);
      
      // Eliminar de las listas
      this.mediaListPreview.splice(index, 1);
      this.listFileMedia.splice(index, 1);
      
      // Resetear el input file para permitir seleccionar el mismo archivo nuevamente
      this.resetFileInput();
      
      // Emitir la lista actualizada al padre
      this.loadFilesMediaEvent.emit(this.listFileMedia);
      
      // Si no hay más archivos, ocultar el preview
      if (this.mediaListPreview.length === 0) {
        this.showPreviewMedia = false;
      }
    }
  }

   resetUploader(): void {
    this.mediaListPreview = [];
    this.listFileMedia = [];
    this.showPreviewMedia = false;
    this.resetFileInput();
    this.loadFilesMediaEvent.emit(this.listFileMedia);
  }
}
