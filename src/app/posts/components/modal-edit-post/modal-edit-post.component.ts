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
import { FbUploadedMedia } from '../../models/fb-uploaded-media';
import { Modal } from 'bootstrap';
import { UserDetail } from '../../models/user-detail';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-modal-edit-post',
  templateUrl: './modal-edit-post.component.html',
  styleUrl: './modal-edit-post.component.scss'
})
export class ModalEditPostComponent {
  @Input() institution!: Institution;
  @Input() postToEdit!: Post;
  @Input() showModalEdit!: WritableSignal<boolean>;
  @Output() postUpdatedEvent = new EventEmitter<Post>();
  commentConfig!: CommentConfig[];
  selectedCommentConfig!: string;
  visibleAreaMedia = signal(false); //Mostrar seleccion y prevista de imagenes
  visibleAreaMediaDoc = signal(false); //Mostrar seleccion y prevista de documentos

  disableLoadImage = signal(false); //Deshabilitar el boton de cargar imagenes
  disableLoadDoc = signal(false); //Deshabilitar el boton de cargar documentos

  disabledSaveButton = signal(false); //Deshabilitar el boton de guardar
  postForm!: FormGroup;
  listNewMediaFile: File[] = []; //Lista de media editada obtenida de 'image-video-editor' component
  listOldMediaFile!: Media[]; //Lista de media editada que existe en el post
  fileDoc!: File;  //Doc añadido en edicion
  fbMediaResponse!: FbUploadedMedia;
  currentUser!: UserDetail;
  currentPostType!: string;
  isAuthenticated: boolean = false;
  documentWasRemoved: boolean = false; // Bandera para rastrear si el documento fue eliminado
  mediaWasRemoved: boolean = false; // Bandera para rastrear si las imágenes/videos fueron eliminados
  typeMedia = {
    img_vid : 'images-videos',
    doc: 'document'
  }

  constructor(
      private postService: PostService,
      private formBuilder: FormBuilder,
      private readonly authService: AuthService
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
    this.getTypeByRol()
    this.buildForm()
    
    // Inicializar listOldMediaFile con los medios existentes del post
    this.listOldMediaFile = this.postToEdit.content.media ? [...this.postToEdit.content.media] : [];
    
    //No deshabilitar boton Guardar si el post viene con info
    this.disabledSaveButton.set(!(this.postToEdit.content.text != '' || this.postToEdit.content.media.length > 0));
    if(this.postToEdit.content.media.length > 0)
      this.postToEdit.content.media[0].type == 'document'? this.disableLoadImage.set(true) : this.disableLoadDoc.set(true);
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      contentPost: [this.postToEdit.content.text],
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
    //Deshabilitar el boton de guardar si no hay text
    this.postForm.get('contentPost')?.value == ''? this.disabledSaveButton.set(true) : this.disabledSaveButton.set(false);
    this.listNewMediaFile = [];//Limpiar la lista de imagenes
  }
  
  //Establecer imagenes-videos editados y Deshabilitar el boton de guardar si no hay imagenes
  setFilesMediaPostAdded(fileMedia: File[]){
    this.listNewMediaFile = fileMedia;
    this.listNewMediaFile ? this.disabledSaveButton.set(false) : this.disabledSaveButton.set(true);
  }

  //Establecer imagenes-videos ya existentes y Deshabilitar el boton de guardar si no hay imagenes
  setFilesMediaPostOld(fileMedia: Media[]){
    // Asignar fileMedia o un array vacío si es undefined
    this.listOldMediaFile = fileMedia || [];
    // Solo deshabilitar el botón si hay elementos en el array
    if (this.listOldMediaFile && this.listOldMediaFile.length > 0) {
      this.disabledSaveButton.set(false);
    } else if (this.postForm.get('contentPost')?.value === '') {
      // Si no hay media ni texto, deshabilitar el botón
      this.disabledSaveButton.set(true);
    }
  }
  
  //Mostrar area de documentos y deshabilitar el boton de cargar imagenes
  showAreaDoc(){
    this.visibleAreaMediaDoc.set(true);
    this.disableLoadImage.set(true);
  }
  
  //Ocultar area de documentos
  closeAreaDoc(option: boolean){
    this.disableLoadImage.set(option);
    //Deshabilitar el boton de guardar si no hay text
    this.postForm.get('contentPost')?.value == ''? this.disabledSaveButton.set(true) : this.disabledSaveButton.set(false);
    this.fileDoc = new File([''],'');//Limpiar el archivo
  }
  
  //Establecer el Doc editado y Deshabilitar el boton de guardar si no hay archivo
  setFileDocPostAdded(doc: File){
    this.fileDoc = doc;
    // Asegurarse de que el tamaño del archivo sea mayor que 0
    if (this.fileDoc && this.fileDoc.size > 0) {
      this.disabledSaveButton.set(false);
    } else {
      this.disabledSaveButton.set(true);
    }
  }
  
  // Método para manejar la eliminación de un documento
  handleDocumentRemoved(removed: boolean) {
    if (removed) {
      this.documentWasRemoved = true;
      // Remover el documento de listOldMediaFile si existe
      this.listOldMediaFile = this.listOldMediaFile.filter(media => media.type !== 'document');
      // Habilitar el botón de guardar para que se pueda actualizar el post sin el documento
      this.disabledSaveButton.set(false);
    }
  }
  
  // Método para manejar la eliminación de imágenes/videos
  handleMediaRemoved(removed: boolean) {
    if (removed) {
      this.mediaWasRemoved = true;
      // Habilitar el botón de guardar para que se pueda actualizar el post sin las imágenes/videos
      this.disabledSaveButton.set(false);
    }
  }

  sendMedia(type: string){
    // Verificar si el post tiene contenido media
    if (!this.postToEdit.content.media || this.postToEdit.content.media.length === 0) {
      return []; // Retornar un array vacío si no hay media
    }
    
    if(type == this.typeMedia.img_vid){
      if(this.postToEdit.content.media.length > 0 && this.postToEdit.content.media[0].type != 'document')
        return this.postToEdit.content.media;
      else
        return []; // Retornar un array vacío en lugar de undefined
    }else{
      if(this.postToEdit.content.media.length > 0 && this.postToEdit.content.media[0].type == 'document')
        return this.postToEdit.content.media;
      else
        return []; // Retornar un array vacío en lugar de undefined
    }
  }

  disableSaveButton(){
    if(this.postForm.get('contentPost')?.value && this.listNewMediaFile || this.fileDoc){
      this.disabledSaveButton.set(true);
    }
  }

  //Cerrar modal sin guardar cambios
  closeResetModalEdit(id: string){
    const modalElement = document.getElementById('edit-'+id);
    if (modalElement) {
      let modal = Modal.getInstance(modalElement);
      modal?.hide();
      this.selectedCommentConfig = this.postToEdit.comment_config_id;
      this.showModalEdit.set(false);
    }
  }

  //Abrir modal de confirmación de salir de edición
  openModalConfirmExitEdit(id: string){
    const modalElement = document.getElementById('confirmExitEditPost-'+id);
    if (modalElement) {
      modalElement.style.zIndex = "1070";
      const modal = new Modal(modalElement);
      modal.show();
      setTimeout(() => {
        let backdrops = document.getElementsByClassName("modal-backdrop") as HTMLCollectionOf<HTMLElement>;
        if (backdrops.length > 1) {
          backdrops[backdrops.length - 1].style.zIndex = "1060"; // Último backdrop
        }
      }, 10);
    }
  }

  getTypeByRol() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
        this.postService.getUser().subscribe({
        next:(user: UserDetail) => {
          this.currentUser = user;
          
          this.currentPostType = this.determinePostType(this.currentUser.role);
          
        },
        error:(error) => {
          console.error('Error al obtener el usuario actual', error);
          }
        });
    } 
  }

  private determinePostType(role: string): string {
    switch (role) {
      case 'ADMIN_BECAS':
        return 'BECAS';
      case 'ADMIN_CONVENIOS':
        return 'CONVENIOS';
      case 'ADMIN_PROYECTOS':
        return 'PROYECTOS';
      default:
        return 'GENERAL';
    }
  }
  
  updatePost(){
    const valueFormPost = this.postForm.value;
    const formData = new FormData();
    const formDataFB = new FormData();
    const responseMedia: Media[] = []; //Respuesta de imagenes y videos guardados
    let responseDoc: Media;
    const editedPost: CreatePost = {
      institution_id: this.institution.uuid,
      date: this.postToEdit.date,
      comment_config_id: this.selectedCommentConfig,
      post_type: this.currentPostType,
      content: {
        text: valueFormPost.contentPost,
        media: []
      },
      is_fb_posted: false,
      fb_post_enable: false
    }

    //Si hay info para postear (texto, imagen o video, documento)
    if(valueFormPost.contentPost != '' || this.listNewMediaFile || this.fileDoc){

      //Pseudo eliminacion, actualiza solo texto de post con media img video
      if(this.listOldMediaFile == undefined){
        if(this.postToEdit.content.media.length>0 && this.postToEdit.content.media[0].type != 'document')
          editedPost.content.media = this.postToEdit.content.media;
      }

      //Si hay nuevas imagenes-videos se los procesa
      if(this.listNewMediaFile && this.listNewMediaFile.length > 0){ 

        //Convertir las nuevas imagenes y videos en Form Data con su key correspondiente
        Array.from(this.listNewMediaFile).forEach((file) => {
          file.type.includes('image')? formData.append('images', file) : formData.append('videos', file);
        });

        const amountImagesPost = this.postToEdit.content.media.length;

        //Borrar lista de media antigua 

        //Subir las nuevas imagenes-videos
        this.postService.uploadMedia(formData).pipe(
          concatMap((uploadResponse: UploadedMedia[]) => {
            uploadResponse.forEach((media, index) => {

              responseMedia.push({
                number: index + 1 + amountImagesPost,
                type: media.type,
                name: media.name,
                path: media.urlResource,
                fb_media_id: this.fbMediaResponse ? this.fbMediaResponse.id : ''
              });
            });

            //Añadir las imagenes que ya habian en el post
            // Inicializar como array vacío si listOldMediaFile es undefined
            editedPost.content.media = this.listOldMediaFile || [];

            //Añadir las nuevas medias que se agregaron
            Array.from(responseMedia).forEach((newMedia) => {
              editedPost.content.media.push(newMedia);
            });

            //Actualizar el post
            return this.postService.updatePost(this.postToEdit.uuid, editedPost);
          })
        ).subscribe({
          next: (responseUpdatedPost)=> {
            console.log('post con nuevas imagenes videos actualizado',responseUpdatedPost);
            window.location.reload();
            // this.postUpdatedEvent.emit(responseUpdatedPost);
          },
          error: (error) => {
            console.log('Error al actualizar el post con contenido media (imagenes y/o videos)', error)
          }
        })
      }else if(this.fileDoc && this.fileDoc.size > 0){//Si hay un archivo
        //Convertir el archivo en form data
        formData.append('file', this.fileDoc);
        console.log('dentro', this.fileDoc)
        this.postService.uploadDocument(formData).pipe(
          concatMap((uploadResponse: UploadedDocument) => {
  
            responseDoc = {
              number: 1,
              type: 'document',//uploadResponse.type,
              name: uploadResponse.name,
              path: uploadResponse.urlResource,
              fb_media_id: ''
            }

            if (!editedPost.content.media) {
              editedPost.content.media = [];
            }
            
            editedPost.content.media.push(responseDoc);
            editedPost.is_fb_posted = false;
            editedPost.fb_post_enable = false;
            return this.postService.updatePost(this.postToEdit.uuid, editedPost);
          })
        ).subscribe({
          next: (responseUpdatedPost)=> {
            console.log('post con archivo actualizado',responseUpdatedPost);
            window.location.reload();
            // this.postUpdatedEvent.emit(responseUpdatedPost);
          },
          error: (error) => {
            console.log('Error al actualizar el post con archivo',error)
          }
        })      
      }else if(valueFormPost.contentPost != '' || this.mediaWasRemoved || this.documentWasRemoved){//Si solo tiene texto O si se eliminaron medios
        // Usar directamente listOldMediaFile que ya contiene solo los medios que NO fueron eliminados
        if(this.listOldMediaFile && this.listOldMediaFile.length > 0) {
          // listOldMediaFile ya contiene solo los medios que deben preservarse
          editedPost.content.media = [...this.listOldMediaFile];
        } else {
          // Si no hay medios en listOldMediaFile, significa que se eliminaron todos o no había ninguno
          editedPost.content.media = [];
        }

        this.postService.updatePost(this.postToEdit.uuid, editedPost).subscribe({
          next: (responseUpdatedPost) => {
            console.log('post actualizado',responseUpdatedPost);
            window.location.reload();
            // this.postUpdatedEvent.emit(responseUpdatedPost);
          },
          error: (error) => {
            console.log('Error al actualizar post', error)
          }
        })
      }
    }else{
      console.log('No hay datos para postear');
    }
  }
}
