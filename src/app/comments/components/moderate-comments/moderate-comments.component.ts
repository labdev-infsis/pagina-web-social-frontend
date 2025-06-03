import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommentService } from '../../../comments/services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';
import { Subscription } from 'rxjs';

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

  subscription!: Subscription;

  constructor(private commentService: CommentService, private authService: AuthService) {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.getAllCommentsToModerate();

    this.subscription = this.commentService.refreshUI$.subscribe(() => {
      this.getAllCommentsToModerate();
    });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  getAllCommentsToModerate() {
    this.commentService.getCommentsToModerate().subscribe((comments) => {
      this.listComments = comments;
    });
  }

  approveModeratedComment(commentUuid: string) {
    this.commentService.approveModeratedComment(commentUuid).subscribe({
      next: (comment) => {
        this.comment = comment;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  rejectModeratedComment(commentUuid: string) {
    this.commentService.rejectModerateComment(commentUuid).subscribe((comment) => {
      this.comment = comment;
    });
  }

  deleteModeratedComment(commentUuid: string) {
    this.commentService.deleteModerateComment(commentUuid).subscribe((comment) => {
      this.comment = comment;
    });
  }

  countModeratedComments() {
    this.commentService.countModeratedComments().subscribe((totalModeratedComments) => {
      this.totalModeratedComments = totalModeratedComments;
    });
  }

  onButtonApprovComment(event: any) {
    const isChecked = event.target.checked;
    const commentUuid = event.target.value;
    if (isChecked) {
      this.approveModeratedComment(commentUuid);
    }
  }

  onButtonDeleteComment(commentUuid: string) {
    this.deleteModeratedComment(commentUuid);
  }

}
