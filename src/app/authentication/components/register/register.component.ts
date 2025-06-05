import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public inputType: string = 'password';
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

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]], 
      lastName: ['', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeat_password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Detecta cuando las contraseñas no coinciden
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.passwordMismatch = this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value;
    });
  }

  register() {
    if (this.registerForm.valid) {
      const newUser: NewUser = this.registerForm.value;
      
      this.authService.register(newUser).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response.message);
          this.showLoading();
          setTimeout(()=>{
            this.hideLoading()
            this.messageService.add({ severity: 'success', summary: 'Registro exitoso', detail: 'El usuario ha sido registrado con éxito. Inicie sesión', sticky: true });
          },2000)
          setTimeout(()=> {
            this.resetForm();
            this.closeModalRegister();
            this.showModalLogin();
          },5000);
        },
        error:(error) => {
          console.log('Error al registar',error);
          this.messageService.add({ severity: 'error', summary: 'Error al registrar', detail: 'Intentelo mas tarde.', sticky: true });
        }
      });
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

  closeModalRegister(){
    const modalRegister = document.getElementById('registerModal') as HTMLElement;
    let modal = Modal.getInstance(modalRegister)
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

  showModalLogin(){
    const modalLogin = document.getElementById('loginModal') as HTMLElement;
    let modal = new Modal(modalLogin)
    modal?.show();
  }

  showLoading() {
    document.getElementById('loadingBackdrop')!.style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingBackdrop')!.classList.add('hide');
  }
}
