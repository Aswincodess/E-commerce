import {
  Component,
  effect,
  input,
  output,
  inject
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { products } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast';


export interface ProductFormValue {

  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  description: string;
  brand: string;
  stock: number;
  maxQuantity: number;
  rating: number;

  specifications: Record<string, string>;

}


@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  private fb = inject(FormBuilder);

  private toastservice = inject(ToastService);


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

    maxQuantity: [
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
    ],

    specifications: this.fb.array<
      ReturnType<FormBuilder['group']>
    >([])

  });


  // Easy access to specifications

  get specifications(): FormArray {

    return this.productForm.controls.specifications;

  }


  // Add new specification row

  addSpecification(): void {

    this.specifications.push(

      this.fb.group({

        key: [
          '',
          Validators.required
        ],

        value: [
          '',
          Validators.required
        ]

      })

    );

  }


  // Remove specification row

  removeSpecification(index: number): void {

    this.specifications.removeAt(index);

  }


  constructor() {

    effect(() => {

      const product = this.product();


      // ADD MODE

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
          maxQuantity: 0,
          rating: 0

        });

        this.specifications.clear();

        return;

      }


      // EDIT MODE

      const image = Array.isArray(product.image)
        ? product.image[0] || ''
        : product.image;


      this.productForm.patchValue({

        name: product.name,
        price: product.price,
        image: image,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        brand: product.brand,
        stock: product.stock,
        maxQuantity: product.maxQuantity,
        rating: product.rating

      });


      // Clear old specification rows

      this.specifications.clear();


      // Load existing specifications

      if (product.specifications) {

        Object.entries(product.specifications)
          .forEach(([key, value]) => {

            this.specifications.push(

              this.fb.group({

                key: [
                  key,
                  Validators.required
                ],

                value: [
                  value,
                  Validators.required
                ]

              })

            );

          });

      }

    });

  }


  submit(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.productForm.getRawValue();


    // Max quantity cannot be greater than stock

    if (
      formValue.maxQuantity >
      formValue.stock
    ) {

      this.toastservice.error(
        'Max quantity cannot be greater than stock.'
      );

      return;

    }


    // Convert FormArray into object

    const specifications: Record<string, string> = {};


    for (
      const specification of
      this.specifications.getRawValue()
    ) {

      const key =
        specification.key.trim();

      const value =
        specification.value.trim();


      if (key) {

        specifications[key] = value;

      }

    }


    this.save.emit({

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
      specifications: specifications

    });

  }


  onCancel(): void {

    this.cancel.emit();

  }

}