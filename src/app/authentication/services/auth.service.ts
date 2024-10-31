import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';
import { JwtDecodeService } from './jwt-decode.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token : any
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtDecodeService: JwtDecodeService
  ) {
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    return token != null;
  }

  login(phone: number, password: string) {
    var user = new User();

    //@ts-ignore
    user.id = 0;
    user.phone = phone;
    user.password = password;
    user.password_confirmation = password;

    const reqHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post<any>(environment.BACK_END_HOST + 'login', user, reqHeader)
      .pipe(
        map(user => {
          this.token = this.jwtDecodeService.decodeToken(user.access_token);
          localStorage.setItem('token', user.access_token);

          return true;
        })
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getAdvisorId(){
    return localStorage.getItem('advisorId');
  }

  getRoles() {
    var roles = localStorage.getItem('roles');
    if (roles) {
      return roles.split(',');
    }
    else {
      return [];
    }
  }

  tokenHasExpired() {
    var convertDate = parseInt(localStorage.getItem('expires') || '') * 1000;
    var expireDate = new Date(convertDate);
    var currentDate = new Date();

    return currentDate > expireDate;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userid');
    localStorage.removeItem('expires');
    localStorage.removeItem('doctorId');
    this.router.navigate(['/login']);
  }
}
