import { Component,inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCartProducts } from '../../../store/carts/cart.selectors';
import { AsyncPipe } from '@angular/common';
import { selectCartTotal } from '../../../store/carts/cart.selectors';
import { removeFromCart,increaseQuantity,decreaseQuantity,clearCart } from '../../../store/carts/cart.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart.component',
  imports: [AsyncPipe,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
 
    private store = inject(Store);
    cartProducts$ = this.store.select(selectCartProducts);
    cartTotal$ = this.store.select(selectCartTotal);

    increase(productId: number){
      this.store.dispatch(increaseQuantity({ productId }))
    }

    decrease(productId:number){
      this.store.dispatch(decreaseQuantity({ productId }))
    }

    remove(productId: number){
      this.store.dispatch(removeFromCart({ productId }))
    }

    clear(){
      this.store.dispatch(clearCart());
    }
}
