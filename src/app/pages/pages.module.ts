import { NgModule } from '@angular/core';


// Rutas
import { PAGES_ROUTES } from './pages.routes';

// Módulos
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


// Componente Principal
import { PagesComponent } from './pages.component';

// Componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { CuentasComponent } from './cuentas/cuentas/cuentas.component';
import { ClientesComponent } from './cuentas/clientes/clientes.component';
import { TransaccionesComponent } from './cuentas/transacciones/transacciones.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsuariosComponent,
    AccountSettingsComponent,
    CuentasComponent,
    ClientesComponent,
    TransaccionesComponent
  ],
  exports: [
    DashboardComponent,
    AngularMultiSelectModule
  ],
  imports: [
    CommonModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule
  ],
  providers: [],
  bootstrap: []
})
export class PagesModule { }
