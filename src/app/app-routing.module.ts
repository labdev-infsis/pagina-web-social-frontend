import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { ViewAllPostsComponent } from './posts/components/view-all-posts/view-all-posts.component';
import { PhotosGalleryComponent } from './posts/components/photos-gallery/photos-gallery.component';
import { VideosGalleryComponent } from './posts/components/videos-gallery/videos-gallery.component';
import { PagesComponent } from './pages/pages.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AgreementsComponent } from './pages/agreements/agreements.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ScholarshipsMobilityComponent } from './pages/scholarships-mobility/scholarships-mobility.component';
import { MembershipsComponent } from './pages/memberships/memberships.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { authGuard } from './authentication/services/auth.guard';
import { ViewAllPostsConveniosComponent } from './posts/components/view-all-posts-convenios/view-all-posts-convenios.component';
import { ViewAllPostsProyectosComponent } from './posts/components/view-all-posts-proyectos/view-all-posts-proyectos.component';
import { ViewAllPostsBecasComponent } from './posts/components/view-all-posts-becas/view-all-posts-becas.component';
import { ViewAllPostsCudieComponent } from './posts/components/view-all-posts-cudie/view-all-posts-cudie.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, 
    children: [
      { path: '', redirectTo: '/posts', pathMatch: 'full'},
      {
        path: 'posts',
        component: ViewAllPostsComponent,
        //canActivate: [authGuard]  
      },
      { path: 'informacion',
        component: PagesComponent,
        //canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'presentacion', pathMatch: 'full' },
          { path: 'presentacion', component: AboutUsComponent },
          { path: 'convenios', component: AgreementsComponent },
          { path: 'proyectos', component: ProjectsComponent },
          { path: 'becas-movilidad', component: ScholarshipsMobilityComponent },
          { path: 'membresias', component: MembershipsComponent },
          { path: 'informes-gestion', component: ReportsComponent },
          { path: '**', redirectTo: 'presentacion', pathMatch: 'full' }
        ]
      },
      { path: 'informacion',
        component: PagesComponent,
        children: [
          { path: '', redirectTo: 'presentacion', pathMatch: 'full' },
          { path: 'presentacion', component: AboutUsComponent },
          { path: 'convenios', component: AgreementsComponent },
          { path: 'proyectos', component: ProjectsComponent },
          { path: 'becas-movilidad', component: ScholarshipsMobilityComponent },
          { path: 'membresias', component: MembershipsComponent },
          { path: 'informes-gestion', component: ReportsComponent },
          { path: '**', redirectTo: 'presentacion', pathMatch: 'full' }
        ]
      },
      { path: 'fotos', 
        component: PhotosGalleryComponent
      },
      { path: 'videos', 
        component: VideosGalleryComponent
      },
      { path: 'convenios', 
        component: ViewAllPostsConveniosComponent
      },
      { path: 'proyectos', 
        component: ViewAllPostsProyectosComponent
      },
      { path: 'becas', 
        component: ViewAllPostsBecasComponent
      },
      { path: 'cudie', 
        component: ViewAllPostsCudieComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
