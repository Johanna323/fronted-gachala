import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleService, Role } from '../../services/role.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
})
export class MenuComponent implements OnInit {
  allowedRoutes: string[] = [];
  menuOptions = [
    { label: 'Inicio', route: '/home' },
    { label: 'Roles', route: '/roles' },
    { label: 'Usuarios', route: '/usuarios' },
    { label: 'Permisos', route: '/permisos' },
    { label: 'Beneficiarios', route: '/beneficiarios' },
    { label: 'Entregas', route: '/entregas' },
    { label: 'Inventarios', route: '/inventarios' },
    { label: 'Perfil', route: '/perfil' },
    { label: 'Mis Entregas', route: '/mis-entregas' }
  ];

  constructor(private router: Router, private roleService: RoleService, private userService: UserService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userService.getUserById(user.id).subscribe((user: any) => {
      const roleId = user.role_id;
      if (roleId) {
        this.roleService.getRole(roleId).subscribe((role: any) => {
          this.roleService.hasPermission(roleId, role.nombre).subscribe((resp: any) => {
            const rutas = resp?.permiso?.ruta || '';
            this.allowedRoutes = rutas.split(',').map((r: string) => r.trim());
          });
        });
      }
    });
  }

  isRouteAllowed(route: string): boolean {
    return this.allowedRoutes.includes(route);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
