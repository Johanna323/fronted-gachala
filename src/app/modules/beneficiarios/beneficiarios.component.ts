import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiarioService } from '../../shared/services/beneficiario.service';
import { BeneficiariosFormComponent } from './beneficiarios-form/beneficiarios-form.component';
import { BeneficiarioUploadComponent } from './beneficiario-upload/beneficiario-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class BeneficiariosComponent implements OnInit {
  displayedColumns: string[] = [
    'user_id',
    'usuario',
    'programa',
    'estado_validacion',
    'fecha_registro',
    'acciones'
  ];
  beneficiarios: any[] = [];
  loading = false;
  error = '';

  constructor(
    private beneficiarioService: BeneficiarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBeneficiarios();
  }

  loadBeneficiarios() {
    this.loading = true;
    this.beneficiarioService.getBeneficiarios().subscribe(
      (data) => {
        this.beneficiarios = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar beneficiarios:', error);
        this.error = 'Error al cargar los beneficiarios';
        this.loading = false;
      }
    );
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'aprobado':
        return 'estado-aprobado';
      case 'rechazado':
        return 'estado-rechazado';
      case 'pendiente':
        return 'estado-pendiente';
      default:
        return '';
    }
  }

  abrirModalCrear() {
    const dialogRef = this.dialog.open(BeneficiariosFormComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficiarioService.createBeneficiario(result).subscribe(
          () => {
            this.loadBeneficiarios();
            Swal.fire('Creado', 'El beneficiario ha sido creado exitosamente.', 'success');
          },
          (error) => {
            console.error('Error al crear beneficiario:', error);
            Swal.fire('Error', 'No se pudo crear el beneficiario.', 'error');
          }
        );
      }
    });
  }

  abrirModalEditar(index: number) {
    const beneficiario = this.beneficiarios[index];
    const dialogRef = this.dialog.open(BeneficiariosFormComponent, {
      width: '600px',
      disableClose: true,
      data: { beneficiario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficiarioService.updateBeneficiario(beneficiario.id, result).subscribe(
          () => {
            this.loadBeneficiarios();
            Swal.fire('Actualizado', 'El beneficiario ha sido actualizado exitosamente.', 'success');
          },
          (error) => {
            console.error('Error al actualizar beneficiario:', error);
            Swal.fire('Error', 'No se pudo actualizar el beneficiario.', 'error');
          }
        );
      }
    });
  }

  abrirModalDocumentos(index: number) {
    const beneficiario = this.beneficiarios[index];
    const dialogRef = this.dialog.open(BeneficiarioUploadComponent, {
      width: '600px',
      disableClose: true,
      data: { beneficiario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Here you would typically call a service method to upload the documents
        console.log('Documentos a subir:', result);
        Swal.fire('Subido', 'Los documentos han sido subidos exitosamente.', 'success');
      }
    });
  }

  delete(index: number) {
    const beneficiario = this.beneficiarios[index];
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el beneficiario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.beneficiarioService.deleteBeneficiario(beneficiario.id).subscribe(
          () => {
            this.loadBeneficiarios();
            Swal.fire('Eliminado', 'El beneficiario ha sido eliminado exitosamente.', 'success');
          },
          (error) => {
            console.error('Error al eliminar beneficiario:', error);
            Swal.fire('Error', 'No se pudo eliminar el beneficiario.', 'error');
          }
        );
      }
    });
  }
} 