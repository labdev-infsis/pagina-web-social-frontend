import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentsComponent } from './posts/components/comments/comments.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PagesComponent } from './pages/pages.component';
import { NavbarPagesComponent } from './pages/navbar-pages/navbar-pages.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AgreementsComponent } from './pages/agreements/agreements.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ScholarshipsMobilityComponent } from './pages/scholarships-mobility/scholarships-mobility.component';
import { MembershipsComponent } from './pages/memberships/memberships.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CommentsModule } from "./comments/comments.module";
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavbarComponent,
    PagesComponent,
    NavbarPagesComponent,
    AboutUsComponent,
    AgreementsComponent,
    ProjectsComponent,
    ScholarshipsMobilityComponent,
    MembershipsComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    CommonModule,
    PostsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    PdfViewerModule,
    CommentsModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUser); // Agrega el icono faUser a la librería
  }
}
