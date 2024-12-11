import { Component, Input } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post: any;
  institution: any;
  images: any;
  showComments: boolean = false; // Controla la visibilidad del popup

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.images = this.loadImagesPost();
    this.postService.getInstitution(this.post.institution_id).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // Mostrar el popup de comentarios
  openComments() {
    this.showComments = true;
  }

  // Cerrar el popup de comentarios
  closeComments() {
    this.showComments = false;
  }

  

  getGridClass(images: any[]): string {
    if (images.length === 1) return 'single';
    if (images.length === 2) return 'two';
    if (images.length === 3) return 'three';
    if (images.length === 4) return 'four';
    return 'more';
  }

  loadImagesPost() {
    let imagesOfPost = [];
    for (const image of this.post.content.media) {
      imagesOfPost.push(image.path);
    }
    return imagesOfPost;
  }

  calculateTimePost() {
    const postDate = new Date(this.post.date);
    const currentDate = new Date();
    const diferenciaMs: number = currentDate.getTime() - postDate.getTime();
    const unMinuto = 60 * 1000;
    const unaHora = 60 * unMinuto;
    const unDia = 24 * unaHora;
    const sieteDias = 7 * unDia;

    if (diferenciaMs < unMinuto) {
      return 'Hace un momento';
    } else if (diferenciaMs < unaHora) {
      const minutos = Math.floor(diferenciaMs / unMinuto);
      return `${minutos} min`;
    } else if (diferenciaMs < unDia) {
      const horas = Math.floor(diferenciaMs / unaHora);
      return `${horas} h`;
    } else if (diferenciaMs < sieteDias) {
      const dias = Math.floor(diferenciaMs / unDia);
      return `${dias} d`;
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