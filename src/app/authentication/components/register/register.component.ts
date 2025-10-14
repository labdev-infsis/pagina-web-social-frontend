import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NewUser } from '../../models/new-user';
import { MessageService } from 'primeng/api';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public hide = true;
  public confirmHide = true;
  public inputType: string = 'password';
  public confirmInputType: string = 'password';
  public passwordMismatch: boolean = false;
  public isRegistering: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
      return lettersRegex.test(control.value) ? null : { 'onlyLetters': true };
    };
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;
      if (value.length < 8 || value.length > 20) {
        return { 'passwordLength': true };
      }
      return null;
    };
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), this.onlyLettersValidator()]],
      lastName: ['', [Validators.required, Validators.minLength(3), this.onlyLettersValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]],
      repeat_password: ['', [Validators.required, this.passwordValidator()]]
    });

    this.registerForm.valueChanges.subscribe(() => this.checkPasswordMatch());
  }

  private checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('repeat_password')?.value;
    this.passwordMismatch = password !== confirmPassword && confirmPassword !== '';
  }

  register() {
    if (this.registerForm.valid && !this.passwordMismatch) {
      const newUser: NewUser = this.registerForm.value;

      this.authService.register(newUser).subscribe({
        next: () => {
          this.showLoading();
          this.isRegistering = true;
          setTimeout(() => {
            this.hideLoading();
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso',
              detail: 'El usuario ha sido registrado con éxito. Inicie sesión',
              sticky: true
            });
          }, 2000);
          setTimeout(() => {
            this.isRegistering = false;
            this.resetForm();
            this.closeModalRegister();
            this.showModalLogin();
          }, 5000);
        },
        error: (error) => {
          this.isRegistering = false;
          console.error('Error al registrar', error);

          const backendMessage = error?.error?.message || error?.error?.detail || 'Inténtelo más tarde.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al registrar',
            detail: backendMessage,
            sticky: true
          });

          if (backendMessage.toLowerCase().includes('already registered') ||
              backendMessage.toLowerCase().includes('ya registrado') ||
              backendMessage.toLowerCase().includes('email exists')) {
            const emailControl = this.registerForm.get('email');
            if (emailControl) {
              emailControl.setErrors({ backend: 'Este correo ya está registrado' });
              emailControl.markAsTouched();
            }
          }

          if (error?.error?.errors) {
            const fieldErrors = error.error.errors;
            Object.keys(fieldErrors).forEach(field => {
              const control = this.registerForm.get(field);
              if (control) {
                control.setErrors({ backend: fieldErrors[field][0] });
                control.markAsTouched();
              }
            });
          }
        }
      });
    }
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.registerForm.get(controlName);
    return control?.hasError(errorType) && control?.touched;
  }

  hasCustomError(controlName: string, errorType: string) {
    const control = this.registerForm.get(controlName);
    return control?.hasError(errorType) && control?.touched;
  }

  hasBackendError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control?.errors?.['backend'];
  }

  getBackendError(controlName: string): string {
    const control = this.registerForm.get(controlName);
    return control?.errors?.['backend'] || '';
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
    this.inputType = this.hide ? 'password' : 'text';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmHide = !this.confirmHide;
    this.confirmInputType = this.confirmHide ? 'password' : 'text';
  }

  resetForm() {
    this.registerForm.reset();
    this.passwordMismatch = false;
    this.hide = true;
    this.confirmHide = true;
    this.inputType = 'password';
    this.confirmInputType = 'password';
  }

  closeModalRegister() {
    const modalRegister = document.getElementById('registerModal') as HTMLElement;
    const modal = Modal.getInstance(modalRegister);
    modal?.hide();
    setTimeout(() => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 300);
  }

  showModalLogin() {
    const modalLogin = document.getElementById('loginModal') as HTMLElement;
    const modal = new Modal(modalLogin);
    modal?.show();
  }

  showLoading() {
    document.getElementById('loadingBackdrop')!.style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingBackdrop')!.style.setProperty('display', 'none', 'important');
  }
}