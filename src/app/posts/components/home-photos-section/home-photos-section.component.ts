import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Institution } from '../../models/institution';

@Component({
  selector: 'home-photos-section',
  templateUrl: './home-photos-section.component.html',
  styleUrls: ['./home-photos-section.component.scss']
})
export class HomePhotosSectionComponent implements OnInit {

  @Input() institution!: Institution;
  photos: any[] = [];
  isLoading: boolean = true;

  constructor(private postService: PostService) {
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution: Institution) => {
        this.institution = dataInstitution;
        this.loadPhotos(); // Llama a loadPhotos después de obtener la institución
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  ngOnInit(){}

  loadPhotos() {
    if (this.institution) {
      this.postService.getInstitutionPhotos(this.institution.uuid).subscribe({
        next: (photos) => {
          this.photos = photos.slice(-9).map(photo => ({
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