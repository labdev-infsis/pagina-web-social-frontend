import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() post: any

  images: any

  ngOnInit(){
    this.images = this.loadImagesPost()
  }

  getGridClass(images: any[]): string {
    if (images.length === 1) return 'single';
    if (images.length === 2) return 'two';
    if (images.length === 3) return 'three';
    if (images.length === 4) return 'four';
    return 'more';
  }

  loadImagesPost(){
    let imagesOfPost = []
    for (const image of this.post.content.media) {
      imagesOfPost.push(image.path)
    }
    return imagesOfPost
  }
}
