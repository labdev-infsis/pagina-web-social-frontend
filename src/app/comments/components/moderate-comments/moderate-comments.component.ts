import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentService } from '../../../comments/services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-moderate-comments',
  templateUrl: './moderate-comments.component.html',
  styleUrl: './moderate-comments.component.scss'
})
export class ModerateCommentsComponent implements OnInit, OnDestroy {

  authenticated!: boolean;
  listComments: any = [];
  comment!: any;
  totalModeratedComments!: number;
  
  private destroy$ = new Subject<void>();

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.getAllCommentsToModerate();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllCommentsToModerate() {
    this.commentService.getCommentsToModerate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((comments) => {
        console.log(comments);
        this.listComments = comments;
      });
  }

  approveModeratedComment(commentUuid: string) {
    this.commentService.approveModeratedComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          console.log(comment);
          this.comment = comment;
          // Recargar lista después de aprobar
          this.getAllCommentsToModerate();
        }, 
        error: (error) => {
          console.log(error);
        }
      });
  }

  rejectModeratedComment(commentUuid: string) {
    this.commentService.rejectModerateComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comment) => {
        console.log(comment);
        this.comment = comment;
        // Recargar lista después de rechazar
        this.getAllCommentsToModerate();
      });
  }

  deleteModeratedComment(commentUuid: string) {
    this.commentService.deleteModerateComment(commentUuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comment) => {
        console.log(comment);
        this.comment = comment;
        // Recargar lista después de eliminar
        this.getAllCommentsToModerate();
      });
  }

  countModeratedComments() {
    this.commentService.countModeratedComments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalModeratedComments) => {
        console.log(`Total moderated comments: ${totalModeratedComments}`);
        this.totalModeratedComments = totalModeratedComments;
      });
  }

  onButtonApprovComment(event: any) {
    const isChecked = event.target.checked;
    const uuid = event.target.value;
    if (isChecked) {
      console.log(`ID ${uuid} is ${isChecked}`);
      this.approveModeratedComment(uuid);
    }
  }

  onButtonDeleteComment(uuid: string) {
    console.log(`Delete moderated comment: ${uuid}`);
    this.deleteModeratedComment(uuid);
  }

}
