import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserDatastoreService } from './services/user-datastore.service';
import { UserService } from './services/user.service';
import { JwtDecodeService } from './services/jwt-decode.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
		InputTextModule,
		ButtonModule,
    InputNumberModule,
  ],
  providers: [
    AuthGuardService,
    AuthService,
    JwtDecodeService,
    UserDatastoreService,    
    UserService
  ]
})
export class AuthenticationModule { }
