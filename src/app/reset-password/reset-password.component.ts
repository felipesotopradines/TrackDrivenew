import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getServerUrl } from '../helpers/getIP.helper';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onResetPassword() {
    if (this.newPassword === this.confirmPassword) {
      const payload = {
        email: this.email,
        newPassword: this.newPassword
      };

      const apiUrl = getServerUrl();
      this.http.put(`${apiUrl}/usuarios/reset-password`, payload)
        .subscribe(
          (response) => {
            alert('Contraseña restablecida con éxito');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error al restablecer la contraseña:', error);
            alert('Error al restablecer la contraseña: ' + (error.error?.error || 'Error desconocido'));
          }
        );
    } else {
      alert('Las contraseñas no coinciden');
    }
  }
}