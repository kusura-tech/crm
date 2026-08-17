import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
// auth.component.ts
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  isRegisterMode = false;
  errorMessage = '';
  showPassword = false;

  authForm = this.fb.nonNullable.group({
    displayName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get passwordInputType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';

    // Поле имени обязательно только при регистрации
    const nameControl = this.authForm.controls.displayName;
    if (this.isRegisterMode) {
      nameControl.setValidators([Validators.required]);
    } else {
      nameControl.clearValidators();
    }
    nameControl.updateValueAndValidity();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password, displayName } = this.authForm.getRawValue();

    const authObs = this.isRegisterMode
      ? this.authService.register(email, password, displayName)
      : this.authService.login(email, password);

    authObs.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Этот Email уже зарегистрирован. Нажмите "Войти"';
        } else if (
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
        ) {
          this.errorMessage = 'Неверный e-mail или пароль';
        } else {
          this.errorMessage = 'Ошибка авторизации. Проверьте данные.';
        }
      },
    });
  }
}
