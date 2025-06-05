import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent {
  institution: any;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    const intitutionUUID = `${environment.INSTITUTION_ID}`;

    this.postService.getInstitution(intitutionUUID).subscribe(
      (data) => {
        this.institution = data;
      },
      (error) => {
        console.error('Error al obtener los datos de la institución', error);
      }
    );
  }
}
