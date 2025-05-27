import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntregasService, Entrega } from '../../shared/services/entregas.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mis-entregas',
  templateUrl: './mis-entregas.component.html',
  styleUrls: ['./mis-entregas.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class MisEntregasComponent implements OnInit {
  entregas: Entrega[] = [];
  error = '';
  loading = false;
  displayedColumns: string[] = [
    'kit',
    'fecha_entrega',
    'funcionario',
    'estado',
    'observaciones',
    'sector'
  ];

  constructor(private entregasService: EntregasService) {}

  ngOnInit() {
    this.loading = true;
    let userId = null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userId = user.id;
    } catch (e) {
      userId = null;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.entregasService.getEntregasByUser(user.id).subscribe(
      (data) => {
        this.entregas = data.filter(e => e.beneficiary_id === userId);
        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar tus entregas';
        this.loading = false;
      }
    );
  }
}
