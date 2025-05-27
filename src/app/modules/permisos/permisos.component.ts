import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PermisosService, Permiso } from '../../shared/services/permisos.service';
import { PermisosFormComponent } from './permisos-form/permisos-form.component';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class PermisosComponent implements OnInit {
  form: FormGroup;
  permisos: Permiso[] = [];
  editingIndex: number | null = null;
  displayedColumns: string[] = ['nombre', 'descripcion', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private permisosService: PermisosService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit() {
    this.loadPermisos();
  }

  loadPermisos() {
    this.permisosService.getPermisos().subscribe(
      (data) => {
        this.permisos = data;
      },
      (error) => {
        console.error('Error al cargar permisos:', error);
      }
    );
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PermisosFormComponent, {
      width: '500px',
      data: { permiso: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermisos();
      }
    });
  }

  edit(index: number) {
    const dialogRef = this.dialog.open(PermisosFormComponent, {
      width: '500px',
      data: { permiso: this.permisos[index] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermisos();
      }
    });
  }

  delete(index: number) {
    this.permisosService.deletePermiso(this.permisos[index].id).subscribe(
      () => {
        this.permisos.splice(index, 1);
      },
      (error) => {
        console.error('Error al eliminar permiso:', error);
      }
    );
  }
} 