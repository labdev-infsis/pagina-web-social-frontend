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
import { DocumentEditorComponent } from './components/modal-edit-post/document-editor/document-editor.component';
import { ViewPostDetailComponent } from './components/view-post-detail/view-post-detail.component';
import { PhotosGalleryComponent } from './components/photos-gallery/photos-gallery.component';
import { VideosGalleryComponent } from './components/videos-gallery/videos-gallery.component';
import { HomePhotosSectionComponent} from './components/home-photos-section/home-photos-section.component';
import { CommentsModule } from '../comments/comments.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PopupInfoUserComponent } from './components/popup-info-user/popup-info-user.component';
import { CommentListComponent } from './components/comments/comment-list/comment-list.component';
import { CommentItemComponent } from './components/comments/comment-item/comment-item.component';
import { ReplyListComponent } from './components/comments/reply-list/reply-list.component';
import { ReplyItemComponent } from './components/comments/reply-item/reply-item.component';
import { CommentInputComponent } from './components/comments/comment-input/comment-input.component';
import { ModalListReactionsRepliesComponent } from './components/comments/modal-list-reactions-replies/modal-list-reactions-replies.component';
import { ViewAllPostsConveniosComponent } from './components/view-all-posts-convenios/view-all-posts-convenios.component';
import { ViewAllPostsProyectosComponent } from './components/view-all-posts-proyectos/view-all-posts-proyectos.component';
import { ViewAllPostsBecasComponent } from './components/view-all-posts-becas/view-all-posts-becas.component';
import { ViewAllPostsCudieComponent } from './components/view-all-posts-cudie/view-all-posts-cudie.component';
import { PageComponent } from './components/post-page/page/page.component';

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
    DocumentEditorComponent,
    ViewPostDetailComponent,
    PhotosGalleryComponent,
    VideosGalleryComponent,
    HomePhotosSectionComponent,
    PopupInfoUserComponent,
    CommentListComponent,
    CommentItemComponent,
    ReplyListComponent,
    ReplyItemComponent,
    CommentInputComponent,
    ModalListReactionsRepliesComponent,
    ViewAllPostsConveniosComponent,
    ViewAllPostsProyectosComponent,
    ViewAllPostsBecasComponent,
    ViewAllPostsCudieComponent,
    PageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommentsModule,
    NgbCarouselModule,
    PdfViewerModule,
    OverlayPanelModule,
  ],
  exports: [
    ViewAllPostsComponent,
    PostComponent
  ]

})
export class PostsModule { }