import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ]
})
export class HomeComponent {
  stats = [
    { icon: 'people', title: 'Beneficiarios', value: '1,200+' },
    { icon: 'local_shipping', title: 'Entregas Mensuales', value: '2,400' },
    { icon: 'store', title: 'Mercados Entregados', value: '12,000+' },
    { icon: 'location_on', title: 'Cobertura', value: '100%' }
  ];

  features = [
    {
      icon: 'verified',
      title: 'Calidad Garantizada',
      description: 'Todos los productos son seleccionados y verificados para garantizar la mejor calidad para nuestros beneficiarios.'
    },
    {
      icon: 'schedule',
      title: 'Entrega Puntual',
      description: 'Cumplimos con los horarios establecidos para asegurar que los beneficiarios reciban sus mercados a tiempo.'
    },
    {
      icon: 'volunteer_activism',
      title: 'Atención Personalizada',
      description: 'Brindamos atención especial a cada beneficiario, considerando sus necesidades específicas.'
    },
    {
      icon: 'security',
      title: 'Transparencia',
      description: 'Garantizamos un proceso transparente en la selección y entrega de los mercados.'
    }
  ];
}
