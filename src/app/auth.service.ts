import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de importar HttpClient para hacer solicitudes HTTP
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    return this.http.post<any>('API_ENDPOINT/change-password', body); // Cambia 'API_ENDPOINT' por tu URL de backend
  }
}
