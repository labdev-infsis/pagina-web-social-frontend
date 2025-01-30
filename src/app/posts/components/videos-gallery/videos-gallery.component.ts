import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-videos-gallery',
  templateUrl: './videos-gallery.component.html',
  styleUrls: ['./videos-gallery.component.scss']
})
export class VideosGalleryComponent implements OnInit {
  post!: Institution;
  videos: any[] = [];
  isLoading: boolean = true;

  constructor(private postService: PostService) {
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution: Institution) => {
        this.post = dataInstitution;
        this.loadVideos(); // Llama a loadVideos después de obtener la institución
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {}

  loadVideos() {
    if (this.post) {
      this.postService.getInstitutionVideos(this.post.uuid).subscribe({
        next: (videos) => {
          this.videos = videos.map(video => ({
            ...video,
            url: `${video.path}`
          }));
          this.isLoading = false;
          console.log('Videos loaded:', this.videos);
        },
        error: (error) => {
          console.error('Error loading videos', error);
          this.isLoading = false;
        }
      });
    }
  }
}