import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SectoresService, Sector } from '../../../shared/services/sectores.service';
import { UserService } from '../../../shared/services/user.service';
import { FormsModule } from '@angular/forms';
import { BeneficiarioService } from '../../../shared/services/beneficiario.service';
import { InventarioService, KitInventario } from '../../../shared/services/inventario.service';

@Component({
  selector: 'app-entregas-form',
  templateUrl: './entregas-form.component.html',
  styleUrls: ['./entregas-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatNativeDateModule,
    MatDatepickerModule
  ]
})
export class EntregasFormComponent implements OnInit {
  form: FormGroup;
  usuarios: any[] = [];
  kits: KitInventario[] = [];
  sectores: Sector[] = [];
  funcionarios: any[] = [];
  filteredUsuarios: Observable<any[]> = of([]);
  filteredFuncionarios: Observable<any[]> = of([]);
  filteredBeneficiarios: Observable<any[]> = of([]);
  searchFuncionario = '';
  searchUsuario = '';
  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EntregasFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entrega: any },
    private sectoresService: SectoresService,
    private userService: UserService,
    private beneficiarioService: BeneficiarioService,
    private inventarioService: InventarioService
  ) {
    this.form = this.fb.group({
      beneficiary_id: ['', Validators.required],
      kit_id: ['', Validators.required],
      sector_id: ['', Validators.required],
      funcionario_entrega: ['', Validators.required],
      observaciones: [''],
      estado: ['activo', Validators.required],
      fecha_entrega: [new Date(), Validators.required]
    });
  }

  ngOnInit() {
    // Cargar sectores desde el servicio
    this.sectoresService.getSectores().subscribe(
      (sectores) => {
        this.sectores = sectores;
      },
      (error) => {
        this.sectores = [];
      }
    );

    // Cargar funcionarios desde UserService
    this.userService.getUsers().subscribe(
      (users: any) => {
        this.funcionarios = users.filter((u: any) => u.role_id === 3);
        this.filteredFuncionarios = of(this.funcionarios);
      },
      (error) => {
        this.funcionarios = [];
        this.filteredFuncionarios = of([]);
      }
    );

    // Cargar beneficiarios desde BeneficiarioService
    this.getBeneficiarios();
    this.getKits();

    if (this.data?.entrega) {
      this.form.patchValue({
        ...this.data.entrega,
        fecha_entrega: this.data.entrega.fecha_entrega ? new Date(this.data.entrega.fecha_entrega) : new Date()
      });
    }
  }

  getKits() {
    this.inventarioService.getKits().subscribe(
      (kits) => {
        this.kits = kits;
      }
    );
  }

  getBeneficiarios() {
    this.beneficiarioService.getBeneficiarios().subscribe(
      (beneficiarios) => {
        this.usuarios = beneficiarios;
        this.filteredBeneficiarios = of(this.usuarios);
      }
    );
  }

  onSearchFuncionario(value: string) {
    this.searchFuncionario = value;
    this.filteredFuncionarios = of(
      this.funcionarios.filter(f =>
        (`${f.primer_nombre} ${f.primer_apellido}`.toLowerCase().includes(value.toLowerCase()) ||
         f.numero_documento?.toLowerCase().includes(value.toLowerCase()))
      )
    );
  }

  onSearchUsuario(value: string) {
    this.searchUsuario = value;
    this.filteredUsuarios = of(
      this.usuarios.filter(u =>
        (`${u.primer_nombre} ${u.primer_apellido}`.toLowerCase().includes(value.toLowerCase()) ||
         u.numero_documento?.toLowerCase().includes(value.toLowerCase()))
      )
    );
  }

  private _filterUsuarios(value: string | any): any[] {
    if (!value || typeof value === 'object') return this.usuarios;
    const filterValue = value.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(filterValue) ||
      u.documento.toLowerCase().includes(filterValue)
    );
  }

  displayUsuario(usuario: any): string {
    return usuario ? `${usuario.nombre} (${usuario.documento})` : '';
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      const data = {
        beneficiary_id: typeof value.beneficiary_id === 'object' ? value.beneficiary_id.id : value.beneficiary_id,
        kit_id: value.kit_id,
        sector_id: value.sector_id,
        funcionario_entrega: value.funcionario_entrega,
        observaciones: value.observaciones,
        estado: value.estado,
        fecha_entrega: this.formatDate(value.fecha_entrega)
      };
      this.dialogRef.close(data);
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
