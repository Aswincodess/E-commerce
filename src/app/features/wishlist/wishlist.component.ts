import {
  Component,
  inject
} from '@angular/core';

import {
  AsyncPipe
} from '@angular/common';

import {
  Store
} from '@ngrx/store';

import {
  selectWishlistProducts
} from '../../store/wishlists/wishlists.selectors';

import {
  removeFromWishlist,
  clearWishlist
} from '../../store/wishlists/wishlists.actions';

import {
  addToCart
} from '../../store/carts/cart.actions';
import { authGuard } from '../../core/guards/auth-guard';
import { products } from '../../core/models/product.model';
@Component({
  selector: 'app-wishlists',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class Wishlists {

  private store = inject(Store);
  

  wishlistProducts$ = this.store.select(
    selectWishlistProducts
  );

  remove(productId: number): void {

    this.store.dispatch(
      removeFromWishlist({
        productId
      })
    );
  }

  clear(): void {

    this.store.dispatch(
      clearWishlist()
    );
  }

  addToCart(product: any): void {

    this.store.dispatch(
      addToCart({
        product
      })
    );
  }

  getProductImage(product: products): string {
    if (Array.isArray(product.image)) {
      return product.image[0];
    }

    return product.image;
  }
  
}