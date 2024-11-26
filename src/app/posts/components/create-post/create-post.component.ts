import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  institution: any;

  constructor(private postService: PostService){}

  ngOnInit(){
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    this.postService.getInstitution(uuid).subscribe({
      next:(institutionData)=>{
        this.institution = institutionData
      },
      error: (error)=>{
        console.log(error)
      }
    });
  }

  openModalCreatePost(){
    const modalElement = document.getElementById('modalCreatePost');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
