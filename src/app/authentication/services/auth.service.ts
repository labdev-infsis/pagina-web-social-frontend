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
          localStorage.setItem('refreshToken', user.refreshToken);

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
    const expired = currentDate > expireDate;
    console.log('[AuthService] tokenHasExpired:', expired, 'expireDate:', expireDate, 'currentDate:', currentDate);
    return expired;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[AuthService] isTokenExpired: true (no token)');
      return true;
    }
    const expired = this.jwtHelper.isTokenExpired(token);
    console.log('[AuthService] isTokenExpired:', expired, 'token:', token);
    return expired;
  }

  // Clean local storage and redirect
  // Logout usando refresh token
  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.ROOT_URL}/logout`, { refreshToken }).subscribe({
        next: () => {
          // Limpiar tokens y recargar/redirigir SOLO después de respuesta exitosa
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.reload();
        },
        error: (err) => {
          // Si el backend responde 400 (refresh token inválido/no existe), limpiar igual y recargar/redirigir
          if (err.status === 400 && (err.error?.exception === 'El token no existe en la base de datos.' || err.error?.exception === 'Refresh token is revoked or expired')) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.reload();
          } else {
            // Otros errores: limpiar y recargar/redirigir igual
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.reload();
          }
        }
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.reload();
    }
  }

  // Método para refrescar el access token
  refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('[AuthService] refreshAccessToken called. Refresh token**************************:', refreshToken);
        if (!refreshToken) return null;
        console.log('[AuthService] Llamando endpoint de refresh token...');
        return this.http.post<any>('http://localhost:9090/api/auth/refresh', {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });
  }

  // Method to check token periodically
  checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      // Solo eliminar el access token, NO el refresh token
      localStorage.removeItem('token');
      // El refresh token se conserva para intentar refrescar
      this.router.navigate(['/']);
    }
  }

  startTokenExpirationTimer(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

    // Add null check here
    if (!expirationDate) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      return;
    }

    const expiresIn = expirationDate.getTime() - Date.now();

    // Set timeout slightly before actual expiration
    setTimeout(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
      // El refresh token se conserva para intentar refrescar
    }, expiresIn - 5000); // 5 seconds before actual expiration
  }


}
