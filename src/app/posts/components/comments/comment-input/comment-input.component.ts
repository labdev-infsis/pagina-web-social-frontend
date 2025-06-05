import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent {
  @Input() currentUser: any;
  @Input() showInput: boolean = false;
  @Input() authenticated: boolean = false;
  @Input() newComment: string = '';
  @Input() isReply: boolean = false;
  @Input() replyText: string = '';

  @Output() toggleInput = new EventEmitter<void>();
  @Output() send = new EventEmitter<string>();
  

  inputText: string = '';

  sendInput() {
    if (this.inputText.trim()) {
      this.send.emit(this.inputText);
      this.inputText = '';
    }
  }
}