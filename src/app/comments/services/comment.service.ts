import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private BASE_URL = 'http://localhost:9090/api/v1';

  constructor(private http: HttpClient) {}

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
}
