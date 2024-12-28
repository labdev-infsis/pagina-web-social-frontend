import { Component, signal} from '@angular/core';
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
  visibleAreaMedia = signal(false); //Controla cuando se quiere subir img, mandar hijo input, recibir cuando se cierre output
  visibleAreaMediaDoc = signal(false);  //Doc
  disableLoadImage = signal(false);
  disableLoadDoc = signal(false);
  disabledPublishButton = signal(true); 
  postForm!: FormGroup
  listFile!: File[]; //img
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

  getTextPost(text: string){
    this.postForm.get('contentPost')?.setValue(text);
    text != '' ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
  }

  showAreaMedia(){
    this.visibleAreaMedia.set(true);
    this.disableLoadDoc.set(true);
  }

  closeAreaMedia(option: boolean){
    this.disableLoadDoc.set(option);
    this.disabledPublishButton.set(true);
  }

  getFilesImagesPost(fileMedia: File[]){
    this.listFile = fileMedia;
    this.listFile ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
  }

  showAreaDoc(){
    this.visibleAreaMediaDoc.set(true);
    this.disableLoadImage.set(true);
  }

  closeAreaDoc(option: boolean){
    this.disableLoadImage.set(option);
    this.disabledPublishButton.set(true);
  }

  getFileDocPost(doc: File){
    this.fileDoc = doc;
    this.fileDoc ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
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

    //Si hay info para postear
    if(valueFormPost.contentPost != '' || this.listFile || this.fileDoc){
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
                name: image.name,
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
              name: uploadResponse.name,
              path: uploadResponse.urlResource
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
    }else{
      console.error('No hay datos para postear');
    }
  }
}
