import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.auth.getToken();
        if (authToken != null) {
            if (this.auth.tokenHasExpired()) {
                this.auth.logout();

                return next.handle(req);
            }

            const authReq = req.clone({ setHeaders: { Authorization: `bearer ${authToken}` } });

            return next.handle(authReq);
        } else {
            return next.handle(req);
        }
    }
}