import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.scss'
})
export class EditInfoComponent {

  @Input() contentEdited = '';
  @Input() typeText: 'title' | 'paragraph' = 'title';
  @Output() onSaveEdit = new EventEmitter<string>();
  @Output() onCancelEdit = new EventEmitter<void>();

  public saveEdit(): void {
    this.onSaveEdit.emit(this.contentEdited);
  }

  public cancelEdit(): void {
    this.onCancelEdit.emit();
  }
}
