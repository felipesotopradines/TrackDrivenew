import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-register-vehicle',
  templateUrl: './register-vehicle.component.html',
  styleUrls: ['./register-vehicle.component.scss'],
})
export class RegisterVehicleComponent implements OnInit {

  vehicle = {
    model: '',
    brand: '',
    year: '',
    color: '',
    licensePlate: '',
    mileage: ''
  };

  selectedSection: 'frontal' | 'trasera' | 'interior' = 'frontal'; // Sección activa

  vehicleImages: { frontal: string; trasera: string; interior: string } = {
    frontal: '',
    trasera: '',
    interior: ''
  };

  brands: any[] = [];
  models: any[] = [];
  colors: any[] = [];

  // Control de modal
  isModalOpen = false;

  constructor(private platform: Platform, private navController: NavController, private http: HttpClient) { }

  async ngOnInit() {

    this.loadBrands();
    this.loadColors();

    
    //if (this.platform.is('hybrid')) {
    //  await this.checkCameraPermissions();
    //}
  }

  async checkCameraPermissions() {
    const permissions = await Camera.requestPermissions();
    if (permissions.camera !== 'granted') {
      console.error('Permiso de cámara denegado');
    }
  }

  async takePicture(section: 'frontal' | 'trasera' | 'interior') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image && image.dataUrl) {
        this.vehicleImages[section] = image.dataUrl;
      }

    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  loadBrands() {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/marcas`).subscribe(
      (response: any) => {
        this.brands = response;
      },
      (error) => {
        console.error('Error al cargar marcas:', error);
      }
    );
  }

  loadModels(brand: string) {
    this.models = []; // Limpia los modelos
    this.vehicle.model = ''; // Reinicia el modelo seleccionado

    if (!brand) {
      return; // No realiza la llamada si no hay marca seleccionada
    }

    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/modelos/marca/${brand}`).subscribe(
      (response: any) => {
        this.models = response;
      },
      (error) => {
        console.error('Error al cargar modelos:', error);
      }
    );
  }

  loadColors() {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/colores`).subscribe(
      (response: any) => {
        this.colors = response;
      },
      (error) => {
        console.error('Error al cargar colores:', error);
      }
    );
  }

  // Función para validar los campos del formulario
  validateForm(): boolean {
    let isValid = true;
    const formFields = document.querySelectorAll('ion-input, ion-select');  // Seleccionar todos los inputs y selects

    // Verificar si hay campos vacíos
    formFields.forEach((field: any) => {
      if (!field.value) {
        isValid = false;
        field.classList.add('error');  // Agregar la clase 'error' a los campos vacíos
      } else {
        field.classList.remove('error');  // Remover la clase 'error' si el campo está completo
      }
    });

    // Verificar que todas las imágenes estén seleccionadas
    if (!this.vehicleImages.frontal || !this.vehicleImages.trasera || !this.vehicleImages.interior) {
      isValid = false;
      alert('Debe capturar todas las imágenes (Frontal, Trasera, e Interior).');
    }

    return isValid;
  }

  // Guardar datos (enviar a la API)
  confirmRegister() {
    if (!this.validateForm()) {
      // Si la validación falla, mostrar una alerta
      alert('Complete todos los campos antes de continuar.');
    } else {
      const confirmRegister = window.confirm('¿Desea guardar estos datos?');
      if (confirmRegister) {
        // Preparar los datos para el envío
        const requestData = {
          user_id: JSON.parse(localStorage.getItem('user') || '{}').id,
          marca: this.vehicle.brand,
          modelo: this.vehicle.model,
          ano: this.vehicle.year,
          color: this.vehicle.color,
          patente: this.vehicle.licensePlate,
          kilometraje: this.vehicle.mileage,
          front: this.vehicleImages.frontal,
          back: this.vehicleImages.trasera,
          inside: this.vehicleImages.interior
        };

        // Enviar los datos al backend
        const apiUrl = getServerUrl();
        this.http.post(`${apiUrl}/misVehiculos`, requestData).subscribe(
          (response) => {
            alert('Vehículo registrado con éxito.');
            this.goBackToMain();
          },
          (error) => {
            const msgError = error?.error?.error;

            if (Array.isArray(msgError)) {
              // Caso: msgError es un array
              console.error('Error al registrar el vehículo (array):', msgError);
              const mensajes = msgError.join('\n * '); // Unir mensajes con saltos de línea
              alert(`Hubo un error al registrar el vehículo:\n\n * ${mensajes}`);
            } else if (typeof msgError === 'string') {
              // Caso: msgError es un string
              console.error('Error al registrar el vehículo (string):', msgError);
              alert(`Hubo un error al registrar el vehículo:\n\n * ${msgError}`);
            } else {
              // Caso: cualquier otro tipo o estructura inesperada
              console.error('Error al registrar el vehículo (genérico):', error);
              alert('Hubo un error al registrar el vehículo. Por favor, inténtelo de nuevo.');
            }
          }
        );
      }
    }
  }

  goBackToMain() {
    this.navController.navigateRoot('/main');
  }
}
