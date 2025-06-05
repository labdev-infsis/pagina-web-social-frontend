import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../authentication/services/auth.service';
import { Observable } from 'rxjs';
import { UserDetail } from '../../posts/models/user-detail';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV}`;
  private readonly reqHeader = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.getToken() }) };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUser(): Observable<UserDetail> {
    const getUser = 'users/me';
    return this.http.get<UserDetail>(`${this.ROOT_URL}/${getUser}`, this.reqHeader);
  }
}
