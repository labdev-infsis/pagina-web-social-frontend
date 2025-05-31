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
  uuidIntitutionUUID = `${environment.INSTITUTION_ID}`;
  
  institution!: Institution
  totalFollowers!: number;

  constructor(private postService: PostService){
  }

  ngOnInit (){
    this.getInstitutionData(this.uuidIntitutionUUID);
    this.getNumberFollowers(this.uuidIntitutionUUID);
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
      next: (followers: Follower) => {
        this.totalFollowers = followers.total_followers;
      }, error(error) {
        console.log(error);
      }
    });
  }

}
