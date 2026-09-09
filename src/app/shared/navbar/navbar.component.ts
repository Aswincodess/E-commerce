import { Component, inject, signal } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Auth } from '../../core/services/auth.service';

import { selectCartCount } from '../../store/carts/cart.selectors';

import {
  selectWishlistCount
} from '../../store/wishlists/wishlists.selectors';

import { Store } from '@ngrx/store';

import {
  AsyncPipe,
  NgIf
} from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgIf,
    FormsModule
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class Navbar {

  private auth = inject(Auth);

  private store = inject(Store);

  private router = inject(Router);


  // --------------------------------
  // Cart Count
  // --------------------------------

  cartCount$ = this.store.select(
    selectCartCount
  );


  // --------------------------------
  // Wishlist Count
  // --------------------------------

  wishlistCount$ = this.store.select(
    selectWishlistCount
  );


  // --------------------------------
  // Profile Dropdown
  // --------------------------------

  isProfileOpen = signal(false);


  // --------------------------------
  // Mobile Menu
  // --------------------------------

  isMobileMenuOpen = signal(false);


  // --------------------------------
  // Search
  // --------------------------------

  isSearchOpen = signal(false);

  searchText = '';


  // --------------------------------
  // Logged-in User
  // --------------------------------

  user$ = this.auth.currentUser$;


  // --------------------------------
  // Profile
  // --------------------------------

  toggleProfile(): void {

    this.isProfileOpen.update(
      value => !value
    );

  }


  closeProfile(): void {

    this.isProfileOpen.set(false);

  }


  // --------------------------------
  // Mobile Menu
  // --------------------------------

  toggleMobileMenu(): void {

    this.isMobileMenuOpen.update(
      value => !value
    );

  }


  // --------------------------------
  // Search
  // --------------------------------

  toggleSearch(): void {

    this.isSearchOpen.update(
      value => !value
    );

  }


  searchProducts(): void {

    const search = this.searchText.trim();


    // Empty search
    if (!search) {

      this.router.navigate(
        ['/products']
      );

      this.isSearchOpen.set(false);

      return;
    }


    // Search products
    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: search
        }
      }
    );


    this.isSearchOpen.set(false);

  }


  clearSearch(): void {

    this.searchText = '';

  }


  // --------------------------------
  // Logout
  // --------------------------------

  logout(): void {

    this.auth.logout();

    this.router.navigate(
      ['/home']
    );

  }

}