import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:9090/institution'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de una institución
  getInstitution(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${uuid}`);
  }
}
