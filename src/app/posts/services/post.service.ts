import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';
import { CreatePost } from '../models/create-post';
import { Institution } from '../models/institution';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { UploadedMedia } from '../models/uploaded-media';
import { CreateReaction } from '../models/create-reaction';
import { environment } from '../../../environments/environment';
import { CommentConfig } from '../models/comment-config';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmojiType } from '../models/emoji-type';
import { PostComment } from '../models/post-comment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV}`;
  private reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+ this.authService.getToken() }) };


  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de una institución

  getInstitution(uuid: string): Observable<Institution> {
    const urlInstitution = 'institutions'
    return this.http.get<Institution>(`${this.ROOT_URL}/${urlInstitution}/${uuid}`);
  }

  //Método para obtener un user
  getUser(): Observable<any>{
    const getUser = 'users/me'
    return this.http.get<any>(`${this.ROOT_URL}/${getUser}`, this.reqHeader)
  }

  // Método para obtener los posts
  getPosts(): Observable<Post[]>{
    const getPosts = 'posts'
    return this.http.get<Post[]>(`${this.ROOT_URL}/${getPosts}`);

  }

  //Método para crear un post
  createPost(dataPost: CreatePost): Observable<CreatePost>{
    const createPost = 'posts'
    return this.http.post<CreatePost>(`${this.ROOT_URL}/${createPost}`, dataPost, this.reqHeader)
  }

  //Método para subir imagenes
  uploadImages(formData: FormData): Observable<UploadedMedia[]>{
    const uploadImgs = 'images/posts'
    return this.http.post<UploadedMedia[]>(`${this.ROOT_URL}/${uploadImgs}`, formData, this.reqHeader)
  }

  //Métedo para subir videos
  uploadVideos(formData: FormData): Observable<UploadedMedia[]>{
    const uploadImgs = 'videos/posts'
    return this.http.post<UploadedMedia[]>(`${this.ROOT_URL}/${uploadImgs}`, formData, this.reqHeader)
  }

  //Método para subir media (imagenes y videos)
  uploadMedia(formData: FormData): Observable<UploadedMedia[]>{
    const imagesFormData = new FormData();
    const videosFormData = new FormData();

    // Clasificar los archivos
    formData.forEach((file, key) => {
      if (file instanceof File) {
        if (file.type.startsWith('image/')) {
          imagesFormData.append(key, file);
        } else if (file.type.startsWith('video/')) {
          videosFormData.append(key, file);
        }
      }
    });

    // Observables para guardar imágenes y videos
    const observables: Observable<UploadedMedia[]>[] = [];

    // Subir imágenes si las hay
    if (imagesFormData.has('images')) {
      observables.push(this.uploadImages(imagesFormData));
    }

    // Subir videos si los hay
    if (videosFormData.has('videos')) {
      observables.push(this.uploadVideos(videosFormData));
    }

    // Combinar los resultados
    return forkJoin(observables).pipe(
      map((results) => results.flat()) // Combina los arrays de resultados en uno solo
    );
  }

  //Método para subir un archivo
  uploadDocument(formData: FormData): Observable<any>{
    const uploadImgs = 'documents/posts'
    return this.http.post<any>(`${this.ROOT_URL}/${uploadImgs}`, formData, this.reqHeader)
  }

  //Método para reaccionar a una publicacion
  postReaction(postUuid: string, body: CreateReaction): Observable<any>{
    const urlReactPost = 'reactions'
    return this.http.post<any>(`${this.ROOT_URL}/posts/${postUuid}/${urlReactPost}`, body, this.reqHeader)
  }

  // Método para obtener los comentarios de un post
  getPostComments(uuid: string): Observable<Comment[]>{
    const getPosts = 'posts'
    const getComments = 'comments'
    return this.http.get<Comment[]>(`${this.ROOT_URL}/${getPosts}/${uuid}/${getComments}`);

  }

  
  //Método para obtener configuraciones de comentarios
  getCommentsConfiguration(): Observable<CommentConfig[]>{
    const commentConfigUrl = 'comment-config'
    return this.http.get<CommentConfig[]>(`${this.ROOT_URL}/${commentConfigUrl}`, this.reqHeader);
  }

  //Método para eliminar un post
  deletePost(postUuid: string): Observable<Post>{
    const deletePost = 'posts'
    return this.http.delete<Post>(`${this.ROOT_URL}/${deletePost}/${postUuid}`, this.reqHeader);
  }

  //Método para actualizar un post
  updatePost(postUuid: string, dataPost: CreatePost): Observable<Post>{
    const updatePost = 'posts'
    return this.http.put<Post>(`${this.ROOT_URL}/${updatePost}/${postUuid}`, dataPost, this.reqHeader);
  }

  //Método para obeter los tipos de emojis
  getEmojisType(): Observable<EmojiType[]>{
    const getEmojis = 'emoji-type'
    return this.http.get<EmojiType[]>(`${this.ROOT_URL}/${getEmojis}`, this.reqHeader);
  }

  // Método para obtener los comentarios de un post
  getComments(postUuid: string): Observable<Comment[]> {
    const endpoint = `posts/${postUuid}/comments`;
    return this.http.get<Comment[]>(`${this.ROOT_URL}/posts/${postUuid}/comments`, this.reqHeader);
  }

  // Método para agregar un comentario a un post usando uuid
  addComment(uuid: string, commentData: PostComment): Observable<PostComment> {
    const endpoint = `posts/${uuid}/comments`; // 🔥 Corrección: Ahora usamos uuid en la URL
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Error: No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }

    const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // 🔥 Enviar token en la cabecera
    });

    const fullUrl = `${this.ROOT_URL}/${endpoint}`;


    return this.http.post<PostComment>(fullUrl, commentData, { headers });
  }

  //Obtener todas las fotos de la institucion 
   getInstitutionPhotos(uuid: string): Observable<any[]> {
    const url = `${this.ROOT_URL}/institutions/${uuid}/photos`;
    return this.http.get<any[]>(url);
  }

  //Obtener todos los videos de la institucion 
  getInstitutionVideos(uuid: string): Observable<any[]> {
    const url = `${this.ROOT_URL}/institutions/${uuid}/videos`;
    return this.http.get<any[]>(url);
  }

}