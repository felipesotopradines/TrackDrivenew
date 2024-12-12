import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-my-vehicles',
  templateUrl: './my-vehicles.component.html',
  styleUrls: ['./my-vehicles.component.scss'],
})
export class MyVehiclesComponent implements OnInit {

  vehicles: any[] = [];
  userId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController // Inyección de AlertController
  ) { }

  ngOnInit() {
    this.checkUserSession(); // Validar si el usuario está autenticado
    if (this.userId) {
      this.loadVehiclesFromAPI(); // Cargar vehículos solo si hay un usuario autenticado
    }
  }

  // Validar si la sesión está activa
  checkUserSession() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Obtener los vehículos de la API filtrados por user_id
  loadVehiclesFromAPI() {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/misVehiculos/user/${this.userId}`).subscribe(
      (response: any) => {
        this.vehicles = response.map((vehicle: any) => {
          vehicle.frontImage = vehicle.front_b64
            ? `data:image/jpeg;base64,${vehicle.front_b64}`
            : 'assets/img/placeholder_car.jpg';
          return vehicle;
        });
      },
      (error) => {
        console.error('Error al cargar los vehículos:', error);
      }
    );
  }

  // Refrescar los datos
  refreshData() {
    this.loadVehiclesFromAPI(); // Vuelve a llamar a la función que carga los datos
  }

  // Ver detalles del vehículo
  viewDetails(vehicle: any) {
    this.router.navigate(['/vehicle-details', vehicle.id]);
  }

  // Modificar el vehículo
  editVehicle(vehicle: any) {
    this.router.navigate(['/modify-vehicle', vehicle.id]);
  }

  // Redirigir a la vista de mantenimientos
  viewMaintenance(vehicle: any) {
    this.router.navigate([`/vehicle-details/${vehicle.id}/maintenance`]);
  }

  // Eliminar el vehículo
  async deleteVehicle(vehicle: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar el vehículo \n ${vehicle.marca} ${vehicle.modelo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            const apiUrl = getServerUrl();
            this.http.delete(`${apiUrl}/misVehiculos/${vehicle.id}`).subscribe(
              () => {
                // Filtrar el vehículo eliminado de la lista local
                this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
                //console.log('Vehículo eliminado correctamente');
              },
              (error) => {
                console.error('Error al eliminar el vehículo:', error);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
