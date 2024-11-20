import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllPostsComponent } from './components/view-all-posts/view-all-posts.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { PostComponent } from './components/post/post.component';



@NgModule({
  declarations: [
    ViewAllPostsComponent,
    DepartmentDetailsComponent,
    PostComponent
  ],
  exports: [ViewAllPostsComponent],
  imports: [
    CommonModule
  ]
})
export class PostsModule { }
