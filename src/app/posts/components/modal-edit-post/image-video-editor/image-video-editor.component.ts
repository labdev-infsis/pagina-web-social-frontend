import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, WritableSignal } from '@angular/core';
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
  @Output() loadNewFilesMediaEvent = new EventEmitter<{file:File, url: string}[]>(); //Devolver las imagenes/videos nuevos seleccionadas
  @Output() loadOldFilesMediaEvent = new EventEmitter<Media[]>(); //Devolver las imagenes/videos nuevos seleccionadas
  @Output() showEditAllMedia = new EventEmitter<boolean>();
  @ViewChild('inputFileEdit') inputFileEdit!: ElementRef<HTMLInputElement> 
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  @Input() listFileMediaAdded: {file:File, url: string}[] = []; //Lista de archivos seleccionados
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
    this.listMediaPost = []; // Borrar la copia del medias del post
    this.listFileMediaAdded = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);

    this.loadOldFilesMediaEvent.emit(this.listMediaPost); //Enviar medias existentes "borradas"
    this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileMedia(){
    const inputFile = this.inputFileEdit.nativeElement;
    inputFile.click();
  }

  changeInputMedia(event: Event | DragEvent){
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
      //Agregar file con su url al atributo
      this.listFileMediaAdded = this.listFileMediaAdded.concat( Array.from(valueMedia.files).map((file)=>{
        return {
          file,
          url: URL.createObjectURL(file)
        }
      }));

      //Emitir al padre las images precargadas para habilitar el boton de publicar
      this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);//Enviar media nueva seleccionada
      this.loadOldFilesMediaEvent.emit(this.listMediaPost); //Enviar media existente antiguas actualizada
    }
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

  openEditAllMedia(){
    this.showEditAllMedia.emit(true);
  }
}
