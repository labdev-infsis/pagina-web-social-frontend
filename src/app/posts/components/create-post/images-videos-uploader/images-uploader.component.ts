import { Component, EventEmitter, Input, Output, WritableSignal, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-images-uploader',
  templateUrl: './images-uploader.component.html',
  styleUrl: './images-uploader.component.scss'
})
export class ImagesUploaderComponent implements OnChanges {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Input() isVisibleModal: boolean = false;
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista de media
  @Output() loadFilesMediaEvent = new EventEmitter<File[]>(); //Devolver las imagenes/videos seleccionadas
  @ViewChild('fileInput') fileInput!: ElementRef; // Referencia al input file
  showPreviewMedia = false; //Mostrar la prevista de imagenes y/o videos
  mediaListPreview: {type: string, url: string}[] = []; //Imagenes videos a mostrar en formato base64
  listFileMedia: File[] = []; //Lista de archivos seleccionados
  isLoadingMedia = false;
  readonly MAX_VIDEO_SIZE_GB = 1 * 1024 * 1024 * 1024; // 1 GB en bytes

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isVisibleModal'] && !this.isVisibleModal){
      this.closeCleanPreviewMedia();
    }
  }

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
    this.fileInput?.nativeElement.click();  
  }

  // Método para resetear el input file
  private resetFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  changeInputMedia(event: Event | DragEvent): void {
    event.preventDefault();
    
    // Obtener archivos según el tipo de evento
    const files = this.getFilesFromEvent(event);
    
    if (!files || files.length === 0) {
      return;
    }

    if(files && !this.isValidFileType(files)){
      alert('Por favor, seleccione solo imágenes o videos');
       if (event.target instanceof HTMLInputElement) {
        event.target.files = new DataTransfer().files; // Limpiar el input
      }
    
      // Resetear estado
      this.showPreviewMedia = false;
      this.mediaListPreview = [];
      this.listFileMedia = [];
      return;
    }
    
    this.processMediaFiles(files, event);
  }

  private isValidFileType(files: File[]): boolean {
    return files.every(file => {
      const fileType = file.type;
      return fileType.startsWith('image/') || fileType.startsWith('video/');
    });
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
    
    // Inicializar listFileMedia si es nulo
    if (!this.listFileMedia) {
      this.listFileMedia = [];
    }
    
    // Acumular archivos en lugar de reemplazarlos
    const newFiles = Array.from(files);
    this.listFileMedia = [...this.listFileMedia, ...newFiles];
    
    // Actualizar estado y emitir lista acumulada
    this.showPreviewMedia = true;
    this.loadFilesMediaEvent.emit(this.listFileMedia);
    
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
    this.mediaListPreview = [];
    this.listFileMedia = [];
  }
  
  private loadMediaPreviewsAppend(files: File[]): void {
    this.isLoadingMedia = true;

    try {
      // Crear URLs para los nuevos archivos
      const newPreviews = files.map(file => ({type: file.type, url: URL.createObjectURL(file)}));
      
      // Añadir los nuevos previews a los existentes
      this.mediaListPreview = [...this.mediaListPreview, ...newPreviews];
      this.isLoadingMedia = false;
    } catch (error) {
      this.isLoadingMedia = false;
      console.error('Error al crear URLs:', error);
      this.handleMediaLoadError();
    }
  }

  isImage(typeMedia: string): boolean{
    return typeMedia.includes('image');
  }

  private handleMediaLoadError(): void {
    // Opcional: mostrar mensaje de error al usuario
    this.showPreviewMedia = false;
    this.mediaListPreview = [];
    this.listFileMedia = [];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  getGridClass(): string {
    // Consideramos el tile de "añadir más" como un elemento adicional
    if (this.mediaListPreview.length === 1) return 'single-with-add';
    if (this.mediaListPreview.length === 2) return 'two-with-add';
    if (this.mediaListPreview.length === 3) return 'three-with-add';
    if (this.mediaListPreview.length === 4) return 'four-with-add';
    return 'more-with-add';
  }

  deletePreviewMedia(index: number){
    if (index >= 0 && index < this.mediaListPreview.length) {
      // Liberar la URL del objeto para evitar memory leaks
      URL.revokeObjectURL(this.mediaListPreview[index].url);
      
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
      this.cleanUpMediaPreviews();  // Esto ya limpia mediaListPreview
      this.listFileMedia = [];
      this.showPreviewMedia = false;
      this.resetFileInput();
      this.loadFilesMediaEvent.emit(this.listFileMedia);
  }
  
  private cleanUpMediaPreviews(): void {
    this.mediaListPreview.forEach(media => {
      if (media.url) {
        URL.revokeObjectURL(media.url);
      }
    });
    this.mediaListPreview = [];
  }
}
