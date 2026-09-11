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
import { loadCart } from './store/carts/cart.actions';
import { loadWishlist } from './store/wishlists/wishlists.actions';
import { Auth } from './core/services/auth.service';
import { Toast } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    Toast
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);
  private store = inject(Store);
  private auth = inject(Auth);

  showLayout = true;

  constructor() {

    // Load products when application starts
    this.store.dispatch(loadProducts());

    // Rehydrate cart & wishlist on refresh
    // if a user is already logged in
    const currentUser = this.auth.currentUser();

    if (currentUser?.id) {

      this.store.dispatch(
        loadCart({
          userId: currentUser.id
        })
      );

      this.store.dispatch(
        loadWishlist({
          userId: currentUser.id
        })
      );

    }

    // Hide Navbar/Footer on Login and Register
    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(
        (event: NavigationEnd) => {

          this.showLayout =
            event.urlAfterRedirects !== '/login' &&
            event.urlAfterRedirects !== '/register';

          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
          });

        }
      );
  }
}