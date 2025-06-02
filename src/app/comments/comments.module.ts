import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ModalListReactionsCommentsComponent } from './components/modal-list-reactions-comments/modal-list-reactions-comments.component';



@NgModule({
  declarations: [
    ReactionsComponent,
    ModalListReactionsCommentsComponent 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReactionsComponent
  ]
})
export class CommentsModule {}
