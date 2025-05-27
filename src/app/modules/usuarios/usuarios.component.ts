import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioRoleComponent } from './usuario-role/usuario-role.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['nombre_completo', 'correo', 'documento', 'telefono', 'role', 'estado', 'acciones'];
  usuarios: any[] = [];
  tiposDocumento: any[] = [];
  generos: any[] = [];
  selectedUser: any = null;
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsuarios();
    this.cargarTiposDocumento();
    this.cargarGeneros();
  }

  loadUsuarios() {
    this.loading = true;
    this.userService.getUsers().subscribe(
      users => {
        this.usuarios = users;
        this.loading = false;
      },
      error => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    );
  }

  abrirModalCrear() {
    this.selectedUser = null;
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '70vw',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        usuario: null,
        tiposDocumento: this.tiposDocumento,
        generos: this.generos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onGuardarUsuario(result);
      }
    });
  }

  abrirModalEditar(index: number) {
    this.selectedUser = this.usuarios[index];
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '70vw',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        usuario: this.selectedUser,
        tiposDocumento: this.tiposDocumento,
        generos: this.generos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onGuardarUsuario(result);
      }
    });
  }

  abrirModalAsignarRol(index: number) {
    this.selectedUser = this.usuarios[index];
    const dialogRef = this.dialog.open(UsuarioRoleComponent, {
      width: '400px',
      disableClose: true,
      data: {
        usuario: this.selectedUser
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.assignRole(this.selectedUser.id, result.role_id).subscribe(
          () => {
            this.loadUsuarios();
            Swal.fire('Actualizado', 'El rol ha sido asignado correctamente.', 'success');
          },
          (error) => {
            console.error('Error al asignar rol:', error);
            Swal.fire('Error', 'No se pudo asignar el rol.', 'error');
          }
        );
      }
    });
  }

  onGuardarUsuario(usuario: any) {
    if (this.selectedUser) {
      // Editar usuario
      this.userService.updateUser(this.selectedUser.id, usuario).subscribe(
        (updatedUser) => {
          this.loadUsuarios();
          Swal.fire('Actualizado', 'El usuario ha sido actualizado.', 'success');
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        }
      );
    } else {
      // Crear usuario
      this.userService.createUser(usuario).subscribe(
        (newUser) => {
          this.loadUsuarios();
          Swal.fire('Creado', 'El usuario ha sido creado.', 'success');
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
        }
      );
    }
  }

  delete(index: number) {
    const user = this.usuarios[index];
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el usuario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe(
          () => {
            this.loadUsuarios();
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
          },
          (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        );
      }
    });
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