import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  usuario: any;
  tiposDocumento: any[];
  generos: any[];
}

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule
  ]
})
export class UsuarioFormComponent implements OnInit {
  form: FormGroup;
  showPassword = false;
  tiposDocumento: any[] = [];
  generos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      tipo_documento: ['', Validators.required],
      numero_documento: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      municipio: [''],
      departamento: [''],
      pais: [''],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const isEdit = !!this.data.usuario;
    if (isEdit) {
      this.form = this.fb.group({
        primer_nombre: [this.data.usuario?.primer_nombre || '', Validators.required],
        segundo_nombre: [this.data.usuario?.segundo_nombre || ''],
        primer_apellido: [this.data.usuario?.primer_apellido || '', Validators.required],
        segundo_apellido: [this.data.usuario?.segundo_apellido || ''],
        correo: [this.data.usuario?.correo || '', [Validators.required, Validators.email]],
        contrasena: [
          '', 
          isEdit ? [] : [Validators.required, Validators.minLength(6)]
        ],
        tipo_documento: [this.data.usuario?.tipo_documento_id || '', Validators.required],
        numero_documento: [this.data.usuario?.numero_documento || '', Validators.required],
        telefono: [this.data.usuario?.telefono || '', Validators.required],
        direccion: [this.data.usuario?.direccion || '', Validators.required],
        municipio: [this.data.usuario?.municipio || ''],
        departamento: [this.data.usuario?.departamento || ''],
        pais: [this.data.usuario?.pais || ''],
        fecha_nacimiento: [this.data.usuario?.fecha_nacimiento || '', Validators.required],
        genero: [this.data.usuario?.genero_id || '', Validators.required],
        activo: [this.data.usuario?.activo ?? true]
      });
    }
    if (this.data?.tiposDocumento) {
      this.tiposDocumento = this.data.tiposDocumento;
    }
    if (this.data?.generos) {
      this.generos = this.data.generos;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  cargarTiposDocumento() {
    this.userService.getTiposDocumento().subscribe(
      (data: any) => {
        this.tiposDocumento = data;
      },
      (error: any) => {
        console.error('Error al cargar tipos de documento:', error);
      }
    );
  }

  cargarGeneros() {
    this.userService.getGeneros().subscribe(
      (data: any) => {
        this.generos = data;
      },
      (error: any) => {
        console.error('Error al cargar géneros:', error);
      }
    );
  }
}
