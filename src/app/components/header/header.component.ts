import { Component } from '@angular/core';
import { Institution } from '../../posts/models/institution';
import { PostService } from '../../posts/services/post.service';
import { Follower } from '../../posts/models/follower';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  uuidIntitutionDric = `${environment.INSTITUTION_ID}`;

  
  institution!: Institution
  totalFollowers!: number;

  constructor(private postService: PostService){
  }

  ngOnInit() {
    this.getInstitutionData(this.uuidIntitutionDric);
    this.getNumberFollowers(this.uuidIntitutionDric);
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
      //next: (followers: Follower) => {
       // this.totalFollowers = followers.total_followers;
      }, error(error) {
        console.log(error);
      }
    });
  }

}
