import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactionsComponent } from './components/reactions/reactions.component';
import { ModerateCommentsComponent } from './components/moderate-comments/moderate-comments.component';

@NgModule({
  declarations: [
    ReactionsComponent, ModerateCommentsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReactionsComponent, ModerateCommentsComponent
  ]
})
export class CommentsModule {}
