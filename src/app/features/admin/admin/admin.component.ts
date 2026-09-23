import { Component,inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive,RouterOutlet } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';
@Component({
  selector: 'app-admin',
  imports: [RouterLink,
    RouterLinkActive,
    RouterOutlet
    ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class Admin {

  private router = inject(Router);
  private auth = inject(Auth);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
