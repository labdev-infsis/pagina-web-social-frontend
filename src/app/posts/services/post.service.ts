import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}`;
  private reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer '+localStorage.getItem('token') }) };

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<any> {
    const urlInstitution = 'institution'
    return this.http.get<any>(`${this.ROOT_URL}/${urlInstitution}/${uuid}`);
  }

  // Método para obtener los posts
  getPosts(): Observable<any>{
    const urlPosts = 'post'
    return this.http.get<any>(`${this.ROOT_URL}/${urlPosts}`);
  }


}
