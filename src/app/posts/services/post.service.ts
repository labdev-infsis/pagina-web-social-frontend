import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../authentication/services/auth.service';
import { CreatePost } from '../models/create-post';
import { Institution } from '../models/institution';
import { Post } from '../models/post';
import { UploadedImage } from '../models/uploaded-image';
import { CreateReaction } from '../models/create-reaction';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // private baseUrl = 'https://devpws.cs.umss.edu.bo/api/v1'; // URL base del backend
  private baseUrl = 'http://localhost:9090/api/v1'; // URL base del backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<Institution> {
    const urlInstitution = 'institutions'
    return this.http.get<Institution>(`${this.baseUrl}/${urlInstitution}/${uuid}`);
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
  uploadImages(formData: FormData): Observable<UploadedImage[]>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const uploadImgs = 'images/posts'
    return this.http.post<UploadedImage[]>(`${this.baseUrl}/${uploadImgs}`, formData, reqHeader)
  }

  //Método para reaccionar a una publicacion
  postReaction(postUuid: string, body: CreateReaction): Observable<any>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const urlReactPost = 'reactions'
    return this.http.post<any>(`${this.baseUrl}/posts/${postUuid}/${urlReactPost}`, body, reqHeader)
  }

  
}
