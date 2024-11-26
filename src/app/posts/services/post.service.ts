import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from '../../authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:9090/api/v1'; // URL base del backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<any> {
    const urlInstitution = 'institution'
    return this.http.get<any>(`${this.baseUrl}/${urlInstitution}/${uuid}`);
  }

  // Método para obtener los posts
  getPosts(): Observable<any>{
    const getPosts = 'post'
    return this.http.get<any>(`${this.baseUrl}/${getPosts}`);
  }

  //Método para crear un post
  createPost(dataPost: Post): Observable<Post>{
    const reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+this.authService.getToken() }) };
    const createPost = 'post'
    return this.http.post<Post>(`${this.baseUrl}/${createPost}`, dataPost, reqHeader)
  }
}
