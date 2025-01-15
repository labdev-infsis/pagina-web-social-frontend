import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewAllPostsComponent } from './components/view-all-posts/view-all-posts.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { PostComponent } from './components/post/post.component';

import { CreatePostComponent } from './components/create-post/create-post.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextEditorComponent } from './components/create-post/text-editor/text-editor.component';
import { ImagesUploaderComponent } from './components/create-post/images-videos-uploader/images-uploader.component';
import { DocumentUploaderComponent } from './components/create-post/document-uploader/document-uploader.component';

import { CommentsComponent } from './components/comments/comments.component';


@NgModule({
  declarations: [
    ViewAllPostsComponent,
    DepartmentDetailsComponent,
    PostComponent,
    CreatePostComponent,
    TextEditorComponent,
    ImagesUploaderComponent,
    DocumentUploaderComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ViewAllPostsComponent,
    PostComponent
  ]

})
export class PostsModule { }