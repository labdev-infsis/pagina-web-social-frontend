import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserDatastoreService } from './services/user-datastore.service';
import { UserService } from './services/user.service';
import { JwtDecodeService } from './services/jwt-decode.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { RegisterComponent } from './components/register/register.component';
@NgModule({
  declarations: [LoginComponent, ChangePasswordComponent, CreateAccountComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [LoginComponent, CreateAccountComponent, RegisterComponent],
  providers: [
    AuthGuardService,
    AuthService,
    JwtDecodeService,
    UserDatastoreService,
    UserService
  ]
})
export class AuthenticationModule { }
