import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {

  @Input() post: any

  images: any

  ngOnInit(){
    this.images = /*this.loadImagesPost() ||*/ [
      "https://i.ibb.co/h1NjJnT/416112299-857056533095998-8086811567574606659-n.jpg",
      "https://scontent.fcbb2-1.fna.fbcdn.net/v/t39.30808-6/466794461_602156172372955_8710390740639705748_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FFVSTsDDQr8Q7kNvgHJgef9&_nc_zt=23&_nc_ht=scontent.fcbb2-1.fna&_nc_gid=ACLtY0jnupTIZ4BiOTQavRb&oh=00_AYBB8yrabmQX6q-ivkH69r9T26D1gs5rm8k7dZ5UcIOxVw&oe=673DE019",
      "https://scontent.fcbb2-1.fna.fbcdn.net/v/t39.30808-6/466566821_602155649039674_3672332109377650455_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WCC5ioCWARAQ7kNvgEwmUX6&_nc_zt=23&_nc_ht=scontent.fcbb2-1.fna&_nc_gid=Af-rJXsPnvHMxqqiCY_Z-kU&oh=00_AYA-5bGkjlkqNoKc5YCtmG8pndpvCKStCNOQ3Ofga5SN6Q&oe=673DE0B0",
      // "https://scontent.fcbb2-1.fna.fbcdn.net/v/t39.30808-6/466566821_602155649039674_3672332109377650455_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WCC5ioCWARAQ7kNvgEwmUX6&_nc_zt=23&_nc_ht=scontent.fcbb2-1.fna&_nc_gid=Af-rJXsPnvHMxqqiCY_Z-kU&oh=00_AYA-5bGkjlkqNoKc5YCtmG8pndpvCKStCNOQ3Ofga5SN6Q&oe=673DE0B0",
      // "https://scontent.fcbb2-2.fna.fbcdn.net/v/t39.30808-6/465988115_598082366113669_1732828327811749286_n.jpg?stp=dst-jpg_s720x720&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2NXvfAFRag8Q7kNvgFzwwSH&_nc_zt=23&_nc_ht=scontent.fcbb2-2.fna&_nc_gid=AaWiX7AlcxuPzlQ9btTVY8m&oh=00_AYCjOxAQC3OPCCXrto6vjCoCUQ16uW_jmqqbacwNVCWGcQ&oe=673DEF64"
    ];
  }

  getGridClass(images: any[]): string {
    if (images.length === 1) return 'single';
    if (images.length === 2) return 'two';
    if (images.length === 3) return 'three';
    if (images.length === 4) return 'four';
    return 'more';
  }

  loadImagesPost(){
    let imagesOfPost = []
    for (const image of this.post.content.media) {
      imagesOfPost.push(image.path)
      console.log(image.path)
    }
    return imagesOfPost
  }
}
