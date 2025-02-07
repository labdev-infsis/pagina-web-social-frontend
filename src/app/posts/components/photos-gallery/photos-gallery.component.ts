import { Component, OnInit, Input, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Institution } from '../../models/institution';
import { Post } from '../../models/post';
import { PostComment } from '../../models/post-comment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentsComponent } from './../comments/comments.component';
import moment from 'moment';

@Component({
  selector: 'app-photos-gallery',
  templateUrl: './photos-gallery.component.html',
  styleUrls: ['./photos-gallery.component.scss']
})
export class PhotosGalleryComponent implements OnInit {
  private modalService = inject(NgbModal);
  @Input() post: any;
  @Input() institution!: Institution;
  photos: any[] = [];
  isLoading: boolean = true;
  currentPost !: Post;


  constructor(private postService: PostService) {

  }

  ngOnInit() {
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution: Institution) => {
        this.institution = dataInstitution;
        this.loadPhotos(); // Llama a loadPhotos después de obtener la institución

        console.log("Instituion: " + JSON.stringify(this.institution));
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  loadPhotos() {
    if (this.institution) {
      this.postService.getInstitutionPhotos(this.institution.uuid).subscribe({
        next: (photos) => {
          this.photos = photos.map(photo => ({
            ...photo,
            url: `${photo.path}`,
            postUuid: `${photo.uuid_post}`
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

  openViewPost(postUuid: string) {

    this.postService.getPost(postUuid).subscribe({
      next: (dataPost: Post) => {
        this.currentPost = dataPost;
        console.log("Post Gallery: "  + JSON.stringify(this.currentPost));
        this.openModal();
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });

  }

  openModal() {
    const modalRef = this.modalService.open(CommentsComponent, { size: 'xl' });
   
    console.log("Post Gallery Modal: "  + JSON.stringify(this.currentPost));
    console.log("Instituion Modal: " + JSON.stringify(this.institution));
    modalRef.componentInstance.institution = this.institution;
    modalRef.componentInstance.post = this.currentPost;
    modalRef.componentInstance.postUuid = this.currentPost.uuid;
    modalRef.componentInstance.postImages = this.currentPost.content.media;
    modalRef.componentInstance.postAuthor = this.institution.name;
    modalRef.componentInstance.postDate = this.calculateTimePost;
    modalRef.componentInstance.postDescription = this.currentPost.content.text;
  }

  getPost(postUuid: string) {
    this.postService.getPost(postUuid).subscribe({
      next: (dataPost: Post) => {
        this.currentPost = dataPost;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  calculateTimePost() {
    const postDate = new Date(this.currentPost.date)
    const currentDate = new Date(Date.now());
    const diferenciaMs: number = currentDate.getTime() - postDate.getTime(); // Diferencia en milisegundos
    const unMinuto = 60 * 1000;
    const unaHora = 60 * unMinuto;
    const unDia = 24 * unaHora;
    const sieteDias = 7 * unDia;

    if (diferenciaMs < unMinuto) {
      return 'Hace un momento';
    } else if (diferenciaMs < unaHora) {
      const minutos = Math.floor(diferenciaMs / unMinuto);
      return `Hace ${minutos} min`;
    } else if (diferenciaMs < unDia) {
      const horas = Math.floor(diferenciaMs / unaHora);
      return `Hace ${horas} h`;
    } else if (diferenciaMs < sieteDias) {
      const dias = Math.floor(diferenciaMs / unDia);
      return `Hace ${dias} d`;

    } else {
      const opciones: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return postDate.toLocaleDateString('es-ES', opciones);
    }
  }
}