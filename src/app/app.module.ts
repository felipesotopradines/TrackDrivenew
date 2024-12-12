import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';  // Importa MatButtonModule para los botones

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MainComponent } from './main/main.component';
import { MyVehiclesComponent } from './my-vehicles/my-vehicles.component';  // Importa los nuevos componentes
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';  // Importa los nuevos componentes
import { RegisterVehicleComponent } from './register-vehicle/register-vehicle.component';
import { ModifyVehicleComponent } from './modify-vehicle/modify-vehicle.component';
import { SucursalDetailsComponent } from './modules/sucursales/sucursal-details/sucursal-details.component';
import { SucursalListComponent } from './modules/sucursales/sucursal-list/sucursal-list.component';

import { ServerConfigComponent } from './server-config/server-config.component';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceDetailComponent } from './maintenance-detail/maintenance-detail.component';
import { MaintenanceAddComponent } from './maintenance-add/maintenance-add.component';

import { FormatClpPipe } from './pipes/format-clp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    MainComponent,
    MyVehiclesComponent,  // Declara el nuevo componente "MyVehiclesComponent"
    VehicleDetailsComponent,  // Declara el nuevo componente "VehicleDetailsComponent"
    RegisterVehicleComponent,
    ModifyVehicleComponent,
    SucursalDetailsComponent,
    SucursalListComponent,
    ServerConfigComponent,
    MaintenanceComponent,
    MaintenanceDetailComponent,
    MaintenanceAddComponent,
    FormatClpPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,  // Importa el módulo de animaciones
    MatSnackBarModule,  // Importa el módulo de Angular Material SnackBar
    MatButtonModule  // Importa el módulo de botones de Angular Material
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // AGREGAR EL CUSTOM_ELEMENTS_SCHEMA AQUÍ
  bootstrap: [AppComponent]
})
export class AppModule { }
