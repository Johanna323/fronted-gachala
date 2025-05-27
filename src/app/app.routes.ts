import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { RolesComponent } from './modules/roles/roles.component';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { PermisosComponent } from './modules/permisos/permisos.component';
import { BeneficiariosComponent } from './modules/beneficiarios/beneficiarios.component';
import { EntregasComponent } from './modules/entregas/entregas.component';
import { InventariosComponent } from './modules/inventarios/inventarios.component';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { MisEntregasComponent } from './modules/mis-entregas/mis-entregas.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'roles',
                component: RolesComponent
            },
            {
                path: 'usuarios',
                component: UsuariosComponent
            },
            {
                path: 'permisos',
                component: PermisosComponent
            },
            {
                path: 'beneficiarios',
                component: BeneficiariosComponent
            },
            {
                path: 'entregas',
                component: EntregasComponent
            },
            {
                path: 'inventarios',
                component: InventariosComponent
            },
            {
                path: 'perfil',
                component: PerfilComponent
            },
            {
                path: 'mis-entregas',
                component: MisEntregasComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
