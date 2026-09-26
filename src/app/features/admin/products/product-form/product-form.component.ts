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

import { HttpClient } from '@angular/common/http';

import { products } from '../../../../core/models/product.model';
import { ToastService } from '../../../../core/services/toast/toast';

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

  private http = inject(HttpClient);


  // Input from parent

  product = input<products | null>(null);

  mode = input<'add' | 'edit'>('add');


  // Output to parent

  save = output<ProductFormValue>();

  cancel = output<void>();


  // Product form

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


  // Add specification

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


  // Remove specification

  removeSpecification(index: number): void {

    this.specifications.removeAt(index);

  }


  // Validate image

  validateImageFile(file: File): string | null {

    if (!file.type.startsWith('image/')) {

      return 'Please choose an image file.';

    }

    if (file.size > 10 * 1024 * 1024) {

      return 'That image is too large. Please choose one under 10 MB.';

    }

    return null;

  }


  // Resize image and convert temporarily to Base64

  fileToResizedDataUrl(
    file: File,
    maxDimension: number,
    quality = 0.85
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();


      reader.onerror = () => {

        reject(
          new Error('Could not read that file.')
        );

      };


      reader.onload = () => {

        const img = new Image();


        img.onerror = () => {

          reject(
            new Error('Could not read that image.')
          );

        };


        img.onload = () => {

          let {
            width,
            height
          } = img;


          // Resize only if image is too large

          if (
            width > maxDimension ||
            height > maxDimension
          ) {

            if (width >= height) {

              height = Math.round(
                (height / width) *
                maxDimension
              );

              width = maxDimension;

            } else {

              width = Math.round(
                (width / height) *
                maxDimension
              );

              height = maxDimension;

            }

          }


          const canvas =
            document.createElement('canvas');


          canvas.width = width;

          canvas.height = height;


          const ctx =
            canvas.getContext('2d');


          if (!ctx) {

            reject(
              new Error(
                'Could not process that image.'
              )
            );

            return;

          }


          ctx.drawImage(
            img,
            0,
            0,
            width,
            height
          );


          resolve(

            canvas.toDataURL(
              'image/jpeg',
              quality
            )

          );

        };


        img.src =
          reader.result as string;

      };


      reader.readAsDataURL(file);

    });

  }


  // Select and upload image

  async onImageSelected(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    // Validate image

    const error =
      this.validateImageFile(file);


    if (error) {

      this.toastservice.error(error);

      input.value = '';

      return;

    }


    // Get category

    const category =
      this.productForm.controls.category.value;


    // Get subcategory

    const subcategory =
      this.productForm.controls.subcategory.value;


    // Category and subcategory are required

    if (
      !category ||
      !subcategory
    ) {

      this.toastservice.error(
        'Please select category and subcategory first.'
      );

      input.value = '';

      return;

    }


    try {

      // Resize image

      const fileData =
        await this.fileToResizedDataUrl(
          file,
          1200,
          0.85
        );


      // Upload image to Express server

      this.http.post<{ imagePath: string }>(

        'http://localhost:3001/upload-product-image',

        {
          fileName: file.name,

          fileData: fileData,

          category: category,

          
        }

      ).subscribe({

        next: response => {

          // Save returned path in form

          this.productForm.controls.image.setValue(
            response.imagePath
          );


          this.productForm.controls.image.markAsTouched();


          this.toastservice.success(
            'Image uploaded successfully.'
          );

        },


        error: () => {

          this.toastservice.error(
            'Failed to upload image.'
          );

        }

      });

    } catch {

      this.toastservice.error(
        'Could not process that image.'
      );

      input.value = '';

    }

  }


  // Load product when editing

  constructor() {

    effect(() => {

      const product =
        this.product();


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

      const image =
        Array.isArray(product.image)

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


      // Clear old specifications

      this.specifications.clear();


      // Load existing specifications

      if (product.specifications) {

        Object.entries(
          product.specifications
        ).forEach(([key, value]) => {

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


  // Submit product

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


    // Convert specifications array into object

    const specifications:
      Record<string, string> = {};


    for (
      const specification
      of this.specifications.getRawValue()
    ) {

      const key =
        specification.key.trim();


      const value =
        specification.value.trim();


      if (key) {

        specifications[key] = value;

      }

    }


    // Send product to parent

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


  // Cancel

  onCancel(): void {

    this.cancel.emit();

  }

}