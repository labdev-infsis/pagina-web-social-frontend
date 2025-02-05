import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Institution } from '../../models/institution';
import { Post } from '../../models/post';
import { CommentConfig } from '../../models/comment-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Media } from '../../models/media';
import { CreatePost } from '../../models/create-post';
import { concatMap } from 'rxjs';
import { UploadedMedia } from '../../models/uploaded-media';
import { UploadedDocument } from '../../models/uploaded-document';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal-edit-post',
  templateUrl: './modal-edit-post.component.html',
  styleUrl: './modal-edit-post.component.scss'
})
export class ModalEditPostComponent {
  @Input() institution!: Institution;
  @Input() postToEdit!: Post;
  @Output() postUpdated = new EventEmitter<Post>();
  commentConfig!: CommentConfig[];
  @Input() showME!: WritableSignal<boolean>;
  selectedCommentConfig!: string;
  visibleAreaMedia = signal(false); //Mostrar seleccion y prevista de imagenes
  visibleAreaMediaDoc = signal(false); //Mostrar seleccion y prevista de documentos

  disableLoadImage = signal(false); //Deshabilitar el boton de cargar imagenes
  disableLoadDoc = signal(false); //Deshabilitar el boton de cargar documentos

  disabledSaveButton = signal(true); //Deshabilitar el boton de guardar
  postForm!: FormGroup;
  listFile: File[] = []; //Lista de media editada obtenida de 'image-video-editor' component
  fileDoc!: File;  //
  typeMedia = {
    img_vid : 'images-videos',
    doc: 'document'
  }

  constructor(
      private postService: PostService,
      private formBuilder: FormBuilder
  ){}

  ngOnInit(){
    //Obtener la configuracion de comentarios
    this.postService.getCommentsConfiguration().subscribe({
      next: (commentsConfiguration: CommentConfig[])=>{
        this.commentConfig = commentsConfiguration;
        this.selectedCommentConfig = this.postToEdit.comment_config_id;//Configuracion de comentarios del post
      },
      error: (error)=>{
        console.log('Error al obtener la configuracion de comentarios', error)
      }
    })
    this.buildForm()
    //No deshabilitar boton Guardar si el post viene con info
    this.disabledSaveButton.set(!(this.postToEdit.content.text != '' || this.postToEdit.content.media.length > 0));
    if(this.postToEdit.content.media.length > 0)
      this.postToEdit.content.media[0].type == 'document'? this.disableLoadImage.set(true) : this.disableLoadDoc.set(true);
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      contentPost: [''],
      media: [[]],
      mediaDoc: [[]]
    });
  }

  //Obtener texto editado del textarea y Deshabilitar el boton de guardar si no hay texto
  getTextPost(text: string){
    this.postForm.get('contentPost')?.setValue(text);
    text != '' ? this.disabledSaveButton.set(false) : this.disabledSaveButton.set(true);
  }
  
  //Mostrar area de imagenes y deshabilitar el boton de cargar documentos
  showAreaMedia(){
    this.visibleAreaMedia.set(true);
    this.disableLoadDoc.set(true);
  }
  
  //Ocultar area de imagenes
  closeAreaMedia(option: boolean){
    this.disableLoadDoc.set(option); //Habilitar el boton de cargar documentos
    this.disabledSaveButton.set(true);//Deshabilitar el boton de guardar
    this.listFile = [];//Limpiar la lista de imagenes
  }
  
  //Obtener imagenes-videos editados y Deshabilitar el boton de guardar si no hay imagenes
  getFilesMediaPost(fileMedia: File[]){
    this.listFile = fileMedia;
    this.listFile ? this.disabledSaveButton.set(false) : this.disabledSaveButton.set(true);
  }
  
  //Mostrar area de documentos y deshabilitar el boton de cargar imagenes
  showAreaDoc(){
    this.visibleAreaMediaDoc.set(true);
    this.disableLoadImage.set(true);
  }
  
  //Ocultar area de documentos
  closeAreaDoc(option: boolean){
    this.disableLoadImage.set(option);
    this.disabledSaveButton.set(true);
    this.fileDoc = new File([''],'');//Limpiar el archivo
  }
  
  //Obtener el Doc editado y Deshabilitar el boton de guardar si no hay archivo
  getFileDocPost(doc: File){
    this.fileDoc = doc;
    this.fileDoc ? this.disabledSaveButton.set(false) : this.disabledSaveButton.set(true);
  }

  sendMedia(type: string){
    if(type == this.typeMedia.img_vid){
      if(this.postToEdit.content.media.length > 0 && this.postToEdit.content.media[0].type != 'document')
        return this.postToEdit.content.media;
      else
        return undefined;
    }else{
      if(this.postToEdit.content.media.length > 0 && this.postToEdit.content.media[0].type == 'document')
        return this.postToEdit.content.media;
      else
        return undefined;
    }
  }

  disableSaveButton(){
    if(this.postForm.get('contentPost')?.value && this.listFile || this.fileDoc){
      this.disabledSaveButton.set(true);
    }
  }

  closeResetModalEdit(id: string){
    const modalElement = document.getElementById('edit-'+id);
    if (modalElement) {
      let modal = Modal.getInstance(modalElement);
      modal?.hide();
      this.selectedCommentConfig = this.postToEdit.comment_config_id;
      console.log('entro', 'edit-'+id)
      this.showME.set(false);
    }
  }

  openModalConfirmExitEdit(id: string){
    const modalElement = document.getElementById('confirmExitEditPost-'+id);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  
  updatePost(){
    const valueFormPost = this.postForm.value;
    const formData = new FormData();
    const responseMedia: Media[] = []; //Respuesta de imagenes y videos guardados
    let responseDoc: Media;
    const post: CreatePost = {
      institution_id: this.institution.uuid,
      date: this.postToEdit.date,
      comment_config_id: this.selectedCommentConfig,
      content: {
        text: valueFormPost.contentPost,
        media: []
      }
    }
    this.postUpdated.emit(this.postToEdit); // mandar luego de llamar al servicio revisar--------
    //Si hay info para postear (texto, imagen o video, documento)
    if(valueFormPost.contentPost != '' || this.listFile || this.fileDoc){
      if(this.listFile && this.listFile.length > 0){ //Si hay imagenes-videos se los procesa
        //Convertir las imagenes y videos en Form Data con su key correspondiente
        Array.from(this.listFile).forEach((file) => {
          file.type.includes('image')? formData.append('images', file) : formData.append('videos', file);
        });

        this.postService.uploadMedia(formData).pipe(
          concatMap((uploadResponse: UploadedMedia[]) => {
            uploadResponse.forEach((media, index) => {
              responseMedia.push({
                number: index + 1,
                type: media.type,
                name: media.name,
                path: media.urlResource
              });
            });

            post.content.media = responseMedia;

            return this.postService.createPost(post);
          })
        ).subscribe({
          next: ()=> {
            window.location.reload()
          },
          error: (error) => {
            console.log('Error al crear el post con contenido media (imagenes y/o videos)',error)
          }
        })
      }else if(this.fileDoc && this.fileDoc.size > 0){//Si hay un archivo
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
      console.log('No hay datos para postear');
    }
  }
}
