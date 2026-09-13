import { Component, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { AsyncPipe } from '@angular/common';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import {
  selectCartProducts,
  selectCartTotal
} from '../../store/carts/cart.selectors';

import { createOrder } from '../../store/orders/orders.actions';

import { Order } from '../../core/models/order.model';

import { products } from '../../core/models/product.model';

import { take } from 'rxjs';

import { ToastService } from '../../core/services/toast';

import { Auth } from '../../core/services/auth.service';


@Component({
  selector: 'app-checkout',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    AsyncPipe
  ],

  templateUrl: './checkout.component.html',

  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  private store = inject(Store);

  private router = inject(Router);

  private toastService = inject(ToastService);

  private auth = inject(Auth);


  // Supports Buy Now
  buyNowProduct: products | null = null;


  // Cart products
  cartProducts$ =
    this.store.select(
      selectCartProducts
    );


  // Cart total
  cartTotal$ =
    this.store.select(
      selectCartTotal
    );


  // Checkout form
  checkoutForm = new FormGroup({

    fullName: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),

    phone: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    }),

    addressLine: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),

    city: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),

    state: new FormControl('', {
      validators: [
        Validators.required
      ]
    }),

    pincode: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/)
      ]
    }),


    // Payment method
    paymentMethod: new FormControl<
      'COD' | 'UPI' | 'CARD'
    >('COD', {
      nonNullable: true,

      validators: [
        Validators.required
      ]
    }),


    // UPI ID
    upiId: new FormControl('', {
      validators: [
        Validators.pattern(
          /^[\w.-]+@[\w.-]+$/
        )
      ]
    }),


    // Card number
    cardNumber: new FormControl('', {
      validators: [
        Validators.pattern(
          /^[0-9 ]{16,19}$/
        )
      ]
    })

  });


  constructor() {

    const navigationState =
      history.state;


    if (navigationState?.buyNowProduct) {

      this.buyNowProduct =
        navigationState.buyNowProduct;

    }


    // Watch payment method changes
    this.checkoutForm.controls.paymentMethod
      .valueChanges
      .subscribe(paymentMethod => {

        this.updatePaymentValidators(
          paymentMethod
        );

      });

  }


  /**
   * Changes validation depending
   * on selected payment method.
   */
  private updatePaymentValidators(
    paymentMethod: 'COD' | 'UPI' | 'CARD'
  ): void {

    const upiControl =
      this.checkoutForm.controls.upiId;

    const cardControl =
      this.checkoutForm.controls.cardNumber;


    // Reset validators first
    upiControl.clearValidators();

    cardControl.clearValidators();


    // UPI selected
    if (paymentMethod === 'UPI') {

      upiControl.setValidators([
        Validators.required,

        Validators.pattern(
          /^[\w.-]+@[\w.-]+$/
        )
      ]);

    }


    // Card selected
    if (paymentMethod === 'CARD') {

      cardControl.setValidators([
        Validators.required,

        Validators.pattern(
          /^[0-9 ]{16,19}$/
        )
      ]);

    }


    // Update validation state
    upiControl.updateValueAndValidity();

    cardControl.updateValueAndValidity();

  }


  placeOrder(): void {

    // Validate form
    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }


    // Get logged-in user
    const user =
      this.auth.currentUser();


    if (!user) {

      console.error(
        'No logged-in user found'
      );

      this.router.navigate([
        '/login'
      ]);

      return;
    }


    // Get user ID
    const userId: string =
      user.id!;


    if (!userId) {

      console.error(
        'Logged-in user has no ID'
      );

      return;
    }


    // Get payment method
    const paymentMethod =
      this.checkoutForm.controls
        .paymentMethod.value;


    // --------------------------------
    // BUY NOW ORDER
    // --------------------------------

    if (this.buyNowProduct) {

      const product =
        this.buyNowProduct;


      const order: Order = {

        id:
          crypto.randomUUID(),

        userId:
          userId,

        items: [

          {
            productId:
              product.id,

            name:
              product.name,

            price:
              product.price,

            image:
              product.image,

            quantity:
              1
          }

        ],

        total:
          product.price,

        fullName:
          this.checkoutForm.value.fullName!,

        phone:
          this.checkoutForm.value.phone!,

        addressLine:
          this.checkoutForm.value.addressLine!,

        city:
          this.checkoutForm.value.city!,

        state:
          this.checkoutForm.value.state!,

        pincode:
          this.checkoutForm.value.pincode!,

        paymentMethod:
          paymentMethod,

        status:
          'pending',

        createdAt:
          new Date().toISOString()

      };


      // Dispatch Buy Now order
      this.store.dispatch(
        createOrder({
          order
        })
      );


      this.toastService.success(
        'Order placed successfully'
      );


      this.router.navigate(
        ['/order-success'],
        {
          replaceUrl: true
        }
      );


      return;
    }


    // --------------------------------
    // CART ORDER
    // --------------------------------

    this.cartProducts$
      .pipe(take(1))
      .subscribe(products => {

        this.cartTotal$
          .pipe(take(1))
          .subscribe(total => {


            const order: Order = {

              id:
                crypto.randomUUID(),

              userId:
                userId,

              items:
                products.map(product => ({

                  productId:
                    product.id,

                  name:
                    product.name,

                  price:
                    product.price,

                  image:
                    product.image,

                  quantity:
                    product.quantity

                })),

              total:
                total,

              fullName:
                this.checkoutForm.value.fullName!,

              phone:
                this.checkoutForm.value.phone!,

              addressLine:
                this.checkoutForm.value.addressLine!,

              city:
                this.checkoutForm.value.city!,

              state:
                this.checkoutForm.value.state!,

              pincode:
                this.checkoutForm.value.pincode!,

              paymentMethod:
                paymentMethod,

              status:
                'pending',

              createdAt:
                new Date().toISOString()

            };


            // Dispatch Cart order
            this.store.dispatch(
              createOrder({
                order
              })
            );


            this.toastService.success(
              'Order placed successfully'
            );


            this.router.navigate(
              ['/order-success'],
              {
                replaceUrl: true
              }
            );

          });

      });

  }


  // Back to cart
  goBackToCart(): void {

    if (this.buyNowProduct) {

      this.router.navigate([
        '/products'
      ]);

      return;
    }


    this.router.navigate([
      '/cart'
    ]);

  }

}