import { Component, HostListener, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Post } from '../../models/post';
import { UserDetail } from '../../models/user-detail';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrl: './view-all-posts.component.scss'
})
export class ViewAllPostsComponent implements OnInit {
  posts!: Post[];
  authenticated: boolean;
  currentUser!: UserDetail;
  selectedPostReactions: any = null;
  selectedPostUuid: string = '';
  loading = false;

  constructor(private postService: PostService,
    private authService: AuthService
  ){
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit(){
    // Obtener una cantidad de posts
    this.postService.getPagedPosts().subscribe({
      next:(data: Post[])=>{
        this.posts = data;
        this.postService.nextPage(); // Avanza a la siguiente página
      },
      error:(error) => {
        console.error('Error al obtener los posts paginados', error);
      }
    });

    if(this.authenticated) {
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
  }

  @HostListener('window:scroll', [])
  onScroll(): void {

    if ((window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight) {
      this.loadPosts(); // Cargar más posts al llegar al final
    }
  }

  loadPosts(): void {
    if (this.loading) return;
    this.loading = true;

    this.postService.getPagedPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = [...this.posts, ...data]; // Agrega nuevos posts a la lista
        this.postService.nextPage(); // Avanza a la siguiente página
        this.loading = false;
      },
      error: (error) => {
        console.log('Error al obtener los posts paginados', error)
      }
    });
  }

  deletePost(postUuid: string) {
    this.postService.deletePost(postUuid).subscribe({
      next: (response) => {
        // Actualizar la lista localmente
        console.log('post eliminado', response);
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

  updateReactions(postUuid: string) {
    this.postService.getPost(postUuid).subscribe({
      next: (post) => {
        const index = this.posts.findIndex(p => p.uuid === postUuid);
        if (index !== -1) {
          this.posts[index].reactions = post.reactions;
        }
      },
      error: (error) => {
        console.error('Error al actualizar las reacciones', error);
      }
    });
  }
}