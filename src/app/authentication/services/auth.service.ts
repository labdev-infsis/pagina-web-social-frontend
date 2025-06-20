import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { NewUser } from '../models/new-user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ROOT_URL = `${environment.BACK_END_HOST_DEV_AUTH}`;
  private readonly jwtHelper = new JwtHelperService();


  public token: any
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
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
    return this.http.post<{ message: string }>(this.ROOT_URL + '/register', newUser);
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

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;
    return this.jwtHelper.isTokenExpired(token);
  }

  // Clean local storage and redirect
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  // Method to check token periodically
  checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  startTokenExpirationTimer(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

    // Add null check here
    if (!expirationDate) {
      this.logout();
      return;
    }

    const expiresIn = expirationDate.getTime() - Date.now();

    // Set timeout slightly before actual expiration
    setTimeout(() => {
      this.logout();
    }, expiresIn - 5000); // 5 seconds before actual expiration
  }


}
