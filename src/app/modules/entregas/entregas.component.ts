import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntregasService, Entrega } from '../../shared/services/entregas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { EntregasFormComponent } from './entregas-form/entregas-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule
  ]
})
export class EntregasComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'beneficiary_id',
    'kit_id',
    'fecha_entrega',
    'funcionario_entrega',
    'observaciones',
    'estado',
    'sector_id',
    'acciones'
  ];
  entregas: Entrega[] = [];
  loading = false;
  error = '';

  constructor(
    private entregasService: EntregasService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEntregas();
  }

  loadEntregas() {
    this.loading = true;
    this.entregasService.getEntregas().subscribe(
      (data) => {
        this.entregas = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar las entregas';
        this.loading = false;
      }
    );
  }

  abrirModalCrear() {
    const dialogRef = this.dialog.open(EntregasFormComponent, {
      width: '50vw',
      maxWidth: '100vw',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entregasService.createEntrega(result).subscribe(
          () => {
            this.loadEntregas();
            Swal.fire('Creado', 'La entrega ha sido creada exitosamente.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo crear la entrega.', 'error');
          }
        );
      }
    });
  }

  abrirModalEditar(index: number) {
    const entrega = this.entregas[index];
    const dialogRef = this.dialog.open(EntregasFormComponent, {
      width: '50vw',
      maxWidth: '100vw',
      disableClose: true,
      data: { entrega }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.entregasService.updateEntrega(entrega.id, result).subscribe(
          () => {
            this.loadEntregas();
            Swal.fire('Actualizado', 'La entrega ha sido actualizada exitosamente.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo actualizar la entrega.', 'error');
          }
        );
      }
    });
  }

  delete(index: number) {
    const entrega = this.entregas[index];
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la entrega de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entregasService.deleteEntrega(entrega.id).subscribe(
          () => {
            this.loadEntregas();
            Swal.fire('Eliminado', 'La entrega ha sido eliminada exitosamente.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'No se pudo eliminar la entrega.', 'error');
          }
        );
      }
    });
  }
} 