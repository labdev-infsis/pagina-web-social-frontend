import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../authentication/services/auth.service';
import { PostService } from '../../posts/services/post.service';
import { Institution } from '../../posts/models/institution';
import { CommentService } from '../../comments/services/comment.service';
import { Modal } from 'bootstrap';
import { environment } from '../../../environments/environment';
import { UserDetail } from '../../posts/models/user-detail';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  authenticated: boolean = false;
  institution!: Institution
  isMenuOpen = false;
  user: any
  counterModeratedComments: number = 0;

  private destroy$ = new Subject<void>();

  @ViewChild('moderateCommentModal') modalElement!: ElementRef;

  constructor(private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ) {
    this.authenticated = authService.isAuthenticated()
  }

  ngOnInit() {
    this.getInstitution();
    this.getUser();
    this.totalModeratedComments();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInstitution() {
    const uuid = "93j203b4-f63b-4c4a-be05-eae84cef0c0c";
    this.postService.getInstitution(uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
      this.postService.getUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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

  logout() {
    this.authService.logout();
    //window.location.reload();
  }

  createAccount() { }

  totalModeratedComments() {
    if (this.authenticated) {
      this.commentService.countModeratedComments()
        .pipe(takeUntil(this.destroy$))
        .subscribe((total) => {
          console.log(total);
          this.counterModeratedComments = total;
        });
    }
  }

  showModeratedComments() {
    const modal = new Modal(document.getElementById('moderateCommentModal')!);
    modal.show();
  }

}
