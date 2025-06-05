import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Comment } from '../../posts/models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  private readonly BASE_URL = `${environment.BACK_END_HOST_DEV}`;


  constructor(private http: HttpClient) {
  }

  getComments(postUuid: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.BASE_URL}/post/${postUuid}/comments`
    );
  }

  addComment(postUuid: string, commentData: any): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_URL}/post/${postUuid}/comments`,
      commentData
    );
  }

  // Obtener todos los mensajes para ser moderados
  getCommentsToModerate(): Observable<Comment[]> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<Comment[]>(`${this.BASE_URL}/comments/moderated`, { headers });
  }

  // Aprobar un comentario moderado
  approveModeratedComment(commentUuid: string): Observable<Comment>{
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Comment>(`${this.BASE_URL}/comments/moderated`, commentUuid, { headers });
  }

  // Rechazar un comentario moderado
  rejectModerateComment(commentUuid: string): Observable<Comment> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Comment>(`${this.BASE_URL}/comments/reject`, commentUuid, { headers });
  }

  // Eliminar un comentario moderado
  deleteModerateComment(commentUuid: string): Observable<Comment> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Comment>(`${this.BASE_URL}/comments/delete`, commentUuid, { headers });
  }

  // Obtener cantidad de commentarios para moderar
  countModeratedComments(): Observable<number> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<number>(`${this.BASE_URL}/comments/count-moderated`, { headers });
  }

  // Reaccionar a un comentario

  reactToComment(commentUuid: string, reactionData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No autorizado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${this.BASE_URL}/comment/${commentUuid}/reactions`,
      reactionData,
      { headers }
    );
  }

  updateReaction(reactionUuid: string, reactionData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No autorizado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(
      `${this.BASE_URL}/reactions/${reactionUuid}`,
      reactionData,
      { headers }
    );
  }

  getCommentReactions(commentUuid: string) {
    return this.http.get<any[]>(
      `${this.BASE_URL}/comment/${commentUuid}/reactions`
    );
  }

  // 🔁 Reacciones a respuestas (replies)
  reactToReply(replyUuid: string, reactionData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return throwError(() => new Error('No autorizado'));

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${this.BASE_URL}/reply-reactions/${replyUuid}`,
      reactionData,
      { headers }
    );
  }

  updateReplyReaction(
    reactionUuid: string,
    reactionData: any
  ): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return throwError(() => new Error('No autorizado'));

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(
      `${this.BASE_URL}/reply-reactions/${reactionUuid}`,
      reactionData,
      { headers }
    );
  }

  getReplyReactions(replyUuid: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.BASE_URL}/reply-reactions/${replyUuid}`
    );
  }
}
