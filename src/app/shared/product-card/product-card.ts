import { Component, Input, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { take } from 'rxjs';

import { AsyncPipe } from '@angular/common';

import { products } from '../../core/models/product.model';

import {
  addToWishlist,
  removeFromWishlist,
  
} from '../../store/wishlists/wishlists.actions';

import {
  selectIsInWishlist,selectWishlistState
} from '../../store/wishlists/wishlists.selectors';

import { addToCart } from '../../store/carts/cart.actions';

import { ToastService } from '../../core/services/toast/toast';

import { Auth } from '../../core/services/auth/auth.service';

import {
  selectCartItems
} from '../../store/carts/cart.selectors';


@Component({
  selector: 'app-product-card',

  standalone: true,

  imports: [
    RouterLink,
    AsyncPipe
  ],

  templateUrl: './product-card.html'
})


export class ProductCard {

  private store = inject(Store);

  private router = inject(Router);

  private toastService =
    inject(ToastService);

  private auth = inject(Auth);


  @Input() product!: products;



  addToCart(event: Event) {

    event.preventDefault();

    event.stopPropagation();


    // User must be logged in
    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;

    }


    // Product validation
    if (!this.product) {

      this.toastService.error(
        'Unable to add this product to cart.'
      );

      return;

    }


    // Stock validation
    if (this.product.stock <= 0) {

      this.toastService.error(
        'This product is currently out of stock.'
      );

      return;

    }


    // Get current cart items
    this.store
      .select(selectCartItems)
      .pipe(take(1))
      .subscribe(items => {

        const existingItem =
          items.find(
            item =>
              String(item.productId) ===
              String(this.product.id)
          );


        // Product is already in cart
        if (existingItem) {

          this.toastService.success(
            'Product is already in your cart'
          );

          return;

        }


        // Add product with quantity 1
        this.store.dispatch(
          addToCart({
            product: this.product
          })
        );


        this.toastService.success(
          'Added to cart'
        );

      });

  }



  toggleWishlist(event: Event) {

    event.preventDefault();

    event.stopPropagation();


    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;

    }


    this.store
      .select(
        selectIsInWishlist(
          this.product.id
        )
      )
      .pipe(take(1))
      .subscribe(isInWishlist => {

        if (isInWishlist) {

          this.store.dispatch(
            removeFromWishlist({
              productId: this.product.id
            })
          );
          this.toastService.success(
            'Removed from wishlist'
          );


        } else {

          this.store
            .select(selectWishlistState)

          this.store.dispatch(
            addToWishlist({
              productId: this.product.id
            })
          );
          this.toastService.success(
            'Added to wishlist'
          );

        }

      });

  }



  isInWishlist$() {

    return this.store.select(
      selectIsInWishlist(
        this.product.id
      )
    );

  }



  onImageError(event: Event) {

    const img =
      event.target as HTMLImageElement;

    img.src =
      'assets/images/placeholder-product.png';


      
  }

  getProductImage(product: products): string {
    if (Array.isArray(product.image)) {
      return product.image[0];
    }

    return product.image;
  }

}