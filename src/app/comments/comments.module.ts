import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactionsComponent } from './components/reactions/reactions.component';



@NgModule({
  declarations: [
 
    ReactionsComponent 
  ],
  imports: [
    CommonModule
  ],
  exports: [
   
    ReactionsComponent
  ]
})
export class CommentsModule {}
