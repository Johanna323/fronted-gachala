import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { ProgramaService } from '../../../shared/services/programa.service';

@Component({
  selector: 'app-beneficiarios-form',
  templateUrl: './beneficiarios-form.component.html',
  styleUrls: ['./beneficiarios-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  providers: [
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class BeneficiariosFormComponent implements OnInit {
  form: FormGroup;
  usuarios: any[] = [];
  programas: any[] = [];
  filteredUsuarios: Observable<any[]>;
  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BeneficiariosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { beneficiario: any },
    private userService: UserService,
    private programaService: ProgramaService
  ) {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      programa_id: ['', Validators.required],
      estado_validacion: ['activo', Validators.required],
      fecha_registro: [new Date(), Validators.required]
    });

    // Initialize filteredUsuarios with empty array
    this.filteredUsuarios = of([]);
  }

  ngOnInit() {
    this.loadUsuarios();
    this.loadProgramas();
    
    if (this.data?.beneficiario) {
      // Format the date string to YYYY-MM-DD
      const fechaRegistro = this.data.beneficiario.fecha_registro 
        ? new Date(this.data.beneficiario.fecha_registro)
        : new Date();

      // Wait for users to be loaded before setting the form value
      this.userService.getUsers().subscribe(users => {
        const usuario = users.find(u => u.id === this.data.beneficiario.user_id);
        
        this.form.patchValue({
          user_id: usuario || this.data.beneficiario.user_id,
          programa_id: this.data.beneficiario.programa_id,
          estado_validacion: this.data.beneficiario.estado_validacion,
          fecha_registro: fechaRegistro
        });
        // Disable the user_id control in edit mode
        this.form.get('user_id')?.disable();
      });
    }

    // Set up the filter after loading users
    this.filteredUsuarios = this.form.get('user_id')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsuarios(value))
    ) || of([]);
  }

  loadUsuarios() {
    this.userService.getUsers().subscribe(
      (data) => {
        this.usuarios = data;
        // Update filteredUsuarios after loading users
        this.filteredUsuarios = this.form.get('user_id')?.valueChanges.pipe(
          startWith(''),
          map(value => this._filterUsuarios(value))
        ) || of([]);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  loadProgramas() {
    this.programaService.getProgramas().subscribe(
      (data: any[]) => {
        this.programas = data;
      },
      (error) => {
        console.error('Error al cargar programas:', error);
      }
    );
  }

  private _filterUsuarios(value: string | any): any[] {
    if (!value || typeof value === 'object') {
      return this.usuarios;
    }

    const filterValue = value.toLowerCase();
    return this.usuarios.filter(usuario => 
      usuario.primer_nombre?.toLowerCase().includes(filterValue) ||
      usuario.primer_apellido?.toLowerCase().includes(filterValue) ||
      usuario.numero_documento?.toLowerCase().includes(filterValue)
    );
  }

  displayUsuario(usuario: any): string {
    if (!usuario) return '';
    return `${usuario.primer_nombre || ''} ${usuario.primer_apellido || ''} - ${usuario.numero_documento || ''}`;
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Format the data according to API requirements
      const data = {
        user_id: typeof formValue.user_id === 'object' ? formValue.user_id.id : formValue.user_id,
        programa_id: formValue.programa_id,
        estado_validacion: formValue.estado_validacion,
        fecha_registro: this.formatDate(formValue.fecha_registro)
      };

      this.dialogRef.close(data);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
