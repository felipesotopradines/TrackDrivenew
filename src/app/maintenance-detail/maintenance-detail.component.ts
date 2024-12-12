import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-maintenance-detail',
  templateUrl: './maintenance-detail.component.html',
  styleUrls: ['./maintenance-detail.component.scss'],
})
export class MaintenanceDetailComponent {
  @Input() maintenance: any; // Recibe los datos del mantenimiento

  constructor(private modalController: ModalController) { }

  getStatusColor(status: string): string {
    //console.log(status);
    switch (status) {
      case 'Satisfactorio':
        return '#4CAF50'; // Verde
      case 'EnProgreso':
        return '#2196F3'; // Azul
      case 'Cancelado':
        return '#F44336'; // Rojo
      case 'EnPausa':
        return '#FF9800'; // Naranja
      case 'Pendiente':
        return '#9E9E9E'; // Gris
      default:
        return '#607D8B'; // Azul grisáceo (por defecto)
    }
  }


  closeModal() {
    this.modalController.dismiss(); // Cierra el modal
  }
}
