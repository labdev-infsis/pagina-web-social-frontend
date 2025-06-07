import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../comments/services/comment.service';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-moderate-comments',
  templateUrl: './moderate-comments.component.html',
  styleUrl: './moderate-comments.component.scss'
})
export class ModerateCommentsComponent implements OnInit {

  authenticated!: boolean;
  listComments: any = [];
  comment!: any;
  totalModeratedComments!: number;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.getAllCommentsToModerate();
  }

  getAllCommentsToModerate() {
    this.commentService.getCommentsToModerate().subscribe((comments) => {
      console.log(comments);
      this.listComments = comments;
    });
  }

  approveModeratedComment(commentUuid: string) {
    /*
    this.commentService.approveModeratedComment(commentUuid).subscribe((comment) => {
      console.log(comment);
      this.comment = comment;
    });
    */
    this.commentService.approveModeratedComment(commentUuid).subscribe({
      next: (comment) => {
        console.log(comment);
        this.comment = comment;
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  rejectModeratedComment(commentUuid: string) {
    this.commentService.rejectModerateComment(commentUuid).subscribe((comment) => {
      console.log(comment);
      this.comment = comment;
    });
  }

  deleteModeratedComment(commentUuid: string) {
    this.commentService.deleteModerateComment(commentUuid).subscribe((comment) => {
      console.log(comment);
      this.comment = comment;
    });
  }

  countModeratedComments() {
    this.commentService.countModeratedComments().subscribe((totalModeratedComments) => {
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
