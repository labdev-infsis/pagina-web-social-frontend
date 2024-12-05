import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ViewAllPostsComponent } from './components/view-all-posts/view-all-posts.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { PostComponent } from './components/post/post.component';
import { CommentsComponent } from './components/comments/comments.component';

@NgModule({
  declarations: [
    ViewAllPostsComponent,
    DepartmentDetailsComponent,
    PostComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule // Agregar FormsModule aquí
  ],
  exports: [ViewAllPostsComponent]
})
export class PostsModule { }