import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { RoleFormComponent } from './role-form/role-form.component';
import { RoleService, Role } from '../../shared/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule
  ]
})
export class RolesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource: Role[] = [];
  loading = false;
  error = '';

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.dataSource = roles;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los roles';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los roles'
        });
      }
    });
  }

  openRoleForm(role?: Role) {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px',
      data: role
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  deleteRole(role: Role) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el rol ${role.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(role.id).subscribe({
          next: () => {
            this.loadRoles();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Rol eliminado correctamente',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al eliminar el rol'
            });
          }
        });
      }
    });
  }
} 