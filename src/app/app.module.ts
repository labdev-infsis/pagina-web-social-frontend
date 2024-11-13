import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from '@angular/common';
<<<<<<< Updated upstream
import { LoginComponent } from "./authentication/components/login/login.component";
import {  HttpClientModule } from '@angular/common/http';
=======
import { HttpClientModule } from '@angular/common/http';
>>>>>>> Stashed changes
import { NavbarComponent } from './components/navbar/navbar.component';

// Importaciones de Font Awesome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    CommonModule,
    PostsModule,
    HttpClientModule,
    FontAwesomeModule // Agrega FontAwesomeModule aquí
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUser); // Agrega el icono faUser a la librería
  }
}
