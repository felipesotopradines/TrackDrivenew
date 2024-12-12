import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss'],
})
export class VehicleDetailsComponent implements OnInit {

  vehicle: any = null; // Aquí guardaremos el vehículo recuperado

  // Opciones para el ion-slides
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    pager: true,
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtenemos el ID del vehículo desde la URL
    const vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.loadVehicleDetails(vehicleId);
  }

  // Función para cargar los detalles del vehículo desde la API
  loadVehicleDetails(id: number) {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/misVehiculos/${id}`).subscribe(
      (response: any) => {
        if (response) {
          this.vehicle = response; // Asignamos el vehículo si existe
        }
      },
      (error) => {
        console.error('Error al cargar el vehículo:', error);
      }
    );
  }

  // Función para modificar el vehículo (redirigir a ModifyVehicleComponent)
  editVehicle(vehicle: any) {
    this.router.navigate(['/modify-vehicle', vehicle.id]); // Redirigir a la vista de modificación
  }
}
