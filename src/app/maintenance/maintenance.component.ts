import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { getServerUrl } from '../helpers/getIP.helper';
import { MaintenanceDetailComponent } from '../maintenance-detail/maintenance-detail.component';
import { MaintenanceAddComponent } from '../maintenance-add/maintenance-add.component';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit {
  maintenances: any[] = [];
  vehicleId: number | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.vehicleId) {
      this.loadMaintenances();
    }
  }

  loadMaintenances() {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/maintence/getMaintenceByVehicle/${this.vehicleId}`).subscribe(
      (response: any) => {
        // No se necesita transformar los campos ya que coinciden con el backend
        this.maintenances = response;
      },
      (error) => {
        console.error('Error al cargar los mantenimientos:', error);
      }
    );
  }

  refreshData() {
    this.loadMaintenances();
  }

  async viewDetails(maintenance: any) {
    const modal = await this.modalController.create({
      component: MaintenanceDetailComponent,
      componentProps: { maintenance },
    });

    await modal.present();
  }


  async addMaintenance() {
    const modal = await this.modalController.create({
      component: MaintenanceAddComponent,
      componentProps: { vehicleId: this.vehicleId },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        //console.log('Mantenimiento registrado:', result.data);
        // Opcional: Recargar la lista de mantenimientos
        this.loadMaintenances();
      }
    });

    await modal.present();
  }


  deleteMaintence(maintenance: any) {
    return false
  }
}
