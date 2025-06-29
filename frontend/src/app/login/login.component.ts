import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon'; // <-- ADD THIS

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- Required for reactive forms
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule, // <-- AND THIS
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Use 'styleUrls' (plural)
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        switch(user.role) {
          case 'Admin':
            this.router.navigate(['/admin']);
            break;
          case 'Teacher':
            this.router.navigate(['/teacher']);
            break;
          case 'Student':
            this.router.navigate(['/student']);
            break;
          default:
            this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Login Failed. Check credentials.';
      }
    });
  }
}
