import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {
    this.checkAuthentication();
  }

  // Método para verificar si el usuario está autenticado
  checkAuthentication() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      // Usuario autenticado, puede navegar a la vista principal
      //console.log('Usuario autenticado:', JSON.parse(user));
      this.router.navigate(['/main']);  // Redirigir al usuario a la vista principal
    } else {
      // Usuario no autenticado, redirigir al login
      this.router.navigate(['/login']);
    }
  }
}
