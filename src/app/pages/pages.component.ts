import { Component, OnInit } from '@angular/core';
import { Institution } from '../posts/models/institution';
import { environment } from '../../environments/environment';
import { PostService } from '../posts/services/post.service';
import { InstitutionStateService } from '../services/institution-state.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {

  private readonly institutionID = `${environment.INSTITUTION_ID}`;

  constructor(
    private readonly postService: PostService,
    private readonly institutionStateService: InstitutionStateService
  ){}

  ngOnInit(): void {
    this.postService.getInstitution(this.institutionID).subscribe({
      next: (insititutionResponse: Institution) => {
        this.institutionStateService.setInstitution(insititutionResponse);
      },
      error: (err) => {
        console.log('Error al obtener institucion para informacion', err);
        this.institutionStateService.setInstitution(null);
      }
    });
  }
}
