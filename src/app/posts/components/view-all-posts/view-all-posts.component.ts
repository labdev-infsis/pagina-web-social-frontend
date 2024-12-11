import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrl: './view-all-posts.component.scss'
})
export class ViewAllPostsComponent {
  posts: any;
  authenticated: boolean
  

  constructor(private postService: PostService,
    private authService: AuthService
  ){
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit(){

    this.postService.getPosts().subscribe({
      next:(data) => {
        this.posts = data.reverse();
      },
      error:(error) => {
        console.error('Error al obtener los posts', error);
      }
    });
  }
}
