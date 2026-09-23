import {
  Component,
  effect,
  input,
  output,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { products } from '../../../../core/models/product.model';


export interface ProductFormValue {

  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  description: string;
  brand: string;
  stock: number;
  rating: number;

}


@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  private fb = inject(FormBuilder);


  // Input from parent
  product = input<products | null>(null);

  mode = input<'add' | 'edit'>('add');


  // Output to parent
  save = output<ProductFormValue>();

  cancel = output<void>();


  productForm = this.fb.nonNullable.group({

    name: [
      '',
      Validators.required
    ],

    price: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],

    image: [
      '',
      Validators.required
    ],

    category: [
      '',
      Validators.required
    ],

    subcategory: [
      '',
      Validators.required
    ],

    description: [
      '',
      Validators.required
    ],

    brand: [
      '',
      Validators.required
    ],

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


  constructor() {

    effect(() => {

      const product = this.product();

      if (!product) {

        this.productForm.reset({
          name: '',
          price: 0,
          image: '',
          category: '',
          subcategory: '',
          description: '',
          brand: '',
          stock: 0,
          rating: 0
        });

        return;
      }


      this.productForm.patchValue({

        name: product.name,
        price: product.price,
        image: product.image[0],
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        brand: product.brand,
        stock: product.stock,
        rating: product.rating

      });

    });

  }


  submit(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    this.save.emit(
      this.productForm.getRawValue()
    );

  }


  onCancel(): void {

    this.cancel.emit();

  }

}