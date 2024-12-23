import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Media } from '../../models/media';
import { concatMap } from 'rxjs';
import { UploadedMedia } from '../../models/uploaded-media';
import { CreatePost } from '../../models/create-post';
import { Institution } from '../../models/institution';
import { UploadedDocument } from '../../models/uploaded-document';
import moment from 'moment';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  institution!: Institution;
  visibleAreaMedia = false;
  visibleAreaMediaDoc = false;
  showPreviewImages = false;
  showPreviewDoc = false;
  disableLoadImage = false;
  disableLoadDoc = false;
  disabledPublishButton = true; 
  postForm!: FormGroup
  imagesPreview:string[] = []
  listFile!: File[];
  fileDoc!: File;

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
      contentPost: ['',  [Validators.maxLength(1000)]],
      media: [[]],
      mediaDoc: [[]]
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
    this.visibleAreaMedia = true;
    this.disableLoadDoc = true;
  }

  showAreaDoc(){
    this.visibleAreaMediaDoc = true;
    this.disableLoadImage = true;
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

  changeInputMediaDoc(event: Event){
    if(event.target instanceof HTMLInputElement && event.target.files){
      this.fileDoc = event.target.files[0]
      this.disabledPublishButton = false;
      this.showPreviewDoc = true;
    }
  }

  getTypeFile(type: string){
    const types = 
    {
      pdf : 'application/pdf',
      document : ['application/doc','application/docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      presentation: ['application/pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      text : 'application/txt' 
    }
    if(type === types.pdf)
      return 'File PDF'
    else if(types.document.includes(type))
      return 'File DOCUMENTO'
    else if(types.presentation.includes(type))
      return 'File PRESENTACION'
    else
      return 'File DOCUMENTO'
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

  openInputFileImgVid(){
    const inputFile = document.getElementById('input-file-img-vid')
    inputFile?.click()
  }

  openInputFileDoc(){
    const inputFileDoc = document.getElementById('input-file-doc');
    inputFileDoc?.click()
  }

  post(){
    const valueFormPost = this.postForm.value
    const formData = new FormData()
    const responseImages: Media[] = [] 
    let responseDoc: Media
    const post: CreatePost = {
      institution_id: this.institution.uuid,
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      comment_config_id: "875d7d7f-7a1c-4b77-ab63-77a9f76759d0",//Default todos comentan
      content: {
        text: valueFormPost.contentPost,
        media: []
      }
    }

    if(this.listFile){ //Si hay imagenes se los procesa
      //Convertir las imagenes en Form Data
      Array.from(this.listFile).forEach((file) => {
        formData.append('images', file);
      });

      this.postService.uploadImages(formData).pipe(
        concatMap((uploadResponse: UploadedMedia[]) => {
          uploadResponse.forEach((image, index) => {
            responseImages.push({
              number: index + 1,
              type: image.type,
              path: image.urlResource
            });
          });

          post.content.media = responseImages

          return this.postService.createPost(post);
        })
      ).subscribe({
        next: ()=> {
          window.location.reload()
        },
        error: (error) => {
          console.log('Error al crear el post con imagen (es)',error)
        }
      })
    }else if(this.fileDoc){//Si hay un archivo
      //Convertir el archivo en form data
      formData.append('file', this.fileDoc);

      this.postService.uploadDocument(formData).pipe(
        concatMap((uploadResponse: UploadedDocument) => {
          responseDoc = {
            number: 1,
            type: 'document',//uploadResponse.type,
            path: uploadResponse.url
          }

          post.content.media?.push(responseDoc)

          return this.postService.createPost(post);
        })
      ).subscribe({
        next: ()=> {
          window.location.reload()
        },
        error: (error) => {
          console.log('Error al crear el post con archivo',error)
        }
      })      
    }else if(valueFormPost.contentPost != ''){//Si solo tiene texto

      this.postService.createPost(post).subscribe({
        next: () => {
          window.location.reload()
        },
        error: (error) => {
          console.log('Error al subir post solo texto', error)
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
    this.disableLoadDoc = false;
    this.showPreviewImages = this.visibleAreaMedia = false;
    this.listFile = []
    this.postForm.get('media')?.reset();
  }

  closeCleanPreviewDoc(){
    this.disabledPublishButton = true;
    this.listFile = []
    this.postForm.get('media')?.reset();
    this.showPreviewDoc = this.visibleAreaMediaDoc = this.disableLoadImage = false;
  }
}
