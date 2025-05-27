import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleService } from '../../../shared/services/role.service';

@Component({
  selector: 'app-usuario-role',
  templateUrl: './usuario-role.component.html',
  styleUrls: ['./usuario-role.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ]
})
export class UsuarioRoleComponent implements OnInit {
  roleForm: FormGroup;
  roles: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioRoleComponent>,
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: any }
  ) {
    this.roleForm = this.fb.group({
      role_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadRoles();
    if (this.data.usuario.role_id) {
      this.roleForm.patchValue({
        role_id: this.data.usuario.role_id
      });
    }
  }

  loadRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar roles:', error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
