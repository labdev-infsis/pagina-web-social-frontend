import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../models/post';

@Component({
  selector: 'app-modal-delete-post',
  templateUrl: './modal-delete-post.component.html',
  styleUrl: './modal-delete-post.component.scss'
})
export class ModalDeletePostComponent {
  @Output() confirmDeletePost = new EventEmitter<boolean>();
  @Input() postReference!: string;

  constructor() {}

  deletePost() {
    this.confirmDeletePost.emit(true);
  }
}
