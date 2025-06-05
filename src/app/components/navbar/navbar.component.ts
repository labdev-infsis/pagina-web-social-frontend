import { Component } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { PostService } from '../../posts/services/post.service';
import { Institution } from '../../posts/models/institution';
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
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(){
    this.authService.logout();
    window.location.reload();
  }

  createAccount(){}
}
