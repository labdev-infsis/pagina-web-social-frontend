import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent {
  institution: any;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    const uuid = "7887b1dc-f947-43c1-be80-1f8e939042e3";

    this.postService.getInstitution(uuid).subscribe(
      (data) => {
        this.institution = data;
      },
      (error) => {
        console.error('Error al obtener los datos de la institución', error);
      }
    );
  }
}
