import { Component } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { PostService } from '../../posts/services/post.service';
import { Institution } from '../../posts/models/institution';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  authenticated: boolean
  institution!: Institution
  isMenuOpen = false;
  user: any

  constructor(private authService: AuthService,
    private postService: PostService
  ){
    this.authenticated = authService.isAuthenticated()
  }

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
    if(this.authenticated){
      this.postService.getUser().subscribe({
        next: (infoUser) => {
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
