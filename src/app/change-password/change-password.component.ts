import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Redirigir al usuario a la página de login si no está autenticado
      alert('Por favor, inicia sesión para cambiar tu contraseña.');
      this.router.navigate(['/login']);
    }
  }

  onChangePassword() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('No se encontró ningún usuario registrado. Por favor, inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    // Validar que las contraseñas coincidan
    if (this.newPassword !== this.confirmPassword) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    // Realizar la solicitud PUT para cambiar la contraseña en el backend
    const apiUrl = getServerUrl();
    this.http
      .put(`${apiUrl}/usuarios/${userId}/password`, {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe(
        () => {
          alert('Contraseña cambiada con éxito');
          this.router.navigate(['/main']);
        },
        (error) => {
          console.error('Error al cambiar la contraseña:', error);
          alert('Error al cambiar la contraseña: ' + (error.error?.message || 'Error desconocido'));
        }
      );
  }
}
