import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-maintenance-add',
  templateUrl: './maintenance-add.component.html',
  styleUrls: ['./maintenance-add.component.scss'],
})
export class MaintenanceAddComponent implements OnInit {
  @Input() vehicleId!: number; // ID del vehículo para asociar el mantenimiento

  jobs: any[] = []; // Lista de trabajos
  newMaintenance = {
    jobID: null, // Enlaza correctamente el trabajo seleccionado
    jobName: '',
    dateStart: null, // Fecha de inicio inicial
    dateEnd: null,   // Fecha de término inicial
    Mount: 0,        // Se asignará al seleccionar el trabajo
    Status: 'Pendiente', // Estado inicial por defecto
    Message: ''
  };

  constructor(
    private modalController: ModalController,
    private alertController: AlertController, // Inyección del AlertController
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadJobs(); // Cargar trabajos al iniciar el modal
  }

  // Método para cerrar el modal
  closeModal() {
    this.modalController.dismiss();
  }

  // Método para cargar los trabajos desde el endpoint
  async loadJobs() {
    const apiUrl = getServerUrl();
    try {
      const response: any = await this.http.get(`${apiUrl}/maintence/getJobs`).toPromise();
      this.jobs = response; // Asignar la lista de trabajos
      //console.log('Trabajos cargados:', this.jobs);
    } catch (error) {
      this.showErrorAlert('No se pudieron cargar los trabajos. Por favor, intente nuevamente.');
    }
  }

  // Método para mostrar un alert en caso de error
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para asignar el precio del trabajo seleccionado
  onJobChange(selectedJobID: number) {
    const selectedJob = this.jobs.find((job) => job.ID === selectedJobID);
    if (selectedJob) {
      this.newMaintenance.Mount = selectedJob.Price; // Actualiza el monto
      this.newMaintenance.jobName = selectedJob.Name; // Actualiza el nombre del trabajo
      this.newMaintenance.jobID = selectedJob.ID; // Asegura que el jobID está enlazado
      //console.log('Trabajo seleccionado:', selectedJob);
    } else {
      this.showErrorAlert('No se encontró el trabajo seleccionado.');
    }
  }

  // Método para enviar los datos del nuevo mantenimiento
  submitMaintenance() {
    if (this.newMaintenance.jobName) {
      const apiUrl = getServerUrl();
      const maintenanceData = {
        idVehicle: this.vehicleId,
        dateCreate: new Date().toISOString().split('T')[0], // Fecha actual
        dateStart: this.newMaintenance.dateStart,
        dateEnd: this.newMaintenance.dateEnd,
        mount: this.newMaintenance.Mount,
        status: this.newMaintenance.Status,
        message: this.newMaintenance.Message,
        jobID: this.newMaintenance.jobID,
      };

      this.http.post(`${apiUrl}/maintence/createMaintence`, maintenanceData).subscribe(
        (response: any) => {
          //console.log('Mantenimiento registrado exitosamente:', response);
          this.modalController.dismiss(response);
        },
        (error) => {
          this.showErrorAlert('No se pudo registrar el mantenimiento. Inténtelo nuevamente.');
        }
      );
    }
  }
}
