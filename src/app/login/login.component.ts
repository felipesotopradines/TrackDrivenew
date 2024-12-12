import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  onLogin() {
    // Hacer la petición GET a la API para buscar el usuario con el email y password
    const apiUrl = getServerUrl();
    this.http
      .get(`${apiUrl}/usuarios/login?email=${this.email}&password=${this.password}`)
      .subscribe(
        (response: any) => {
          if (response) {
            // Guardar solo datos necesarios en localStorage (sin la contraseña)
            localStorage.setItem(
              'user',
              JSON.stringify({
                id: response.id,
                nombre: response.nombre,
                email: response.email,
              })
            );
            localStorage.setItem('token', 'fake-jwt-token'); // Simular un token

            //console.log('Login exitoso');
            this.router.navigate(['/main']);
            // Navegar al MainComponent pasando el nombre del usuario
            //this.router.navigate(['/main'], { state: { name: response.nombre } });
          } else {
            alert('Correo o contraseña incorrectos');
          }
        },
        (error) => {
          // Mostrar el error completo en un alert para debug
          if (error.error && error.error.error) {
            alert('Error en la autenticación: ' + error.error.error);
          } else {
            alert('Error desconocido al autenticarse');
          }
          console.error('Error en la autenticación:', error);
        }
      );
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToServerConfig() {
    //console.log('Navegando a la configuración del servidor...');
    this.router.navigate(['/server-config']);
  }
  
}
