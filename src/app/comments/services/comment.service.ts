import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, Subject, tap, throwError } from 'rxjs';
import { Comment } from '../../posts/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly BASE_URL = `${environment.BACK_END_HOST_DEV}`;
  private refreshView$ = new Subject<void>();
  
  constructor(private http: HttpClient) {
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return headers;
  }

  get refreshUI$() {
    return this.refreshView$;
  }

  getComments(postUuid: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.BASE_URL}/post/${postUuid}/comments`);
  }

  addComment(postUuid: string, commentData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/post/${postUuid}/comments`, commentData);
  }

  getCommentsToModerate(): Observable<Comment[]> {
    const headers = this.getHeaders();
    return this.http.get<Comment[]>(`${this.BASE_URL}/comments/moderated`, { headers: headers });
  }

  approveModeratedComment(commentUuid: string): Observable<Comment> {
    const headers = this.getHeaders();
    let body = { uuid: `${commentUuid}` };
    let bodyJson = JSON.stringify(body);
    return this.http.put<Comment>(`${this.BASE_URL}/comments/approve`, bodyJson, { headers: headers })
      .pipe(
        tap(() => {
          this.refreshView$.next();
        })
      );
  }

  rejectModerateComment(commentUuid: string): Observable<Comment> {
    const headers = this.getHeaders();
    let body = { uuid: `${commentUuid}` };
    let bodyJson = JSON.stringify(body);
    return this.http.put<Comment>(`${this.BASE_URL}/comments/reject`, bodyJson, { headers: headers });
  }

  deleteModerateComment(commentUuid: string): Observable<Comment> {
    const headers = this.getHeaders();
    let body = { uuid: `${commentUuid}` };
    let bodyJson = JSON.stringify(body);
    return this.http.put<Comment>(`${this.BASE_URL}/comments/delete`, bodyJson, { headers: headers })
      .pipe(
        tap(() => {
          this.refreshView$.next();
        })
      );
  }

  countModeratedComments(): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<number>(`${this.BASE_URL}/comments/count-moderated`, { headers: headers })
      .pipe(
        tap(() => {
          this.refreshView$.next();
        })
      );
  }

  reactToComment(commentUuid: string, reactionData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("🚨 No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
      console.error("🚨 No hay token de autenticación");
      return throwError(() => new Error("No autorizado"));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(
      `${this.BASE_URL}/reactions/${reactionUuid}`,
      reactionData,
      { headers }
    );
  }

  getCommentReactions(commentUuid: string) {
    return this.http.get<any[]>(`${this.BASE_URL}/comment/${commentUuid}/reactions`);
  }

}