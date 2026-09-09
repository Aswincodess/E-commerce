import { Component, inject } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';

import { Navbar } from './shared/navbar/navbar.component';
import { Footer } from './shared/footer/footer.component';

import { loadProducts } from './store/products/products.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);
  private store = inject(Store);

  showLayout = true;

  constructor() {

    // Load products when application starts
    this.store.dispatch(loadProducts());

    // Hide Navbar/Footer on Login and Register
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {

        this.showLayout =
          event.urlAfterRedirects !== '/login' &&
          event.urlAfterRedirects !== '/register';

      });

  }
}