import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm!: FormGroup;
  public errorMessage!: string;
  public user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.userService.findById(parseInt(this.authService.getUserId()??'')).subscribe(user => {
      this.user = user;
    });
  }

  private buildForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  changePassword() {
    var credentials = this.changePasswordForm.value;

    this.userService.changePassword(this.user, credentials).subscribe(success => {
      setTimeout(() => { this.authService.logout(); }, 2000);
    }, error => {
      this.errorMessage = error.error.errors ? this.showError(error.error.errors) : error.error.error.message;
    });
  }

  showError(error: any) {
    if (error.ConfirmPassword) {
      return error.ConfirmPassword[0];
    }
    if (error.Password) {
      return error.Password[0];
    }
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get password() {
    return this.changePasswordForm.get('password');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }
}
