import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  selectCartProducts,
  selectCartTotal
} from '../../../store/carts/cart.selectors';

import { AsyncPipe } from '@angular/common';

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '../../../store/carts/cart.actions';

import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { ToastService } from '../../../core/services/toast';

import { take } from 'rxjs';

@Component({
  selector: 'app-cart.component',
  imports: [
    AsyncPipe,
    RouterLink,
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  private store = inject(Store);
  private toastService = inject(ToastService);

  cartProducts$ =
    this.store.select(selectCartProducts);

  cartTotal$ =
    this.store.select(selectCartTotal);


  increase(productId: number) {

    this.cartProducts$
      .pipe(take(1))
      .subscribe(products => {

        const product = products.find(
          item => item.id === productId
        );

        if (!product) {

          this.toastService.error(
            'Unable to update product quantity.'
          );

          return;
        }


        // Maximum quantity per customer
        if (
          product.quantity >=
          product.maxQuantity
        ) {

          this.toastService.error(
            `You can purchase a maximum of ${product.maxQuantity} units of this product.`
          );

          return;
        }


        // Available stock check
        if (
          product.quantity >=
          product.stock
        ) {

          this.toastService.error(
            'No more stock is available.'
          );

          return;
        }


        this.store.dispatch(
          increaseQuantity({
            productId
          })
        );

      });
  }


  decrease(productId: number) {

    this.store.dispatch(
      decreaseQuantity({ productId })
    );
  }


  remove(productId: number) {

    this.store.dispatch(
      removeFromCart({ productId })
    );

    this.toastService.success(
      'Item removed from cart'
    );
  }


  clear() {

    this.store.dispatch(
      clearCart()
    );
    this.toastService.success(
      'Cart cleared successfully'
    );

  }

  getProductImage(item: any): string {
    return Array.isArray(item.image)
      ? item.image[0]
      : item.image;
  }

}