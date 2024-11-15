import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrl: './view-all-posts.component.scss'
})
export class ViewAllPostsComponent {
  posts: any;
  images: any;

  constructor(private postService: PostService){}

  ngOnInit(){

    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;
        console.log(this.posts)
      },
      (error) => {
        console.error('Error al obtener los datos de los posts', error);
      }
    );
  }
}
