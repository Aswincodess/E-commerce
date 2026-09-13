import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartProducts } from '../../../store/carts/cart.selectors';
import { AsyncPipe } from '@angular/common';
import { selectCartTotal } from '../../../store/carts/cart.selectors';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '../../../store/carts/cart.actions';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-cart.component',
  imports: [AsyncPipe, RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  private store = inject(Store);
  private toastService = inject(ToastService);

  cartProducts$ = this.store.select(selectCartProducts); //gets the products that should be displayed in the cart.
  cartTotal$ = this.store.select(selectCartTotal);


  increase(productId: number) {
    this.store.dispatch(
      increaseQuantity({ productId })
    );
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

    this.toastService.success('Item removed from cart');
  }


  clear() {
    this.store.dispatch(
      clearCart()
    );
  }

}