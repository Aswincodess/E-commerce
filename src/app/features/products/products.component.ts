import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { addToCart } from '../../store/carts/cart.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsError
} from '../../store/products/products.selectors';

import { products } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class Products {

  private store = inject(Store);

  products$ = this.store.select(selectAllProducts);
  loading$ = this.store.select(selectProductsLoading);
  error$ = this.store.select(selectProductsError);

  testClick() {
    console.log('🔥 PRODUCTS COMPONENT IS WORKING');
  }

  addToCart(product: products) {
    console.log('🔥 ADD TO CART:', product);

    this.store.dispatch(
      addToCart({ product })
    );
  }
}