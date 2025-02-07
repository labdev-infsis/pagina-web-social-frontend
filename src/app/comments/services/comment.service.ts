import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private BASE_URL = 'http://localhost:9090/api/v1';

  constructor(private http: HttpClient) {}

  // Obtener comentarios de un post
  getComments(postUuid: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.BASE_URL}/post/${postUuid}/comments`);
  }

  // Agregar un comentario a un post
  addComment(postUuid: string, commentData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/post/${postUuid}/comments`, commentData);
  }

  // Reaccionar a un comentario
  reactToComment(commentUuid: string, reactionData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/comment/${commentUuid}/reactions`, reactionData);
  }
}
