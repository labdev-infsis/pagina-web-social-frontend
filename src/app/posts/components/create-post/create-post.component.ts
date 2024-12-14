import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Media } from '../../models/media';
import { concatMap } from 'rxjs';
import { UploadedImage } from '../../models/uploaded-image';
import { CreatePost } from '../../models/create-post';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  institution!: Institution;
  visibleAreaMedia = false;
  showPreviewImages = false;
  disabledPublishButton = true; 
  postForm!: FormGroup
  imagesPreview:string[] = []
  listFile!: File[];

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(){
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    this.postService.getInstitution(uuid).subscribe({
      next:(institutionData: Institution)=>{
        this.institution = institutionData
      },
      error: (error)=>{
        console.log(error)
      }
    });
    this.buildForm()
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      contentPost: ['',  [Validators.maxLength(1000),Validators.minLength(1)]],
      media: [[]]
    });
  }

  openModalCreatePost(){
    const modalElement = document.getElementById('modalCreatePost');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  showAreaMedia(){
    this.visibleAreaMedia = true
  }

  changeTextArea(event: Event){
    let contentPost = (event.target as HTMLTextAreaElement).value
    let textArea = document.getElementById('text-area')
    if(contentPost != ""){
      this.disabledPublishButton = false
    }else {
      this.disabledPublishButton = true
    }
    if(textArea != null){
      textArea.style.height = `${textArea.scrollHeight}px`;
      textArea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
    });
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
      this.disabledPublishButton = false;
      this.showPreviewImages = true;
      //Renderizar imagenes:
      this.listFile = Array.from(valueMedia.files);
      const formData = new FormData()
      if(this.listFile){
        Array.from(this.listFile).forEach((file) => {
          formData.append('media', file);
        });
      }
      const imagePromises = this.listFile.map(file => this.readFileAsDataURL(file));
      
      this.imagesPreview = await Promise.all(imagePromises);
    }
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

  openInputFile(){
    const inputFile = document.getElementById('input-file')
    inputFile?.click()
  }

  post(){
    const valueFormPost = this.postForm.value
    const formData = new FormData()
    const responseImages: Media[] = [] 

    if(this.listFile){ //Si hay archivos se los procesa
      //Convertir los archivos en Form Data
      Array.from(this.listFile).forEach((file) => {
        formData.append('images', file);
      });

      this.postService.uploadImages(formData).pipe(
        concatMap((uploadResponse: UploadedImage[]) => {
          uploadResponse.forEach((image, index) => {
            responseImages.push({
              number: index + 1,
              type: image.type,
              path: image.urlResource
            });
          });

          const post: CreatePost = {
            institution_id: this.institution.uuid,
            date: new Date(),
            comment_config_id: "875d7d7f-7a1c-4b77-ab63-77a9f76759d0",//Default todos comentan
            content: {
              text: valueFormPost.contentPost,
              media: responseImages
            }
          }

          return this.postService.createPost(post);
        })
      ).subscribe({
        next: ()=> {
          window.location.reload()
          console.log('post creado con exito')
        },
        error: (error) => {
          console.log('Error al crear el post',error)
        }
      })
    }
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

  closeCleanPreviewImg(){
    this.imagesPreview = []
    this.disabledPublishButton = true;
    this.showPreviewImages = this.visibleAreaMedia = false;
    this.listFile = []
    this.postForm.get('media')?.reset();
  }
}
