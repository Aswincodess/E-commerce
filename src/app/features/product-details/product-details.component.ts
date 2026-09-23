import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Store } from '@ngrx/store';

import {
  selectProductById
} from '../../store/products/products.selectors';

import {
  addToWishlist,
  removeFromWishlist
} from '../../store/wishlists/wishlists.actions';

import {
  selectIsInWishlist
} from '../../store/wishlists/wishlists.selectors';

import {
  switchMap,
  take
} from 'rxjs';

import {
  AsyncPipe,
  KeyValuePipe
} from '@angular/common';

import {
  addToCart
} from '../../store/carts/cart.actions';

import {
  selectCartItems
} from '../../store/carts/cart.selectors';

import {
  products
} from '../../core/models/product.model';

import {
  ToastService
} from '../../core/services/toast';

import {
  Auth
} from '../../core/services/auth.service';

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


  // Selected product image
  selectedImage = signal(0);


  // Image viewer
  showImageViewer = signal(false);


  // Zoom
  isZooming = signal(false);

  zoomX = signal(50);

  zoomY = signal(50);


  selectImage(index: number) {

    this.selectedImage.set(index);

  }


  // Mouse position for zoom
  onImageMove(event: MouseEvent) {

    const target = event.currentTarget as HTMLElement;

    const rect = target.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;


    this.zoomX.set(Math.max(0, Math.min(100, x)));

    this.zoomY.set(Math.max(0, Math.min(100, y)));

    this.isZooming.set(true);

  }


  // Remove zoom
  onImageLeave() {

    this.isZooming.set(false);

  }


  // Open full image viewer
  openImageViewer() {

    this.showImageViewer.set(true);

  }


  // Close full image viewer
  closeImageViewer() {

    this.showImageViewer.set(false);

  }


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

          this.toastService.success(
            'Removed from wishlist'
          );

        } else {

          this.store.dispatch(
            addToWishlist({
              productId
            })
          );

          this.toastService.success(
            'Added to wishlist'
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


  // Add product to cart
  // Add product to cart
  addProductToCart(product: products) {

    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }


    if (!product) {

      this.toastService.error(
        'Unable to add this product to cart.'
      );

      return;
    }


    if (product.stock <= 0) {

      this.toastService.error(
        'This product is currently out of stock.'
      );

      return;
    }


    this.store
      .select(selectCartItems)
      .pipe(take(1))
      .subscribe(items => {

        const existingItem = items.find(
          item =>
            String(item.productId) ===
            String(product.id)
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
            product
          })
        );


        this.toastService.success(
          'Added to cart'
        );

      });

  }


  // Buy Now
  buyNow(product: products) {

    if (!this.auth.currentUser()) {

      this.router.navigate(['/login']);

      return;
    }


    if (!product) {

      this.toastService.error(
        'Unable to buy this product.'
      );

      return;
    }


    if (product.stock <= 0) {

      this.toastService.error(
        'This product is currently out of stock.'
      );

      return;
    }


    this.router.navigate(['/checkout'], {

      state: {
        buyNowProduct: product
      }

    });

  }

  // Convert single image to array
  getProductImages(product: products): string[] {

    return Array.isArray(product.image)
      ? product.image
      : [product.image];

  }

}