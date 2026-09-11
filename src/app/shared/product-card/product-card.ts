import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { products } from '../../core/models/product.model';

import {
  addToWishlist,
  removeFromWishlist
} from '../../store/wishlists/wishlists.actions';

import {
  selectIsInWishlist
} from '../../store/wishlists/wishlists.selectors';

import { addToCart } from '../../store/carts/cart.actions';
import { ToastService } from '../../core/services/toast';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './product-card.html'
})
export class ProductCard {

  private store = inject(Store);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private auth = inject(Auth);

  @Input() product!: products;


  // --------------------------------
  // Add To Cart
  // --------------------------------

  addToCart(event: Event) {

    event.preventDefault();
    event.stopPropagation();

    // Guest → Login
    if (!this.auth.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    // Logged-in user → Add to cart
    this.store.dispatch(
      addToCart({
        product: this.product
      })
    );

    this.toastService.success('Added to cart');
  }


  // --------------------------------
  // Wishlist
  // --------------------------------

  toggleWishlist(event: Event) {

    event.preventDefault();
    event.stopPropagation();

    // Guest → Login
    if (!this.auth.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    // Logged-in user → Wishlist
    this.store
      .select(selectIsInWishlist(this.product.id))
      .pipe(take(1))
      .subscribe(isInWishlist => {

        if (isInWishlist) {

          this.store.dispatch(
            removeFromWishlist({
              productId: this.product.id
            })
          );

        } else {

          this.store.dispatch(
            addToWishlist({
              productId: this.product.id
            })
          );

        }

      });
  }

  // --------------------------------
  // Wishlist State
  // --------------------------------

  isInWishlist$() {

    return this.store.select(
      selectIsInWishlist(this.product.id)
    );

  }


  // --------------------------------
  // Image Error
  // --------------------------------

  onImageError(event: Event) {

    const img = event.target as HTMLImageElement;

    img.src = 'assets/images/placeholder-product.png';

  }

}