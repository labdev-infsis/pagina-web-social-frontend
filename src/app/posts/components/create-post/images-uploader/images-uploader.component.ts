import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-images-uploader',
  templateUrl: './images-uploader.component.html',
  styleUrl: './images-uploader.component.scss'
})
export class ImagesUploaderComponent {
  @Input() showAreaMedia! : WritableSignal<boolean>; //Mostrar seleccion y prevista de imagenes videos
  @Output() closeAreaMediaEvent = new EventEmitter<boolean>();//Ocultar la seleccion y prevista
  @Output() loadFilesMediaEvent = new EventEmitter<File[]>();
  showPreviewImages = false;
  imagesPreview:string[] = [];
  listFileImages!: File[]; //Devolver output

  closeCleanPreviewImg(){
    this.imagesPreview = [];
    this.listFileImages = [];
    this.showPreviewImages = false;
    this.showAreaMedia.set(false);
    this.closeAreaMediaEvent.emit(this.showAreaMedia());
  }

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
      // this.disabledPublishButton.set(false);
      this.showPreviewImages = true;
      //Renderizar imagenes:
      this.listFileImages = Array.from(valueMedia.files);
      //Emitir al padre las images precargadas
      this.loadFilesMediaEvent.emit(this.listFileImages);

      const imagePromises = this.listFileImages.map(file => this.readFileAsDataURL(file));
      
      this.imagesPreview = await Promise.all(imagePromises);
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
    if (this.imagesPreview.length === 1) return 'single';
    if (this.imagesPreview.length === 2) return 'two';
    if (this.imagesPreview.length === 3) return 'three';
    if (this.imagesPreview.length === 4) return 'four';
    return 'more';
  }

  deletePreviewImg(img:string){
    let index = this.imagesPreview.indexOf(img)
    this.imagesPreview.splice(index,1)
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
