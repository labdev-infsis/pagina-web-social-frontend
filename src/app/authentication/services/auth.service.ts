import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtDecodeService } from './jwt-decode.service';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { NewUser } from '../models/new-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV_AUTH}`;

  public token : any
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtDecodeService: JwtDecodeService
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

  register(newUser: NewUser) {
    return this.http.post<{ message: string}>(this.ROOT_URL + '/register', newUser);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getUserId() {
    const token = this.getToken();
    
    if (!token) {
        console.warn("⚠️ No hay token en localStorage.");
        return null;
    }

    try {
        // 🔥 Decodificar el token para extraer el userId
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId ?? null;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}


  getAdvisorId(){
    return localStorage.getItem('advisorId');
  }

  getRoles() {
    let roles = localStorage.getItem('roles');
    if (roles) {
      return roles.split(',');
    }
    else {
      return [];
    }
  }

  tokenHasExpired() {
    let convertDate = parseInt(localStorage.getItem('expires') ?? '') * 1000;
    let expireDate = new Date(convertDate);
    let currentDate = new Date();

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
