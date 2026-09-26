import { Component, inject, signal,HostListener } from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Auth } from '../../core/services/auth/auth.service';

import { selectCartCount } from '../../store/carts/cart.selectors';

import {
  selectWishlistCount
} from '../../store/wishlists/wishlists.selectors';

import { Store } from '@ngrx/store';

import {
  AsyncPipe
} from '@angular/common';
import { ToastService } from '../../core/services/toast/toast';


@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    FormsModule
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class Navbar {

  private auth = inject(Auth);

  private store = inject(Store);

  private router = inject(Router);
  private toastService=inject(ToastService)

   //cart count
  cartCount$ = this.store.select(
    selectCartCount
  );

  
  //wishlist count
  wishlistCount$ = this.store.select(
    selectWishlistCount
  );

  //logged in user
  user = this.auth.currentUser;


  isProfileOpen = signal(false);


  isCategoriesOpen = signal(false);


  isMobileMenuOpen = signal(false);


  //search

  isSearchOpen = signal(false);

  searchText = '';


 //profile

  toggleProfile(): void {

    this.isProfileOpen.update(
      value => !value
    );

  }


  closeProfile(): void {

    this.isProfileOpen.set(false);

  }


//categories

  toggleCategories(): void {

    this.isCategoriesOpen.update(
      value => !value
    );

  }


  closeCategories(): void {

    this.isCategoriesOpen.set(false);

  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (!target.closest('.navbar-dropdown')) {
      this.isSearchOpen.set(false);
      this.isCategoriesOpen.set(false);
      this.isProfileOpen.set(false);
    }

  }


//mobile menu
  toggleMobileMenu(): void {

    this.isMobileMenuOpen.update(
      value => !value
    );

  }


//search

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

//logout
  logout(): void {

    this.auth.logout();
    this.toastService.success(
      'Logged out successfully'
    );

    this.router.navigate(
      ['/home']
    );

  }

}