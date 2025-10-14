import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild, WritableSignal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Media } from '../../../models/media';

@Component({
  selector: 'app-image-video-editor',
  templateUrl: './image-video-editor.component.html',
  styleUrl: './image-video-editor.component.scss'
})
export class ImageVideoEditorComponent implements OnInit, OnChanges {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Input() listMediaPost!: Media[] | undefined; // Lista de imagenes o videos del post
  @Input() isVisibleModal: boolean = false;
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista de media
  @Output() loadNewFilesMediaEvent = new EventEmitter<File[]>(); //Devolver las imagenes/videos nuevos seleccionadas
  @Output() loadOldFilesMediaEvent = new EventEmitter<Media[]>(); //Devolver las imagenes/videos nuevos seleccionadas
  @Output() mediaRemovedEvent = new EventEmitter<boolean>(); // Evento para notificar cuando se eliminan medias
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreviewAdded: {type: string, url: string}[] = []; //Imagenes videos nuevos a mostrar
  listFileMediaAdded: File[] = []; //Lista de archivos nuevos seleccionados
  listFileMediaPost: Media[] = []; //Lista de archivos del post - not undefined
  isLoadingMedia = false;
  readonly MAX_VIDEO_SIZE_GB = 1 * 1024 * 1024 * 1024; // 1 GB en bytes

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isVisibleModal'] && !this.isVisibleModal){
      this.closeCleanPreviewMedia();
    }
  }

  ngOnInit(){
    // Inicializar arrays para evitar referencias undefined
    this.listFileMediaAdded = [];
    this.mediaListPreviewAdded = [];
    
    // Inicializar listFileMediaPost como un array vacío si no hay media en el post
    if(this.listMediaPost && this.listMediaPost.length > 0){
      this.listFileMediaPost = [...this.listMediaPost]; //Crear copia para no mutar original
      this.showAreaMedia.set(true);
      this.showPreviewMedia = true;
    } else {
      this.listFileMediaPost = []; // Inicializar como array vacío
      // Si estamos en modo edición, mostrar el área para añadir imágenes
      if(this.showAreaMedia()){
        this.showPreviewMedia = true;
      }
    }
  }

  //Cerrar y limpiar la seleccion y prevista de imagenes videos
  closeCleanPreviewMedia(){
    // Verificar si había imágenes/videos existentes que estamos eliminando
    const hadExistingMedia = this.listMediaPost && this.listMediaPost.length > 0;
    
    this.cleanUpMediaPreviews();
    this.listFileMediaPost = []; // Borrar la copia del medias del post
    this.listFileMediaAdded = [];
    this.showPreviewMedia = false;
    this.showAreaMedia.set(false);
    this.resetFileInput();

    this.loadOldFilesMediaEvent.emit(this.listFileMediaPost); //Enviar medias existentes "borradas"
    this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
    
    // Si había imágenes/videos existentes, emitir que fueron eliminados
    if (hadExistingMedia) {
      this.mediaRemovedEvent.emit(true);
    }
  }

  //Abrir el input para seleccionar imagenes videos
  openInputFileMedia(){
    this.resetFileInput();
    this.fileInput?.nativeElement.click();
  }

  // Método para resetear el input file
  private resetFileInput(): void {
    if (this.fileInput?.nativeElement) {
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
      //Renderizar imagenes videos seleccionados - ACUMULAR en lugar de reemplazar
      const newFiles = Array.from(valueMedia.files);
      this.listFileMediaAdded = [...this.listFileMediaAdded, ...newFiles];
      
      //Emitir al padre las images precargadas para habilitar el boton de publicar
      this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
      this.loadOldFilesMediaEvent.emit(this.listFileMediaPost); //Enviar imagenes existentes actualizadas (después de eliminaciones)

      const newPreviews = newFiles.map(file => ({type: file.type, url: URL.createObjectURL(file)}));
      this.mediaListPreviewAdded = [...this.mediaListPreviewAdded, ...newPreviews];
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

  private getFilesFromEvent(event: Event | DragEvent): File[] | null {
    if (event instanceof DragEvent && event.dataTransfer?.files) {
      return Array.from(event.dataTransfer.files);
    } else if (event.target instanceof HTMLInputElement && event.target.files) {
      return Array.from(event.target.files);
    }
    return null;
  }

  private processMediaFiles(files: File[], originalEvent: Event): void {
    // Validar tamaño máximo de videos
    if (this.hasOversizedVideo(files)) {
      this.handleOversizedVideoError(originalEvent);
      return;
    }
    
    // Inicializar listFileMediaAdded si es nulo
    if (!this.listFileMediaAdded) {
      this.listFileMediaAdded = [];
    }
    
    // Acumular archivos en lugar de reemplazarlos
    const newFiles = Array.from(files);
    this.listFileMediaAdded = [...this.listFileMediaAdded, ...newFiles];
    
    // Actualizar estado y emitir lista acumulada
    this.showPreviewMedia = true;
    this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
    this.loadOldFilesMediaEvent.emit(this.listFileMediaPost); //Enviar imagenes existentes
    
    // Leer archivos para previsualización
    this.loadMediaPreviewsAppend(newFiles);
  }

  private hasOversizedVideo(files: File[]): boolean {
    return files.some(file => 
      file.type.startsWith('video/') && file.size > this.MAX_VIDEO_SIZE_GB
    );
  }

  private handleOversizedVideoError(event: Event): void {
    alert(`El tamaño del video no debe exceder los ${this.MAX_VIDEO_SIZE_GB / (1024 * 1024 * 1024)} GB.`);
    
    // Limpiar el input si es un evento de input
    if (event.target instanceof HTMLInputElement) {
      event.target.files = new DataTransfer().files; // Limpiar el input
    }
    
    // Resetear estado
    this.showPreviewMedia = false;
    this.mediaListPreviewAdded = [];
    this.listFileMediaAdded = [];
  }
  
  private loadMediaPreviewsAppend(files: File[]): void {
    this.isLoadingMedia = true;

    try {
      // Crear URLs para los nuevos archivos
      const newPreviews = files.map(file => ({type: file.type, url: URL.createObjectURL(file)}));
      
      // Añadir los nuevos previews a los existentes
      this.mediaListPreviewAdded = [...this.mediaListPreviewAdded, ...newPreviews];
      this.isLoadingMedia = false;
    } catch (error) {
      this.isLoadingMedia = false;
      console.error('Error al crear URLs:', error);
      this.handleMediaLoadError();
    }
  }

  private handleMediaLoadError(): void {
    this.showPreviewMedia = false;
    this.mediaListPreviewAdded = [];
    this.listFileMediaAdded = [];
  }

  //Añadir clase segun media del post y media añadida
  getGridClass(): string {
    // Consideramos el tile de "añadir más" como un elemento adicional
    if (this.getAmountMedia() === 1) return 'single-with-add';
    if (this.getAmountMedia() === 2) return 'two-with-add';
    if (this.getAmountMedia() === 3) return 'three-with-add';
    if (this.getAmountMedia() === 4) return 'four-with-add';
    return 'more-with-add';
  }

  //Obtener cantidad de media existente y seleccionada
  getAmountMedia(){
    const mediaPostLength = this.listFileMediaPost ? this.listFileMediaPost.length : 0;
    const mediaAddedLength = this.mediaListPreviewAdded ? this.mediaListPreviewAdded.length : 0;
    
    return mediaPostLength + mediaAddedLength;
  }

  // Verificar si es imagen para mostrar etiqueta img o video
  isImage(typeMedia: string): boolean{
    if (!typeMedia) {
      return false;
    }
    return typeMedia.includes('image');
  }

  // Eliminar media existente del post
  deleteExistingMedia(index: number): void {
    if (index >= 0 && index < this.listFileMediaPost.length) {
      // Eliminar de la lista del post
      this.listFileMediaPost.splice(index, 1);
      
      // Resetear el input file
      this.resetFileInput();
      
      // Emitir las listas actualizadas al padre
      this.loadOldFilesMediaEvent.emit(this.listFileMediaPost);
      this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
      
      // Si no hay más archivos, ocultar el preview o mostrar área vacía
      if (this.getAmountMedia() === 0) {
        this.showPreviewMedia = false;
      }
      
      // Emitir que se eliminaron medias
      this.mediaRemovedEvent.emit(true);
    }
  }

  // Eliminar media nueva añadida
  deleteNewMedia(index: number): void {
    if (index >= 0 && index < this.mediaListPreviewAdded.length) {
      // Liberar la URL del objeto para evitar memory leaks
      URL.revokeObjectURL(this.mediaListPreviewAdded[index].url);
      
      // Eliminar de las listas
      this.mediaListPreviewAdded.splice(index, 1);
      this.listFileMediaAdded.splice(index, 1);
      
      // Resetear el input file
      this.resetFileInput();
      
      // Emitir las listas actualizadas al padre
      this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
      this.loadOldFilesMediaEvent.emit(this.listFileMediaPost);
      
      // Si no hay más archivos, ocultar el preview o mostrar área vacía
      if (this.getAmountMedia() === 0) {
        this.showPreviewMedia = false;
      }
    }
  }

  // Determinar si debe mostrar directamente (primeras 3 posiciones o exactamente 4 elementos)
  shouldShowDirectly(absoluteIndex: number): boolean {
    return absoluteIndex < 3 || this.getAmountMedia() === 4;
  }

  // Determinar si debe mostrar con overlay (posición 3 y hay más de 4 elementos)
  shouldShowWithOverlay(absoluteIndex: number): boolean {
    return absoluteIndex === 3 && this.getAmountMedia() > 4;
  }

  resetUploader(): void {
    this.cleanUpMediaPreviews();
    this.listFileMediaAdded = [];
    this.listFileMediaPost = [];
    this.showPreviewMedia = false;
    this.resetFileInput();
    this.loadNewFilesMediaEvent.emit(this.listFileMediaAdded);
    this.loadOldFilesMediaEvent.emit(this.listFileMediaPost);
  }
  
  private cleanUpMediaPreviews(): void {
    this.mediaListPreviewAdded.forEach(media => {
      if (media.url) {
        URL.revokeObjectURL(media.url);
      }
    });
    this.mediaListPreviewAdded = [];
  }
}
