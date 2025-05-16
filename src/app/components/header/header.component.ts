import { Component } from '@angular/core';
import { Institution } from '../../posts/models/institution';
import { PostService } from '../../posts/services/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
  
  institution!: Institution
  totalFollowers!: number;

  constructor(private postService: PostService){
  }

  ngOnInit (){
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
      }, error(error) {
        console.log(error);
      }
    });
  }

}
