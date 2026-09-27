import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Observable, of, switchMap, map } from 'rxjs';

import { ProductService } from '../../../../core/services/product/product.service';
import { products } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    KeyValuePipe
  ],
  templateUrl: './admin-product-detail.html',
  styleUrl: './admin-product-detail.css'
})
export class AdminProductDetail {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  selectedImage = signal(0);

  product$: Observable<products | undefined> =
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');

        if (!id) {
          return of(undefined);
        }

        return this.productService.getProductById(id).pipe(
          map(product => product)
        );
      })
    );

  selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  getProductImages(product: products): string[] {
    if (Array.isArray(product.image)) {
      return product.image;
    }

    return [product.image];
  }

  editProduct(product: products): void {
    this.router.navigate([
      '/admin/products/edit',
      product.id
    ]);
  }

  deleteProduct(product: products): void {

    const updatedProduct: products = {
      ...product,
      isDeleted: true
    };

    this.productService
      .updateProduct(String(product.id), updatedProduct)
      .subscribe({
        next: () => {
          this.toastService.success(
            'Product deleted successfully.'
          );

          this.router.navigate(['/admin/products']);
        },

        error: () => {
          this.toastService.error(
            'Failed to delete product.'
          );
        }
      });
  }

  restoreProduct(product: products): void {

    const updatedProduct: products = {
      ...product,
      isDeleted: false
    };

    this.productService
      .updateProduct(String(product.id), updatedProduct)
      .subscribe({
        next: () => {
          this.toastService.success(
            'Product restored successfully.'
          );
        },

        error: () => {
          this.toastService.error(
            'Failed to restore product.'
          );
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }
}