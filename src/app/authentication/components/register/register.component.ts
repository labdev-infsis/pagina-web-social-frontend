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
  public modal?: Modal | null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      
      const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
      
      const valid = lettersRegex.test(control.value);
      return valid ? null : { 'onlyLetters': { value: control.value } };
    };
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      
      const value = control.value;
      
      // Verificar longitud
      if (value.length < 8 || value.length > 20) {
        return { 'passwordLength': { value: control.value } };
      }
      
      return null;
    };
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, this.onlyLettersValidator()]],
      lastName: ['', [Validators.required, this.onlyLettersValidator()]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator()]],
      repeat_password: ['', [Validators.required, this.passwordValidator()]]
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
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
        next: (response) => {
          console.log('Usuario registrado:', response.message);
          this.showLoading();
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
            this.resetForm();
            this.closeModalRegister();
            this.showModalLogin();
          }, 5000);
        },
        error: (error) => {
          console.log('Error al registrar', error);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error al registrar', 
            detail: 'Inténtelo más tarde.', 
            sticky: true 
          });
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
    let modal = Modal.getInstance(modalRegister);
    modal?.hide();
    setTimeout(() => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 300);
  }

  showModalLogin() {
    const modalLogin = document.getElementById('loginModal') as HTMLElement;
    let modal = new Modal(modalLogin);
    modal?.show();
  }

  showLoading() {
    document.getElementById('loadingBackdrop')!.style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingBackdrop')!.style.display = 'none';
  }
}