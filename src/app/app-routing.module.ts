import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MainComponent } from './main/main.component';
import { RegisterVehicleComponent } from './register-vehicle/register-vehicle.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { MyVehiclesComponent } from './my-vehicles/my-vehicles.component';
import { ModifyVehicleComponent } from './modify-vehicle/modify-vehicle.component';
import { SucursalListComponent } from './modules/sucursales/sucursal-list/sucursal-list.component';
import { SucursalDetailsComponent } from './modules/sucursales/sucursal-details/sucursal-details.component';
import { ServerConfigComponent } from './server-config/server-config.component';
import { MaintenanceComponent } from './maintenance/maintenance.component'; 

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'server-config', component: ServerConfigComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'main', component: MainComponent },
  { path: 'sucursales', component: SucursalListComponent },
  { path: 'sucursal-details/:id', component: SucursalDetailsComponent },
  { path: 'modify-vehicle/:id', component: ModifyVehicleComponent },
  { path: 'register-vehicle', component: RegisterVehicleComponent }, // Nueva ruta para el registro de vehículos
  //{ path: 'vehicle-details', component: VehicleDetailsComponent },   // Nueva ruta para la ficha de vehículos
  { path: 'vehicle-details/:id', component: VehicleDetailsComponent },  // Ruta para ver detalles de vehículo
  { path: 'vehicle-details/:id/maintenance', component: MaintenanceComponent }, // Nueva ruta para mantenimientos
  { path: 'my-vehicles', component: MyVehiclesComponent },           // Nueva ruta para "Mis Vehículos"
  { path: '', redirectTo: '/login', pathMatch: 'full' },              // Ruta por defecto
  { path: '**', redirectTo: '/login' },                               // Manejo de rutas no encontradas
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
