import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMsg: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize form in constructor
    this.loginForm = this.fb.group({
      document: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if user is already logged in (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        this.router.navigate(['/home']);
      }
    }
  }

  onSubmit() {
    this.errorMsg = null;
    if (this.loginForm.valid) {
      this.loading = true;
      const payload = {
        numero_documento: this.loginForm.value.document,
        contrasena: this.loginForm.value.password
      };
      this.authService.login(payload).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user', JSON.stringify(res));
            }
            this.router.navigate(['/home']);
          } else {
            this.errorMsg = 'Respuesta del servidor inválida';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = 'Credenciales incorrectas o error de conexión.';
          console.error('Login error:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
