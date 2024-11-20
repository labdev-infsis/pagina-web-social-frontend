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

  login(username: string, password: string) {
    let user = {
      email: username,
      password
    }

    const reqHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post<any>('http://localhost:9090/api/auth/' + 'login', user, reqHeader)
      .pipe(
        map(user => {
          this.token = user.accessToken;
          localStorage.setItem('token', this.token);

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
