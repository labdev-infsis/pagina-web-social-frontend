import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild, WritableSignal } from '@angular/core';
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
  @ViewChild('inputFileEdit') inputFileEdit!: ElementRef<HTMLInputElement> 
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreviewAdded: string[] = []; //Imagenes videos a mostrar en formato base64
  listFileMediaAdded: File[] = []; //Lista de archivos seleccionados
  listFileMediaPost: Media[] = []; //Lista de archivos del post - not undefined

  ngOnInit(){
    if(this.listMediaPost && this.listMediaPost.length > 0){

      this.listFileMediaPost = this.listMediaPost; //Asegurarse de trabajar con no undefined
      this.showAreaMedia.set(true);
      this.showPreviewMedia = true;
    }
  }

  //Cerrar y limpiar la seleccion y prevista de imagenes videos
  closeCleanPreviewMedia(){
    this.mediaListPreviewAdded = [];
    // this.listMediaPost = []; // Borrar la copia del medias del post
    this.listFileMediaAdded = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileMedia(){
    const inputFile = this.inputFileEdit.nativeElement;
    inputFile.click();
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
      this.listFileMediaAdded = Array.from(valueMedia.files);
      //Emitir al padre las images precargadas para habilitar el boton de publicar
      this.loadFilesMediaEvent.emit(this.listFileMediaAdded);

      const mediaPromises = this.listFileMediaAdded.map(file => this.readFileAsDataURL(file));
      
      this.mediaListPreviewAdded = await Promise.all(mediaPromises);
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

  //Añadir clase segun media del post y media añadida
  getGridClass(): string {
    const sumMediaPost_MediaAdded = this.listFileMediaPost.length + this.listFileMediaAdded.length;
    if (sumMediaPost_MediaAdded === 1) return 'single';
    if (sumMediaPost_MediaAdded === 2) return 'two';
    if (sumMediaPost_MediaAdded === 3) return 'three';
    if (sumMediaPost_MediaAdded === 4) return 'four';
    return 'more';
  }

  //Obtener cantidad de media existente y seleccionada
  getAmountMedia(){
    return this.listFileMediaPost.length + this.listFileMediaAdded.length;
  }

  // Verificar si es imagen para mostrar etiqueta img o video
  isImage(urlMedia: string): boolean{
    let response = false;
    urlMedia.includes('image')? response = true : response = false;
    return response;
  }

  //Eliminar imagen prevista NO USADA AUN
  deletePreviewMedia(media:string){
    let index = this.mediaListPreviewAdded.indexOf(media);
    this.mediaListPreviewAdded.splice(index,1);
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

  openEditAll(){
    
  }
}
