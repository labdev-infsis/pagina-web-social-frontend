import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Media {
  number: number;
  type: string;
  name: string;
  path: string;
  fb_media_id: string | null;
}

interface Post {
  uuid: string;
  institution_id: string;
  user_id: string;
  comment_config_id: string;
  date: string;
  post_type: string;
  content: {
    text: string;
    media: Media[];
  };
  reactions: any;
  commentCounter: any;
  is_fb_posted: boolean | null;
  fb_post_enable: boolean | null;
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  post: Post | null = null;
  loading: boolean = true;
  error: string | null = null;
  private apiUrl = 'https://devpws.cs.umss.edu.bo/api/v1/posts';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');
      if (postId) {
        this.loadPost(postId);
      } else {
        this.error = 'ID de publicación no válido';
        this.loading = false;
      }
    });
  }

  loadPost(postId: string) {
    this.loading = true;
    this.error = null;

    this.http.get<Post>(`${this.apiUrl}/${postId}`)
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar la publicación';
          this.loading = false;
          console.error('Error:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (post) => {
          this.post = post;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        }
      });
  }
}
