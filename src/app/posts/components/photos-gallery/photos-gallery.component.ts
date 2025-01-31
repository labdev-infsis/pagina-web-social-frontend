import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-photos-gallery',
  templateUrl: './photos-gallery.component.html',
  styleUrls: ['./photos-gallery.component.scss']
})
export class PhotosGalleryComponent implements OnInit {

  post!: Institution;
  photos: any[] = [];
  isLoading: boolean = true;

  constructor(private postService: PostService) {
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution: Institution) => {
        this.post = dataInstitution;
        this.loadPhotos(); // Llama a loadPhotos después de obtener la institución
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {}

  loadPhotos() {
    if (this.post) {
      this.postService.getInstitutionPhotos(this.post.uuid).subscribe({
        next: (photos) => {
          this.photos = photos.map(photo => ({
            ...photo,
            url: `${photo.path}`
          }));
          this.isLoading = false;
          console.log('Photos loaded:', this.photos);
        },
        error: (error) => {
          console.error('Error loading photos', error);
          this.isLoading = false;
        }
      });
    }
  }
}