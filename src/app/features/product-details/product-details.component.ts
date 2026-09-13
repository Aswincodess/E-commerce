
import { Component, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { selectProductById } from '../../store/products/products.selectors';

import {
  addToWishlist,
  removeFromWishlist
} from '../../store/wishlists/wishlists.actions';

import {
  selectIsInWishlist
} from '../../store/wishlists/wishlists.selectors';

import { switchMap, take } from 'rxjs';

import {
  AsyncPipe,
  KeyValuePipe
} from '@angular/common';

import { addToCart } from '../../store/carts/cart.actions';

import { products } from '../../core/models/product.model';
import { ToastService } from '../../core/services/toast';
import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-product-details',
  imports: [
    AsyncPipe,
    KeyValuePipe
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetails {

  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private auth = inject(Auth);

  goBackToProducts() {
    this.router.navigate(['/products']);
  }

  product$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id')!;

      return this.store.select(
        selectProductById(id)
      );
    })
  );

  // Toggle wishlist
  toggleWishlist(productId: number) {

    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }

    this.store
      .select(selectIsInWishlist(productId))
      .pipe(take(1))
      .subscribe(isInWishlist => {

        if (isInWishlist) {

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

      });
  }

  // Check whether product is in wishlist
  isInWishlist(productId: number) {

    return this.store.select(
      selectIsInWishlist(productId)
    );

  }

  

    addProductToCart(product: products) {

      if (!this.auth.currentUser()) {

        this.router.navigate(['/login']);

        return;
      }

      this.store.dispatch(
        addToCart({
          product
        })
      );

      this.toastService.success('Added to cart');
    }
  buyNow(product: products) {

    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }

    this.router.navigate(['/checkout'], {
      state: {
        buyNowProduct: product
      }
    });
  }
  }

