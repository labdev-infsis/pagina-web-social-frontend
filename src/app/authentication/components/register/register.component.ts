import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public hide = true;
  public inputType: string = 'password';
  public passwordMismatch: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Detecta cuando las contraseñas no coinciden
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.passwordMismatch = this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value;
    });
  }

  register() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.authService.register(formData.email, formData.password).subscribe(
        (response) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched;
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  resetForm() {
    this.registerForm.reset();
    this.passwordMismatch = false;
  }
}
