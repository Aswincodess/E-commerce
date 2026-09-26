import { Component,inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive,RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth.service';
import { Toast } from '../../../shared/toast/toast.component';
import { ToastService } from '../../../core/services/toast/toast';
@Component({
  selector: 'app-admin',
  imports: [RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Toast
    ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class Admin {

  private router = inject(Router);
  private auth = inject(Auth);
  private toastService = inject(ToastService);;

  logout(): void {

    this.auth.logout();

    this.toastService.success(
      'Logged out successfully.'
    );

    this.router.navigate(['/login']);

  }

}
