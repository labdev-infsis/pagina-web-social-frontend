import { Component, Input } from '@angular/core';
import { Reactions } from '../../models/reactions';
import { PostService } from '../../services/post.service';
import { EmojiType } from '../../models/emoji-type';

@Component({
  selector: 'app-modal-list-reactions',
  templateUrl: './modal-list-reactions.component.html',
  styleUrl: './modal-list-reactions.component.scss'
})
export class ModalListReactionsComponent {
  @Input() reactions!: Reactions;
  listEmojiType!: EmojiType[];

  constructor(private postService: PostService) { }

  ngOnInit(){
    //Obtener los tipos de emoji
    this.postService.getEmojisType().subscribe({
      next: (response: EmojiType[]) => {
        this.listEmojiType = response;
      },
      error: (error) => {
        console.log('Error al obtener los tipos de emojis', error);
      }
    })
  }

  getReactionType(typeReactionUser: string){
    return this.listEmojiType.find((typeEmoji) => typeEmoji.emoji_name === typeReactionUser)?.emoji_code;

  }
}
