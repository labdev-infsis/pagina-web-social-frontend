import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionsComponent } from './components/reactions/reactions.component';
import { ModerateCommentsComponent } from './components/moderate-comments/moderate-comments.component';
import { ModalListReactionsCommentsComponent } from './components/modal-list-reactions-comments/modal-list-reactions-comments.component';

@NgModule({
  declarations: [
    ReactionsComponent, 
    ModerateCommentsComponent,
    ModalListReactionsCommentsComponent 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReactionsComponent, 
    ModerateCommentsComponent
  ]
})
export class CommentsModule {}
