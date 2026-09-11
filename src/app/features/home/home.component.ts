import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { CategoryCard } from '../../shared/category-card/category-card';

import { selectFeaturedProducts } from '../../store/products/products.selectors';

import { addToCart } from '../../store/carts/cart.actions';

import {
  addToWishlist,
  removeFromWishlist
} from '../../store/wishlists/wishlists.actions';

import { selectWishlistProductIds } from '../../store/wishlists/wishlists.selectors';

import { Auth } from '../../core/services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    RouterLink,
    CategoryCard,
    AsyncPipe,
    DecimalPipe
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home {

  private store = inject(Store);

  private router = inject(Router);

  private auth = inject(Auth);


  // --------------------------------
  // Featured Products
  // --------------------------------

  featuredProducts$ =
    this.store.select(selectFeaturedProducts);


  // --------------------------------
  // Wishlist Product IDs
  // --------------------------------

  wishlistProductIds$ =
    this.store.select(selectWishlistProductIds);


  // --------------------------------
  // Add To Cart
  // --------------------------------

  addToCart(product: any) {

    // Guest → Login
    if (!this.auth.currentUser) {

      this.router.navigate(['/login']);

      return;
    }


    // Logged-in user → Add to cart
    this.store.dispatch(
      addToCart({ product })
    );

  }


  // --------------------------------
  // Toggle Wishlist
  // --------------------------------

  toggleWishlist(
    productId: number,
    wishlistIds: number[]
  ) {

    // Guest → Login
    if (!this.auth.currentUser) {

      this.router.navigate(['/login']);

      return;
    }


    // Logged-in user → Toggle wishlist
    if (wishlistIds.includes(productId)) {

      this.store.dispatch(
        removeFromWishlist({
          productId
        })
      );

    } else {

      this.store.dispatch(
        addToWishlist({
          productId
        })
      );

    }

  }

}