import { Component } from '@angular/core';
import { Institution } from '../../posts/models/institution';
import { PostService } from '../../posts/services/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  institution!: Institution

  constructor(private postService: PostService){
    const uuidIntitutionDric = '93j203b4-f63b-4c4a-be05-eae84cef0c0c';
    this.postService.getInstitution(uuidIntitutionDric).subscribe({
      next: (dataInstitution:Institution) => {
        this.institution = dataInstitution;
      },
      error(error){
        console.log(error)
      }
    })
  }

  ngOnInit(){
    
  }
}
