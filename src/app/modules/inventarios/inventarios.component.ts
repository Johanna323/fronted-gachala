import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService, KitInventario } from '../../shared/services/inventario.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InventariosFormComponent } from './inventarios-form/inventarios-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class InventariosComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nombre_kit',
    'descripcion',
    'cantidad_disponible',
    'fecha_actualizacion',
    'acciones'
  ];
  kits: KitInventario[] = [];
  loading = false;
  error = '';

  constructor(
    private inventarioService: InventarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadKits();
  }

  loadKits() {
    this.loading = true;
    this.inventarioService.getKits().subscribe(
      (data) => {
        this.kits = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar los kits de inventario';
        this.loading = false;
      }
    );
  }

  abrirModalCrear() {
    const dialogRef = this.dialog.open(InventariosFormComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadKits();
      }
    });
  }

  abrirModalEditar(index: number) {
    const kit = this.kits[index];
    const dialogRef = this.dialog.open(InventariosFormComponent, {
      width: '600px',
      disableClose: true,
      data: { kit }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadKits();
      }
    });
  }

  delete(index: number) {
    const kit = this.kits[index];
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el kit de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.deleteKit(kit.id).subscribe(
          () => {
            this.loadKits();
            Swal.fire('Eliminado', 'El kit ha sido eliminado exitosamente.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar el kit.', 'error');
          }
        );
      }
    });
  }
} 