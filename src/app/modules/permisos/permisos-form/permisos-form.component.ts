import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PermisosService, Permiso } from '../../../shared/services/permisos.service';

@Component({
  selector: 'app-permisos-form',
  templateUrl: './permisos-form.component.html',
  styleUrls: ['./permisos-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class PermisosFormComponent implements OnInit {
  form: FormGroup;
  rutas: string[] = ['/home', '/usuarios', '/permisos', '/roles', '/beneficiarios', '/inventarios', '/entregas', '/mis-entregas', '/perfil'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PermisosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { permiso: Permiso },
    private permisosService: PermisosService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      ruta: [[], Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.permiso) {
      const permiso = this.data.permiso;
      this.form.patchValue({
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
        ruta: permiso.ruta ? permiso.ruta.split(',') : []
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const permiso: Partial<Permiso> = this.form.value;
      permiso.ruta = this.form.get('ruta')?.value.join(',');
      if (this.data?.permiso) {
        this.permisosService.updatePermiso(this.data.permiso.id, permiso).subscribe(
          (updatedPermiso) => {
            this.dialogRef.close(updatedPermiso);
          },
          (error) => {
            console.error('Error al actualizar permiso:', error);
          }
        );
      } else {
        this.permisosService.createPermiso(permiso).subscribe(
          (newPermiso) => {
            this.dialogRef.close(newPermiso);
          },
          (error) => {
            console.error('Error al crear permiso:', error);
          }
        );
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
