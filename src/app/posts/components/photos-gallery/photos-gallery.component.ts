import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-photos-gallery',
  templateUrl: './photos-gallery.component.html',
  styleUrl: './photos-gallery.component.scss'
})
export class PhotosGalleryComponent implements OnInit {

  post!: Institution;
  photos: any[] = [];

  constructor(private postService: PostService) {
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution: Institution) => {
        this.post = dataInstitution;
        this.loadPhotos(); // Llama a loadPhotos después de obtener la institución
      },
      error(error) {
        console.log(error);
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
          console.log('Photos loaded:', this.photos);
        },
        error: (error) => {
          console.error('Error loading photos', error);
        }
      });
    }
  }
}