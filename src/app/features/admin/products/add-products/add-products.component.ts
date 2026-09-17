import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../../core/services/product.service';
import { products } from '../../../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css'
})
export class AddProductComponent {

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  loading = false;
  error = '';

  productForm = this.fb.group({

    name: ['', Validators.required],

    price: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    image: ['', Validators.required],

    category: ['', Validators.required],

    subcategory: ['', Validators.required],

    description: ['', Validators.required],

    brand: ['', Validators.required],

    stock: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    rating: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(5)
      ]
    ]

  });


  addProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    this.error = '';

    const product: products = {
      id: 0,
      name: this.productForm.value.name!,
      price: Number(this.productForm.value.price),
      image: this.productForm.value.image!,
      category: this.productForm.value.category!,
      subcategory: this.productForm.value.subcategory!,
      description: this.productForm.value.description!,
      brand: this.productForm.value.brand!,
      specifications: {},
      stock: Number(this.productForm.value.stock),
      maxQuantity: Number(this.productForm.value.stock),
      rating: Number(this.productForm.value.rating),
      isDeleted: false
    };


    this.productService.addProduct(product).subscribe({

      next: () => {

        this.loading = false;

        this.router.navigate(['/admin/products']);

      },

      error: () => {

        this.loading = false;

        this.error = 'Failed to add product.';

      }

    });

  }


  cancel(): void {

    this.router.navigate(['/admin/products']);

  }

}