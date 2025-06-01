import { Component } from '@angular/core';
import { Institution } from '../../posts/models/institution';
import { PostService } from '../../posts/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
  
  institution!: Institution
  totalFollowers: number = 127;

  isPostsRoute = false;

  constructor(private postService: PostService, private router: Router){
  }

  ngOnInit (){
    this.getInstitutionData(this.uuidIntitutionDric);
    this.getNumberFollowers(this.uuidIntitutionDric);
    this.router.events.subscribe(() => {
      this.isPostsRoute = this.router.url === '/posts';
    });
  }

  getInstitutionData(uuid: string) {
    this.postService.getInstitution(uuid).subscribe({
      next: (dataInstitution:Institution) => {
        this.institution = dataInstitution;
      },
      error(error){
        console.log(error)
      }
    })
  }

  getNumberFollowers(uuid: string) {
    this.postService.getNumberFollowers(uuid).subscribe({
      next: (numberFollowers: number) => {
        this.totalFollowers = numberFollowers;
      }, error(error) {
        console.log(error);
      }
    });
  }

  reloadPosts() {
  this.router.navigate(['/posts']).then(() => {
    window.location.reload();
  });
}
}
