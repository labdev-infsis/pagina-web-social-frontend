import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:9090'; // URL base del backend
  private reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') }) };

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<any> {
    const urlInstitution = 'institution'
    return this.http.get<any>(`${this.baseUrl}/${urlInstitution}/${uuid}`, this.reqHeader);
  }

  // Método para obtener los posts
  getPosts(): Observable<any>{
    const urlPosts = 'post'
    return this.http.get<any>(`${this.baseUrl}/${urlPosts}`, this.reqHeader);
  }


}
