import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // private baseUrl = 'https://devpws.cs.umss.edu.bo/api/v1'; // URL base del backend
  private baseUrl = 'http://localhost:9090/api/v1'; // URL base del backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<any> {
    const urlInstitution = 'institutions'
    return this.http.get<any>(`${this.baseUrl}/${urlInstitution}/${uuid}`);
  }

  // Método para obtener los posts
  getPosts(): Observable<any>{
    const getPosts = 'posts'
    return this.http.get<any>(`${this.baseUrl}/${getPosts}`);
  }

  //Método para crear un post
  createPost(dataPost: any): Observable<any>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const createPost = 'posts'
    return this.http.post<any>(`${this.baseUrl}/${createPost}`, dataPost, reqHeader)
  }

  //Método para subir imagenes
  uploadImages(formData: FormData): Observable<any>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const uploadImgs = 'images/upload'
    return this.http.post<any>(`${this.baseUrl}/${uploadImgs}`, formData, reqHeader)
  }

  //Método para reaccionar a una publicacion
  postReaction(uuid: string, body:any){
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const urlReactPost = 'reactions'
    return this.http.post<any>(`${this.baseUrl}/posts/${uuid}/${urlReactPost}`, body)
  }

  
}
