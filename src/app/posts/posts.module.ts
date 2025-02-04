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
import { ViewCommentsComponent } from './components/view-comments/view-comments.component';
import { OptionsPostComponent } from './components/options-post/options-post.component';
import { ModalDeletePostComponent } from './components/modal-delete-post/modal-delete-post.component';
import { ModalEditPostComponent } from './components/modal-edit-post/modal-edit-post.component';
import { EditTextComponent } from './components/modal-edit-post/edit-text/edit-text.component';
import { ImageVideoEditorComponent } from './components/modal-edit-post/image-video-editor/image-video-editor.component';
import { ModalListReactionsComponent } from './components/modal-list-reactions/modal-list-reactions.component';
import { ViewPostDetailComponent } from './components/view-post-detail/view-post-detail.component';


@NgModule({
  declarations: [
    ViewAllPostsComponent,
    DepartmentDetailsComponent,
    PostComponent,
    CreatePostComponent,
    CommentsComponent,
    ViewCommentsComponent,
    TextEditorComponent,
    ImagesUploaderComponent,
    DocumentUploaderComponent,
    OptionsPostComponent,
    ModalDeletePostComponent,
    ModalEditPostComponent,
    EditTextComponent,
    ImageVideoEditorComponent,
    ModalListReactionsComponent,
    ViewPostDetailComponent

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