import { Component, HostListener } from '@angular/core';
import { Post } from '../../models/post';
import { UserDetail } from '../../models/user-detail';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-view-all-posts-proyectos',
  templateUrl: './view-all-posts-proyectos.component.html',
  styleUrl: './view-all-posts-proyectos.component.scss'
})
export class ViewAllPostsProyectosComponent {
  authenticated: boolean = false;
      posts: Post[] = [];
      currentUser!: UserDetail;
      selectedPostReactions: any = null;
      selectedPostUuid: string = '';
      loading = false;
      pageCounter = 0;
    
      constructor(private postService: PostService,
        private authService: AuthService
      ){
      }
      
      ngOnInit(){
        this.authenticated = this.authService.isAuthenticated();
        // Obtener una cantidad de posts
        this.postService.getPostsByType('PROYECTOS').subscribe({
          next:(data: Post[])=>{
            this.posts = data;
            //this.postService.getPagedPosts(this.pageCounter++); // Avanza a la siguiente página
          },
          error:(error) => {
            console.error('Error al obtener los posts paginados', error);
          }
        });
        if(this.authenticated === true) {
          this.postService.getUser().subscribe({
            next:(user: UserDetail) => {
              this.currentUser = user;
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
          //this.loadPosts(); // Cargar más posts al llegar al final
        }
      }
    
      loadPosts(): void {
        if (this.loading) return;
        this.loading = true;
    
        this.postService.getPostsByType('PROYECTOS').subscribe({
          next: (data: Post[]) => {
            this.posts = [...this.posts, ...data].reverse(); 
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
