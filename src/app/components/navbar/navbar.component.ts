import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { PostService } from '../../posts/services/post.service';
import { Institution } from '../../posts/models/institution';
import { CommentService } from '../../comments/services/comment.service';
import { Modal } from 'bootstrap';
import { environment } from '../../../environments/environment';
import { UserDetail } from '../../posts/models/user-detail';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  authenticated: boolean = false;
  institution!: Institution
  isMenuOpen = false;
  user: any
  counterModeratedComments: number = 0;

  @ViewChild('moderateCommentModal') modalElement!: ElementRef;

  constructor(private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ){
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit() {
    /*
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    this.postService.getInstitution(uuid).subscribe({

  user!: UserDetail;

  constructor(private authService: AuthService,
    private postService: PostService
  ){}
  
  ngOnInit(){
    this.authenticated = this.authService.isAuthenticated();
    const intitutionUUID = `${environment.INSTITUTION_ID}`;
    this.postService.getInstitution(intitutionUUID).subscribe({
      next:(institutionData)=>{
        this.institution = institutionData
      },
      error: (error)=>{
        console.log(error)
      }
    });
    if(this.authenticated){
      this.postService.getUser().subscribe({
        next: (infoUser: UserDetail) => {
          this.user = infoUser;
        },
        error: (error) => {
          console.log('Error al obtener al user',error)
        }
      })
    }
    */

    this.getInstitution();
    this.getUser();
    this.totalModeratedComments();
  }

  getInstitution() {
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    this.postService.getInstitution(uuid).subscribe({
      next: (institutionData) => {
        this.institution = institutionData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUser() {
    if (this.authenticated) {
      this.postService.getUser().subscribe({
        next: (infoUser) => {
          this.user = infoUser;
        },
        error: (error) => {
          console.log('Error al obtener al user', error);
        }
      })
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(){
    this.authService.logout();
    //window.location.reload();
  }

  createAccount(){}

  totalModeratedComments() {
    this.commentService.countModeratedComments().subscribe((total) => {
      console.log(total);
      this.counterModeratedComments = total;
    });
  }

  showModeratedComments() {
    const modal = new Modal(document.getElementById('moderateCommentModal')!);
    modal.show();
  }

}
