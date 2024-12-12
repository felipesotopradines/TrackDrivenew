import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  name: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.name = user.nombre;
    }
  }

  // Método para confirmar y luego cerrar sesión
  logout() {
    const confirmLogout = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmLogout) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
