import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';
import { CreatePost } from '../models/create-post';
import { Institution } from '../models/institution';
import { Post } from '../models/post';
import { UploadedMedia } from '../models/uploaded-media';
import { CreateReaction } from '../models/create-reaction';
import { environment } from '../../../environments/environment';
import { CommentConfig } from '../models/comment-config';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // private baseUrl = 'https://devpws.cs.umss.edu.bo/api/v1'; // URL base del backend
  private baseUrl = 'http://localhost:9090/api/v1'; // URL base del backend
  readonly ROOT_URL = `${environment.BACK_END_HOST}`;
  private reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') }) };


  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de una institución

  getInstitution(uuid: string): Observable<Institution> {
    const urlInstitution = 'institutions'
    return this.http.get<Institution>(`${this.baseUrl}/${urlInstitution}/${uuid}`);
  }

  //Método para obtener un user
  getUser(): Observable<any>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const getUser = 'users/me'
    return this.http.get<any>(`${this.baseUrl}/${getUser}`, reqHeader)
  }

  // Método para obtener los posts
  getPosts(): Observable<Post[]>{
    const getPosts = 'posts'
    return this.http.get<Post[]>(`${this.baseUrl}/${getPosts}`);

  }

  //Método para crear un post
  createPost(dataPost: CreatePost): Observable<CreatePost>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const createPost = 'posts'
    return this.http.post<CreatePost>(`${this.baseUrl}/${createPost}`, dataPost, reqHeader)
  }

  //Método para subir imagenes
  uploadImages(formData: FormData): Observable<UploadedMedia[]>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const uploadImgs = 'images/posts'
    return this.http.post<UploadedMedia[]>(`${this.baseUrl}/${uploadImgs}`, formData, reqHeader)
  }

  //Métedo para subir videos
  uploadVideos(formData: FormData): Observable<UploadedMedia[]>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const uploadImgs = 'videos/posts'
    return this.http.post<UploadedMedia[]>(`${this.baseUrl}/${uploadImgs}`, formData, reqHeader)
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
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const uploadImgs = 'documents/posts'
    return this.http.post<any>(`${this.baseUrl}/${uploadImgs}`, formData, reqHeader)
  }

  //Método para reaccionar a una publicacion
  postReaction(postUuid: string, body: CreateReaction): Observable<any>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const urlReactPost = 'reactions'
    return this.http.post<any>(`${this.baseUrl}/posts/${postUuid}/${urlReactPost}`, body, reqHeader)
  }

  //Método para obtener configuraciones de comentarios
  getCommentsConfiguration(): Observable<CommentConfig[]>{
    const commentConfigUrl = 'comment-config'
    return this.http.get<CommentConfig[]>(`${this.baseUrl}/${commentConfigUrl}`);
  }
}
