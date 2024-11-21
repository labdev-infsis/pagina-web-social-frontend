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
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";

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
