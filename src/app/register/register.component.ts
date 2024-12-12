import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Import custom Helper
import { passValidator } from '../helpers/validation.helper';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onRegister() {
    if (this.password === this.confirmPassword) {

      // Validamos con helper
      // const isValid = passValidator(this.password);
      // console.log('Is password valid?', isValid);
      // if (!isValid) {
      //   alert('La contraseña no cumple con los requisitos mínimos.');
      //   return;
      // }

      // Construir el objeto de usuario
      const user = {
        nombre: this.name,
        email: this.email,
        password: this.password
      };

      // Hacer la petición POST al backend
      const apiUrl = getServerUrl();
      this.http.post(`${apiUrl}/usuarios`, user)
        .subscribe(
          (response) => {
            alert('Registro exitoso');
            // Redirigir al usuario a la página de login después del registro
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error al registrar el usuario:', error);
            alert('Error al registrar el usuario: ' + (error.error?.error || 'Error desconocido'));
          }
        );

    } else {
      alert('Las contraseñas no coinciden');
    }
  }
}
