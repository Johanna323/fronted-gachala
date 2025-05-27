import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../shared/services/user.service';
import Swal from 'sweetalert2';

interface TipoDocumento {
  id: number;
  nombre: string;
}

interface Genero {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  tiposDocumento: TipoDocumento[] = [];
  generos: Genero[] = [];
  isEditing = false;
  originalFormData: any;
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      tipo_documento_id: ['', Validators.required],
      numero_documento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      municipio: ['', Validators.required],
      departamento: ['', Validators.required],
      pais: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero_id: ['', Validators.required],
      activo: [false]
    });

    // Deshabilitar el formulario inicialmente
    this.form.disable();
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadSelectOptions();
      this.loadUserData();
    }
  }

  loadSelectOptions() {
    this.loading = true;
    
    // Cargar tipos de documento
    this.userService.getTiposDocumento().subscribe({
      next: (tipos) => {
        this.tiposDocumento = tipos;
      },
      error: (error) => {
        this.error = 'Error al cargar los tipos de documento';
        if (this.isBrowser) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los tipos de documento'
          });
        }
      }
    });

    // Cargar géneros
    this.userService.getGeneros().subscribe({
      next: (generos) => {
        this.generos = generos;
      },
      error: (error) => {
        this.error = 'Error al cargar los géneros';
        if (this.isBrowser) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los géneros'
          });
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadUserData() {
    if (!this.isBrowser) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = JSON.parse(userData);
      this.form.patchValue({
        primer_nombre: user.primer_nombre,
        segundo_nombre: user.segundo_nombre,
        primer_apellido: user.primer_apellido,
        segundo_apellido: user.segundo_apellido,
        correo: user.correo,
        tipo_documento_id: user.tipo_documento_id,
        numero_documento: user.numero_documento,
        telefono: user.telefono,
        direccion: user.direccion,
        municipio: user.municipio,
        departamento: user.departamento,
        pais: user.pais,
        fecha_nacimiento: user.fecha_nacimiento,
        genero_id: user.genero_id,
        activo: user.activo === 1
      });
      // Guardar los datos originales
      this.originalFormData = this.form.value;
    } catch (error) {
      this.error = 'Error al cargar los datos del usuario';
      if (this.isBrowser) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los datos del usuario'
        });
      }
    }
  }

  toggleEdit() {
    if (this.isEditing) {
      // Si estamos cancelando la edición, restaurar los datos originales
      this.form.patchValue(this.originalFormData);
      this.form.disable();
    } else {
      // Si estamos entrando en modo edición, habilitar el formulario
      this.form.enable();
    }
    this.isEditing = !this.isEditing;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isBrowser) return;

    const formData = this.form.value;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userData = {
      ...formData,
      activo: formData.activo ? 1 : 0,
      id: user['id']
    };

    this.loading = true;
    this.userService.updateUser(user['id'], userData).subscribe({
      next: (response: any) => {
        this.loading = false;
        localStorage.setItem('user', JSON.stringify(userData));
        this.originalFormData = this.form.value;
        this.form.disable();
        this.isEditing = false;
        
        if (this.isBrowser) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Perfil actualizado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al actualizar el perfil';
        if (this.isBrowser) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el perfil'
          });
        }
      }
    });
  }
}