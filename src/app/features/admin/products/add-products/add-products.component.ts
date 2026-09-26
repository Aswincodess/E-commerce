import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  ProductFormComponent,
  ProductFormValue
} from '../product-form/product-form.component';

import { ProductService } from '../../../../core/services/product/product.service';
import { products } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast/toast';


@Component({
  selector: 'app-add-product',
  imports: [ProductFormComponent],
  template: `
    <app-product-form
      mode="add"
      (save)="addProduct($event)"
      (cancel)="cancel()">
    </app-product-form>
  `
})
export class AddProductComponent {

  private productService = inject(ProductService);

  private router = inject(Router);

  private toastService = inject(ToastService);


  addProduct(formValue: ProductFormValue): void {

    const product: products = {

      id: 0,

      name: formValue.name,
      price: formValue.price,
      image: formValue.image,

      category: formValue.category,
      subcategory: formValue.subcategory,
      description: formValue.description,
      brand: formValue.brand,

      specifications: formValue.specifications,

      stock: formValue.stock,
      maxQuantity: formValue.maxQuantity,

      rating: formValue.rating,

      isDeleted: false

    };


    this.productService
      .addProduct(product)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Product added successfully.'
          );

          this.router.navigate([
            '/admin/products'
          ]);

        },

        error: () => {

          this.toastService.error(
            'Failed to add product.'
          );

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/admin/products'
    ]);

  }

}