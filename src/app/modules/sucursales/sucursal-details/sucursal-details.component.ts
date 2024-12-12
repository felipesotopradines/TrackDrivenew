import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';


import { getServerUrl } from '../../../helpers/getIP.helper';

@Component({
  selector: 'app-sucursal-details',
  templateUrl: './sucursal-details.component.html',
  styleUrls: ['./sucursal-details.component.scss'],
})
export class SucursalDetailsComponent implements OnInit {

  sucursal: any = null;
  mapUrl: SafeResourceUrl = ''; // URL segura del mapa

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadSucursalDetails(id);
  }

  loadSucursalDetails(id: number) {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/sucursales/${id}`).subscribe(
      (response: any) => {
        // Verificar si la respuesta es un array o un objeto
        this.sucursal = Array.isArray(response) ? response[0] : response;
        
        if (this.sucursal) {
          this.loadMap();
        } else {
          console.error('Sucursal no encontrada.');
        }
      },
      (error) => {
        console.error('Error al cargar los detalles de la sucursal:', error);
      }
    );
  }

  // Cargar el mapa utilizando Google Maps API
  loadMap() {
    if (this.sucursal && this.sucursal.latitud && this.sucursal.longitud) {
      const lat = this.sucursal.latitud;
      const lng = this.sucursal.longitud;
      const apiKey = environment.googleMapsApiKey;

      const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=16`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    } else {
      console.warn('La sucursal no tiene coordenadas válidas.');
    }
  }
}
