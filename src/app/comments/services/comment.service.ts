import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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
    const token = localStorage.getItem('token'); // 🔥 Obtener el token desde localStorage

    if (!token) {
      console.error("🚨 No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 🔥 Enviar el token en la cabecera
    });

    return this.http.post<any>(
      `${this.BASE_URL}/comment/${commentUuid}/reactions`, // 🔥 Usa BASE_URL correctamente
      reactionData,
      { headers }
    );
    
  }
}