import { Component, EventEmitter, Input, Output, WritableSignal, ElementRef, ViewChild } from '@angular/core';

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
  mediaListPreview: {type: string, url: string}[] = []; //Imagenes videos a mostrar en formato base64
  listFileMedia!: File[]; //Lista de archivos seleccionados
  isLoadingMedia = false;
  readonly MAX_VIDEO_SIZE_GB = 1 * 1024 * 1024 * 1024; // 1 GB en bytes

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
    
    this.processMediaFiles(files, event);
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
    
    // Actualizar estado y procesar archivos
    this.showPreviewMedia = true;
    this.listFileMedia = files;
    this.loadFilesMediaEvent.emit(this.listFileMedia);
    // Leer archivos para previsualización
    this.loadMediaPreviews(files);
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

  private loadMediaPreviews(files: File[]): void {
    this.cleanUpMediaPreviews();
    this.isLoadingMedia = true;

    try {
      // Crear URLs directamente y su tipo
      this.mediaListPreview = files.map(file => ({type: file.type, url: URL.createObjectURL(file)}));
      this.isLoadingMedia = false;
    } catch (error) {
      this.isLoadingMedia = false;
      console.error('Error al crear URLs:', error);
      this.handleMediaLoadError();
    }
  }

  private cleanUpMediaPreviews(): void {
    if (this.mediaListPreview && this.mediaListPreview.length > 0) {
      this.mediaListPreview.forEach(media => {
        if (media.url && typeof media.url === 'string') {
          URL.revokeObjectURL(media.url);
        }
      });
    }
    this.mediaListPreview = [];
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
    if (this.mediaListPreview.length === 1) return 'single';
    if (this.mediaListPreview.length === 2) return 'two';
    if (this.mediaListPreview.length === 3) return 'three';
    if (this.mediaListPreview.length === 4) return 'four';
    return 'more';
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
    this.mediaListPreview = [];
    this.listFileMedia = [];
    this.showPreviewMedia = false;
    this.resetFileInput();
    this.loadFilesMediaEvent.emit(this.listFileMedia);
  }
}
