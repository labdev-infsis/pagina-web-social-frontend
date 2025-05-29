import { Component, signal } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Modal } from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Media } from '../../models/media';
import { concatMap, of, forkJoin, map, catchError } from 'rxjs';
import { UploadedMedia } from '../../models/uploaded-media';
import { CreatePost } from '../../models/create-post';
import { Institution } from '../../models/institution';
import { UploadedDocument } from '../../models/uploaded-document';
import moment from 'moment';
import { CommentConfig } from '../../models/comment-config';
import { FbUploadedMedia } from '../../models/fb-uploaded-media';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  institution!: Institution;
  commentConfig!: CommentConfig[];
  selectedCommentConfig!: string;
  fbMediaResponse!: FbUploadedMedia;
  visibleAreaMedia = signal(false); //Mostrar seleccion y prevista de imagenes
  visibleAreaMediaDoc = signal(false); //Mostrar seleccion y prevista de documentos
  disableLoadImage = signal(false); //Deshabilitar el boton de cargar imagenes
  disableLoadDoc = signal(false); //Deshabilitar el boton de cargar documentos
  disabledPublishButton = signal(true); //Deshabilitar el boton de publicar
  postForm!: FormGroup;
  listFile!: File[];
  fileDoc!: File;
  isFbPosted!: boolean;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    //Obtener la informacion de la institucion
    this.postService.getInstitution(uuid).subscribe({
      next: (institutionData: Institution) => {
        this.institution = institutionData
      },
      error: (error) => {
        console.log(error)
      }
    });
    //Obtener la configuracion de comentarios
    this.postService.getCommentsConfiguration().subscribe({
      next: (commentsConfiguration: CommentConfig[]) => {
        this.commentConfig = commentsConfiguration;
        this.selectedCommentConfig = this.commentConfig[0].uuid;//Por defecto todos comentan
      },
      error: (error) => {
        console.log('Error al obtener la configuracion de comentarios', error)
      }
    })
    this.buildForm()
  }

  private buildForm() {
    this.postForm = this.formBuilder.group({
      contentPost: ['', [Validators.maxLength(1000)]],
      media: [[]],
      mediaDoc: [[]]
    });
  }

  openModalCreatePost() {
    const modalElement = document.getElementById('modalCreatePost');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  //Deshabilitar el boton de publicar si no hay texto
  getTextPost(text: string) {
    this.postForm.get('contentPost')?.setValue(text);
    text != '' ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
  }

  //Mostrar area de imagenes y deshabilitar el boton de cargar documentos
  showAreaMedia() {
    this.visibleAreaMedia.set(true);
    this.disableLoadDoc.set(true);
  }

  //Ocultar area de imagenes
  closeAreaMedia(option: boolean) {
    this.disableLoadDoc.set(option); //Habilitar el boton de cargar documentos
    this.disabledPublishButton.set(true);//Deshabilitar el boton de publicar
    this.listFile = [];//Limpiar la lista de imagenes
  }

  //Deshabilitar el boton de publicar si no hay imagenes
  getFilesImagesPost(fileMedia: File[]) {
    this.listFile = fileMedia;
    this.listFile ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
  }

  //Mostrar area de documentos y deshabilitar el boton de cargar imagenes
  showAreaDoc() {
    this.visibleAreaMediaDoc.set(true);
    this.disableLoadImage.set(true);
  }

  //Ocultar area de documentos
  closeAreaDoc(option: boolean) {
    this.disableLoadImage.set(option);
    this.disabledPublishButton.set(true);
    this.fileDoc = new File([''], '');//Limpiar el archivo
  }

  //Deshabilitar el boton de publicar si no hay archivo
  getFileDocPost(doc: File) {
    this.fileDoc = doc;
    this.fileDoc ? this.disabledPublishButton.set(false) : this.disabledPublishButton.set(true);
  }

  post() {
    const valueFormPost = this.postForm.value;
    const formData = new FormData();
    const formDataFB = new FormData();
    const responseMedia: Media[] = []; //Respuesta de imagenes y videos guardados
    let responseDoc: Media;
    const post: CreatePost = {
      institution_id: this.institution.uuid,
      date: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
      comment_config_id: this.selectedCommentConfig,
      content: {
        text: valueFormPost.contentPost.trim(),
        media: []
      },
      is_fb_posted: false
    }

    //Si hay info para postear
    if (valueFormPost.contentPost != '' || this.listFile || this.fileDoc) {
      if (this.listFile && this.listFile.length > 0) { //Si hay imagenes-videos se los procesa
        //Convertir las imagenes y videos en Form Data con su key correspondiente
        Array.from(this.listFile).forEach((file) => {
          if (file.type.includes('image')) {
            formData.append('images', file);
          } else if (file.type.includes('video')) {
            formData.append('videos', file);
          }
          formDataFB.append('source', file);
        });

        this.postService.uploadMedia(formData).pipe(
          concatMap((uploadResponse: UploadedMedia[]) => {

        // Crear array de observables para Facebook
          const facebookUploads = uploadResponse.map((media, index) => {
          const isImage = media.type.includes('image');
          
          const fbUpload$ = isImage 
            ? this.postService.uploadPhotoToFacebook(formDataFB)
            : this.postService.publishVideoToFacebook(formDataFB, valueFormPost.contentPost);

          this.isFbPosted = isImage ? false : true;

          console.log('is image:' + this.isFbPosted);

          return fbUpload$.pipe(
            map(fbResponse => ({
              number: index + 1,
              type: isImage ? 'image' : 'video',
              name: media.name,
              path: media.urlResource,
              fb_media_id: fbResponse.id,
              is_fb_posted: this.isFbPosted
            })),
            catchError(error => {
              //console.error(Error uploading ${isImage ? 'photo' : 'video'}, error);
              return of({
                number: index + 1,
                type: isImage ? 'image' : 'video',
                name: media.name,
                path: media.urlResource,
                fb_media_id: '',
                is_fb_posted: this.isFbPosted
              });
            })
            
          );
        });

        return forkJoin(facebookUploads).pipe(
          map(responseMedia => {
            post.content.media = responseMedia;
            post.is_fb_posted = this.isFbPosted;
            return this.postService.createPost(post);
          })
        );
      }),
      concatMap(createPost$ => createPost$)
        ).subscribe({
          next: () => {
            window.location.reload()
          },
          error: (error) => {
            console.log('Error al crear el post con contenido media (imagenes y/o videos)', error)
          }
        })

      } else if (this.fileDoc && this.fileDoc.size > 0) {//Si hay un archivo
        //Convertir el archivo en form data
        formData.append('file', this.fileDoc);
        formDataFB.append('url', this.fileDoc);
        this.postService.uploadDocument(formData).pipe(
          concatMap((uploadResponse: UploadedDocument) => {
            this.postService.publishDocumentToFacebook(formDataFB, valueFormPost.contentPost, uploadResponse.urlResource).subscribe({
              next: (fbDocument: FbUploadedMedia) => {
                this.fbMediaResponse = fbDocument;
                this.isFbPosted = true;
                console.log('Facebook Media ID:', this.fbMediaResponse);
              },
              error: (error) => {
                console.error('Error uploading document', error);
              }
            });

            responseDoc = {
              number: 1,
              type: 'document',//uploadResponse.type,
              name: uploadResponse.name,
              path: uploadResponse.urlResource,
              fb_media_id: this.fbMediaResponse ? this.fbMediaResponse.id : ''
            }

            post.content.media?.push(responseDoc);
            post.is_fb_posted = true;
            return this.postService.createPost(post);
          })
             
        ).subscribe({
          next: () => {
            window.location.reload()
          },
          error: (error) => {
            console.log('Error al crear el post con archivo', error)
          }
        })
      } else if (valueFormPost.contentPost != '') {//Si solo tiene texto

        this.postService.createPost(post).subscribe({
          next: () => {
            window.location.reload()
          },
          error: (error) => {
            console.log('Error al subir post solo texto', error)
          }
        })
      }
    } else {
      console.log('No hay datos para postear');
    }
  }
}
