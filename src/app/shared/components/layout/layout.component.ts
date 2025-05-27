import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { RouterModule } from '@angular/router';
import { AccessibilityPanelComponent } from '../accessibility-panel/accessibility-panel.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    RouterModule,
    AccessibilityPanelComponent
  ]
})
export class LayoutComponent {} 