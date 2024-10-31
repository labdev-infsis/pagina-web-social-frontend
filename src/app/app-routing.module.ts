import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { ViewAllPostsComponent } from './posts/components/view-all-posts/view-all-posts.component';

const routes: Routes = [
  { path: 'login', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'posts',
        component: ViewAllPostsComponent
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
