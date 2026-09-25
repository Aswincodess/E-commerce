import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ProductFormComponent,
  ProductFormValue
} from '../product-form/product-form.component';

import { ProductService } from '../../../../core/services/product.service';
import { products } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast';


@Component({
  selector: 'app-edit-product',
  imports: [ProductFormComponent],
  template: `
    @if (product()) {

      <app-product-form
        mode="edit"
        [product]="product()"
        (save)="updateProduct($event)"
        (cancel)="cancel()">
      </app-product-form>

    }
  `
})
export class EditProductComponent {

  private productService = inject(ProductService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private toastService = inject(ToastService);


  product = signal<products | null>(null);

  productId = '';


  ngOnInit(): void {

    this.productId =
      this.route.snapshot.paramMap.get('id') ?? '';


    if (!this.productId) {

      return;

    }


    this.loadProduct();

  }


  loadProduct(): void {

    this.productService
      .getProductById(this.productId)
      .subscribe({

        next: (product) => {

          this.product.set(product);

        },

        error: () => {

          this.toastService.error(
            'Failed to load product.'
          );

        }

      });

  }


  updateProduct(
    formValue: ProductFormValue
  ): void {

    const currentProduct =
      this.product();


    if (!currentProduct) {

      return;

    }


    const updatedProduct: products = {

      ...currentProduct,

      name: formValue.name,
      price: formValue.price,
      image: formValue.image,

      category: formValue.category,
      subcategory: formValue.subcategory,
      description: formValue.description,
      brand: formValue.brand,

      stock: formValue.stock,
      maxQuantity: formValue.maxQuantity,
      rating: formValue.rating,

      specifications:
        formValue.specifications

    };


    this.productService
      .updateProduct(
        this.productId,
        updatedProduct
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Product updated successfully.'
          );

          this.router.navigate([
            '/admin/products'
          ]);

        },

        error: () => {

          this.toastService.error(
            'Failed to update product.'
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