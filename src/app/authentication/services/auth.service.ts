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
  
  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV_AUTH}`;

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

    return this.http.post<any>(this.ROOT_URL + '/login', user)
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
