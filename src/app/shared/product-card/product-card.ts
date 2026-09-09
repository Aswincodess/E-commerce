import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink,AsyncPipe],
  templateUrl: './product-card.html'
})
export class ProductCard {

  private store = inject(Store);

  @Input() product!: products;


  toggleWishlist(event: Event) {

    // VERY IMPORTANT
    // Prevent product card navigation
    event.preventDefault();
    event.stopPropagation();

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


  isInWishlist$() {
    return this.store.select(
      selectIsInWishlist(this.product.id)
    );
  }


  onImageError(event: Event) {

    const img = event.target as HTMLImageElement;

    img.src = 'assets/images/placeholder-product.png';
  }
}