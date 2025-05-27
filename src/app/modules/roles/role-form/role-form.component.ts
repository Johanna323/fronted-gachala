import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService, Role, CreateRoleDto, UpdateRoleDto } from '../../../shared/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ]
})
export class RoleFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    public dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue({
        nombre: this.data.nombre,
        descripcion: this.data.descripcion,
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    const roleData: CreateRoleDto = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      activo: formData.activo ? 1 : 0
    };

    this.loading = true;
    if (this.isEditMode) {
      this.roleService.updateRole(this.data.id, roleData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Rol actualizado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el rol'
          });
        }
      });
    } else {
      this.roleService.createRole(roleData).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Rol creado correctamente',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el rol'
          });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
