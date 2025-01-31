import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ViewAllPostsComponent } from './components/view-all-posts/view-all-posts.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { PostComponent } from './components/post/post.component';

import { CreatePostComponent } from './components/create-post/create-post.component';
import { ReactiveFormsModule } from '@angular/forms';

import { CommentsComponent } from './components/comments/comments.component';
import { ViewCommentsComponent } from './components/view-comments/view-comments.component';


@NgModule({
  declarations: [
    ViewAllPostsComponent,
    DepartmentDetailsComponent,
    PostComponent,
    CreatePostComponent,
    CommentsComponent,
    ViewCommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule // Agregar FormsModule aquí
  ],
  exports: [ViewAllPostsComponent]
})
export class PostsModule { }