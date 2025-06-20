import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../models/article';
import { InformationService } from '../services/information.service';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.scss'
})
export class EditInfoComponent {

  @Input() contentEdited = '';
  @Input() typeText: 'title' | 'paragraph' = 'title';
  @Input() articleToEdit!: Article;
  @Output() onSaveSuccessfulEdit = new EventEmitter<boolean>();
  @Output() onCancelEdit = new EventEmitter<void>();

  constructor(
    private readonly informationService: InformationService,
  ){}

  public saveEdit(){
    const articleEdited: Omit<Article, 'uuid' | 'user_id'> = {
      section_id: this.articleToEdit.section_id,
      date: this.articleToEdit.date,
      title: this.typeText === 'title' ? this.contentEdited : this.articleToEdit.title,
      text: this.typeText === 'paragraph' ? this.contentEdited : this.articleToEdit.text,
      medias: this.articleToEdit.medias
    }
    
    this.informationService.updateArticle(this.articleToEdit.uuid, articleEdited).subscribe({
      next: (resArticleEdited: Article) => {
        console.log('articulo editado', resArticleEdited);
        if(this.typeText === 'title'){
          this.articleToEdit.title = this.contentEdited;
        }else{
          this.articleToEdit.text = this.contentEdited;
        }
        this.onSaveSuccessfulEdit.emit(true);
      },
      error: (err) => {
        console.log('Error al editar el artículo', err);
        this.onSaveSuccessfulEdit.emit(false);
      }
    })
  }

  public cancelEdit(): void {
    this.onCancelEdit.emit();
  }
}
