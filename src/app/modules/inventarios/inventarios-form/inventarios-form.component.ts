import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../../shared/services/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios-form',
  templateUrl: './inventarios-form.component.html',
  styleUrls: ['./inventarios-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class InventariosFormComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InventariosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kit: any },
    private inventarioService: InventarioService
  ) {
    this.form = this.fb.group({
      nombre_kit: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad_disponible: [0, [Validators.required, Validators.min(0)]],
      fecha_actualizacion: [new Date(), Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.kit) {
      this.form.patchValue({
        ...this.data.kit,
        fecha_actualizacion: this.data.kit.fecha_actualizacion ? new Date(this.data.kit.fecha_actualizacion) : new Date()
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const value = this.form.value;
      const formatted = {
        nombre_kit: value.nombre_kit,
        descripcion: value.descripcion,
        cantidad_disponible: value.cantidad_disponible,
        fecha_actualizacion: this.formatDate(value.fecha_actualizacion)
      };
      if (this.data?.kit) {
        // Editar
        this.inventarioService.updateKit(this.data.kit.id, formatted).subscribe(
          () => {
            this.loading = false;
            Swal.fire('Actualizado', 'El kit ha sido actualizado exitosamente.', 'success');
            this.dialogRef.close(true);
          },
          (error) => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo actualizar el kit.', 'error');
          }
        );
      } else {
        // Crear
        this.inventarioService.createKit(formatted).subscribe(
          () => {
            this.loading = false;
            Swal.fire('Creado', 'El kit ha sido creado exitosamente.', 'success');
            this.dialogRef.close(true);
          },
          (error) => {
            this.loading = false;
            Swal.fire('Error', 'No se pudo crear el kit.', 'error');
          }
        );
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
