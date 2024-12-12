import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getServerUrl } from '../helpers/getIP.helper';
@Component({
  selector: 'app-modify-vehicle',
  templateUrl: './modify-vehicle.component.html',
  styleUrls: ['./modify-vehicle.component.scss'],
})
export class ModifyVehicleComponent implements OnInit {
  vehicleId: number;
  vehicle = {
    modelo: '',
    marca: '',
    ano: '',
    color: '',
    patente: '',
    kilometraje: '',
  };

  selectedSection: 'frontal' | 'trasera' | 'interior' = 'frontal';
  vehicleImages: { frontal: string; trasera: string; interior: string } = {
    frontal: '',
    trasera: '',
    interior: '',
  };

  brands: any[] = [];
  models: any[] = [];
  colors: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.loadVehicleData();
    this.loadBrands();
    this.loadColors();
  }

  loadVehicleData() {
    const apiUrl = getServerUrl();
    this.http
      .get(`${apiUrl}/misVehiculos/${this.vehicleId}`)
      .subscribe(
        (response: any) => {
          this.vehicle = {
            modelo: response.modelo,
            marca: response.marca,
            ano: response.ano,
            color: response.color,
            patente: response.patente,
            kilometraje: response.kilometraje,
          };

          // Cargar los modelos basados en la marca del vehículo cargado
          this.loadModels(this.vehicle.marca);

          // Asignar imágenes en base64 a las secciones correspondientes
          this.vehicleImages = {
            frontal: response.front_b64 ? `data:image/png;base64,${response.front_b64}` : 'assets/img/placeholder_car_front.jpg',
            trasera: response.back_b64 ? `data:image/png;base64,${response.back_b64}` : 'assets/img/placeholder_car_back.jpg',
            interior: response.inside_b64 ? `data:image/png;base64,${response.inside_b64}` : 'assets/img/placeholder_car_inter.png',
          };

          this.loading = false; // Ocultar el spinner una vez que los datos estén cargados
        },
        (error) => {
          console.error('Error al cargar el vehículo:', error);
          this.loading = false; // Ocultar el spinner incluso si hay un error
        }
      );
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
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/modelos/marca/${brand}`).subscribe(
      (response: any) => {
        this.models = response;
        if (this.vehicle.modelo) {
          this.vehicle.modelo =
            this.models.find((m: any) => m.modelo === this.vehicle.modelo)
              ?.modelo || '';
        }
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

  validateForm(): boolean {
    let isValid = true;
    const formFields = document.querySelectorAll('ion-input, ion-select');

    formFields.forEach((field: any) => {
      if (!field.value) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    if (!this.vehicleImages.frontal || !this.vehicleImages.trasera || !this.vehicleImages.interior) {
      isValid = false;
      alert('Debe capturar todas las imágenes (Frontal, Trasera, e Interior).');
    }

    return isValid;
  }

  confirmSave() {
    if (!this.validateForm()) {
      alert('Complete todos los campos antes de continuar.');
    } else {
      const confirmSave = window.confirm('¿Desea guardar estos cambios?');
      if (confirmSave) {
        this.saveVehicle();
      }
    }
  }

  saveVehicle() {
    const vehicleData = {
      user_id: this.vehicleId,
      marca: this.vehicle.marca,
      modelo: this.vehicle.modelo,
      ano: this.vehicle.ano,
      color: this.vehicle.color,
      patente: this.vehicle.patente,
      kilometraje: this.vehicle.kilometraje,
      front: this.vehicleImages.frontal.startsWith('data:image')
        ? this.vehicleImages.frontal
        : null,
      back: this.vehicleImages.trasera.startsWith('data:image')
        ? this.vehicleImages.trasera
        : null,
      inside: this.vehicleImages.interior.startsWith('data:image')
        ? this.vehicleImages.interior
        : null,
    };

    const apiUrl = getServerUrl();
    this.http
      .put(`${apiUrl}/misVehiculos/${this.vehicleId}`, vehicleData)
      .subscribe(
        (response) => {
          alert('Vehículo actualizado con éxito.');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/my-vehicles']);
          });
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
