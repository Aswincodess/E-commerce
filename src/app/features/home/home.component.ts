import { Component, inject } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { CategoryCard } from '../../shared/category-card/category-card';

import { selectFeaturedProducts } from '../../store/products/products.selectors';

import { addToCart } from '../../store/carts/cart.actions';

import { addToWishlist,removeFromWishlist } from '../../store/wishlists/wishlists.actions';

import { selectWishlistProductIds } from '../../store/wishlists/wishlists.selectors';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    RouterLink,
    CategoryCard,
    AsyncPipe,
    DecimalPipe,
   
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home {

  private store = inject(Store);

  // Featured products
  featuredProducts$ =
    this.store.select(selectFeaturedProducts);

  // Wishlist product IDs
  wishlistProductIds$ =
    this.store.select(selectWishlistProductIds);


  // --------------------------------
  // Add To Cart
  // --------------------------------

  addToCart(product: any) {

    this.store.dispatch(
      addToCart({ product })
    );

  }


  // --------------------------------
  // Toggle Wishlist
  // --------------------------------

  toggleWishlist(productId: number, wishlistIds: number[]) {

    if (wishlistIds.includes(productId)) {

      this.store.dispatch(
        removeFromWishlist({ productId })
      );

    } else {

      this.store.dispatch(
        addToWishlist({ productId })
      );

    }

  }

}