import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Post } from '../../models/post';
import { User } from '../../../authentication/models/user';
import { UserDetail } from '../../models/user-detail';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrl: './view-all-posts.component.scss'
})
export class ViewAllPostsComponent {
  posts!: Post[];
  authenticated: boolean;
  currentUser!: UserDetail;
  

  constructor(private postService: PostService,
    private authService: AuthService
  ){
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit(){

    this.postService.getPosts().subscribe({
      next:(data: Post[]) => {
        this.posts = data.reverse();
      },
      error:(error) => {
        console.error('Error al obtener los posts', error);
      }
    });

    this.postService.getUser().subscribe({
      next:(user: UserDetail) => {
        this.currentUser = user;
        console.log('Obteniendo el usuario actual', this.currentUser);
      },
      error:(error) => {
        console.error('Error al obtener el usuario actual', error);
      }
    });
  }

  deletePost(postUuid: string) {
    this.postService.deletePost(postUuid).subscribe({
      next: (response) => {
        // Actualizar la lista localmente
        console.log('post eliminado',response);
        this.posts = this.posts.filter(post => post.uuid !== postUuid);
      },
      error: (error) => {
        console.log('Error al eliminar el post',error);
      }
    });
  }

  updatePost(postUpdated: Post){
    // Actualizar el post en la lista local
    this.posts = this.posts.map(post => 
      post.uuid === postUpdated.uuid ? postUpdated : post
    );
  }
}
