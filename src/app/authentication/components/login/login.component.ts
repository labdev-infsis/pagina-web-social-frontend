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
  public inputType: string = 'password';
  public errorMessage!: string;
  @ViewChild('userFocus', { static: true })
  usernameField!: ElementRef;
  correctCredentials: boolean = true;
  public isLoggedIn = false;

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
      username: ['valentin.laime@umss.edu.bo', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['Control456', [Validators.required, Validators.maxLength(100)]]
    });
  }

  login() {
    this.loginForm.markAllAsTouched();
    let dataValid = this.loginForm.valid
    if(dataValid){
      let login = this.loginForm.value;

      this.auth.login(login.username, login.password).subscribe({
        next: () => {
          this.isLoggedIn = true;
          this.router.navigate(['/']);
          window.location.reload()
        },
        error: (error: any) => {
          console.log('se imprime esto',error)
          this.correctCredentials = false;
        }
      });
    }

  }

  hasErrors(controlName:string, errorType: string){
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched;
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  loginReset(){
    this.loginForm.reset()
    this.correctCredentials = true
  }

}
