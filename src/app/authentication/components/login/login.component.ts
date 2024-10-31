import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hide = true;
  public errorMessage!: string;
  @ViewChild('userFocus', { static: true })
  usernameField!: ElementRef;
  showAlert: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  login() {
    var login = this.loginForm.value;

    this.auth.login(login.username, login.password).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error: any) => {
        alert(error.error.error.message)
      }
    );
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

}
