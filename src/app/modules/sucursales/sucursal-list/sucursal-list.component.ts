import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getServerUrl } from '../../../helpers/getIP.helper';

@Component({
  selector: 'app-sucursal-list',
  templateUrl: './sucursal-list.component.html',
  styleUrls: ['./sucursal-list.component.scss'],
})
export class SucursalListComponent implements OnInit {

  sucursales: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadSucursales();
  }

  loadSucursales() {
    const apiUrl = getServerUrl();
    this.http.get(`${apiUrl}/sucursales`).subscribe(
      (response: any) => {
        this.sucursales = response;
      },
      (error) => {
        console.error('Error al cargar las sucursales:', error);
      }
    );
  }

  // Función para ver los detalles de la sucursal
  viewDetails(sucursal: any) {
    this.router.navigate(['/sucursal-details', sucursal.id]);
  }
}
