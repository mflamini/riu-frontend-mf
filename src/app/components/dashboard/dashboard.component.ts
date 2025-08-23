import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Inicio', icon: '/home.svg' },
    {
      path: '/dashboard/heroes',
      label: 'Heroes',
      icon: '/hero.svg',
    },
  ];

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
