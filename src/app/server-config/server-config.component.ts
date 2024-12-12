import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-config',
  templateUrl: './server-config.component.html',
  styleUrls: ['./server-config.component.scss'],
})
export class ServerConfigComponent implements OnInit, AfterViewInit {
  serverConfig = { ip: 'localhost', port: '3000' }; // Valores predeterminados

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Recuperar la configuración del Local Storage al cargar el componente
    const savedConfig = JSON.parse(localStorage.getItem('serverConfig') || '{}');
    this.serverConfig.ip = savedConfig.ip || 'localhost';
    this.serverConfig.port = savedConfig.port || '3000';
  }

  ngAfterViewInit() {
    // Intentar enfocar el primer campo de entrada (IP)
    const firstInput = this.el.nativeElement.querySelector('ion-input');
    if (firstInput) {
      firstInput.setFocus();
    } else {
      console.warn('No se encontró el campo de entrada para enfocar.');
    }
  }

  saveServerConfig() {
    // Guardar la configuración en Local Storage
    localStorage.setItem('serverConfig', JSON.stringify(this.serverConfig));
    alert('Configuración guardada correctamente');
    // Redirigir al módulo de Login
    this.router.navigate(['/login']);
  }
}
