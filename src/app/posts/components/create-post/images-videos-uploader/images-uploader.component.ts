import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { catchError, forkJoin, from, of } from 'rxjs';

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
  isLoadingMedia = false;
  readonly MAX_VIDEO_SIZE_GB = 1 * 1024 * 1024 * 1024; // 1 GB en bytes

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
    // Limpiar el array de previsualizaciones antes de empezar
    this.mediaListPreview = [];
    this.isLoadingMedia = true;
    // Convertir cada archivo a un observable
    const mediaObservables = files.map(file => 
      from(this.readFileAsDataURL(file)).pipe(
        catchError(error => {
          console.error(`Error al leer el archivo ${file.name}:`, error);
          return of(null); // Devolver null en caso de error
        })
      )
    );

    // Combinar todos los observables y procesar los resultados
    forkJoin(mediaObservables).subscribe({
      next: (results) => {
        // Filtrado seguro con type guard
        const validResults = results.filter(this.isString);
        this.mediaListPreview = validResults;
        this.isLoadingMedia = false;
      },
      error: (error) => {
        this.isLoadingMedia = false;
        console.error('Error general:', error);
        this.handleMediaLoadError();
      }
    });
  }

  private isString(value: string | null): value is string {
    return typeof value === 'string';
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Tipo de resultado inesperado al leer el archivo'));
        }
      };
      
      reader.onerror = () => reject(new Error(`Error al leer el archivo: ${file.name}`));
      reader.readAsDataURL(file);
    });
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

  isImage(mediaBase64: string): boolean{
    return mediaBase64.includes('image');
  }

  //Eliminar imagen prevista NO USADA AUN
  deletePreviewMedia(media:string){
    let index = this.mediaListPreview.indexOf(media);
    this.mediaListPreview.splice(index,1);
    const fileInput = document.getElementById('input-file') as HTMLInputElement;
    if (fileInput?.files) {
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
