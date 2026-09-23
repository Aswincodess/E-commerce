import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  AsyncPipe,
  DecimalPipe
} from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectCartProducts,
  selectCartTotal
} from '../../store/carts/cart.selectors';

import {
  clearCart
} from '../../store/carts/cart.actions';

import {
  createOrder,
  createOrderSuccess,
  createOrderFailure
} from '../../store/orders/orders.actions';

import {
  Actions,
  ofType
} from '@ngrx/effects';

import { Order } from '../../core/models/order.model';

import { products } from '../../core/models/product.model';

import {
  take
} from 'rxjs';

import { ToastService } from '../../core/services/toast';

import { Auth } from '../../core/services/auth.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DecimalPipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  private store = inject(Store);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private auth = inject(Auth);
  private actions$ = inject(Actions);


  buyNowProduct: products | null = null;

  isSubmitting = false;


  cartProducts$ =
    this.store.select(
      selectCartProducts
    );

  cartTotal$ =
    this.store.select(
      selectCartTotal
    );


  checkoutForm = new FormGroup({

    fullName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]+(?:[A-Za-z\s.'-]*[A-Za-z])?$/)
      ]
    }),

    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    }),

    phone: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/)
      ]
    }),

    addressLine: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200),
        Validators.pattern(/^[A-Za-z0-9\s,./#'-]+$/)
      ]
    }),

    city: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/)
      ]
    }),

    state: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/)
      ]
    }),

    pincode: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[1-9][0-9]{5}$/)
      ]
    }),

    paymentMethod: new FormControl<
      'COD' | 'UPI' | 'CARD'
    >('COD', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    upiId: new FormControl('', {
      validators: [
        Validators.pattern(
          /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$/
        )
      ]
    }),

    cardNumber: new FormControl('', {
      validators: [
        Validators.pattern(
          /^(?:[0-9]{4} ){3}[0-9]{4}$/
        )
      ]
    }),

    cardExpiry: new FormControl('', {
      validators: [
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/([0-9]{2})$/
        )
      ]
    }),

    cardCvv: new FormControl('', {
      validators: [
        Validators.pattern(/^[0-9]{3}$/)
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


    const user =
      this.auth.currentUser();

    if (user) {

      this.checkoutForm.patchValue({

        fullName:
          user.name,

        email:
          user.email

      });

    }


    this.checkoutForm.controls.paymentMethod
      .valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(paymentMethod => {

        this.updatePaymentValidators(
          paymentMethod
        );

      });


    // Order created successfully
    this.actions$
      .pipe(
        ofType(createOrderSuccess), takeUntilDestroyed())
      
      .subscribe(() => {

        this.isSubmitting = false;


        // Clear cart only for normal cart checkout
        if (!this.buyNowProduct) {

          this.store.dispatch(
            clearCart()
          );

        }


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


    // Order creation failed
    this.actions$
      .pipe(
        ofType(createOrderFailure), takeUntilDestroyed()
      )
      .subscribe(({ error }) => {

        this.isSubmitting = false;

        this.toastService.error(
          error
        );

      });

  }


  private updatePaymentValidators(
    paymentMethod: 'COD' | 'UPI' | 'CARD'
  ): void {

    const upiControl =
      this.checkoutForm.controls.upiId;

    const cardControl =
      this.checkoutForm.controls.cardNumber;

    const expiryControl =
      this.checkoutForm.controls.cardExpiry;

    const cvvControl =
      this.checkoutForm.controls.cardCvv;


    upiControl.clearValidators();

    cardControl.clearValidators();

    expiryControl.clearValidators();

    cvvControl.clearValidators();


    if (paymentMethod === 'UPI') {

      upiControl.setValidators([
        Validators.required,

        Validators.pattern(
          /^[\w.-]+@[\w.-]+$/
        )
      ]);

    }


    if (paymentMethod === 'CARD') {

      cardControl.setValidators([
        Validators.required,
        Validators.pattern(
          /^(?:[0-9]{4} ){3}[0-9]{4}$/
        )
      ]);

      expiryControl.setValidators([
        Validators.required,
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/([0-9]{2})$/
        )
      ]);

      cvvControl.setValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{3}$/
        )
      ]);

    }


    upiControl.updateValueAndValidity();

    cardControl.updateValueAndValidity();

    expiryControl.updateValueAndValidity();

    cvvControl.updateValueAndValidity();

  }


  placeOrder(): void {

    if (this.isSubmitting) {
      return;
    }


    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;

    }


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


    const userId: string =
      user.id!;


    if (!userId) {

      console.error(
        'Logged-in user has no ID'
      );

      return;

    }


    this.isSubmitting = true;


    const paymentMethod =
      this.checkoutForm.controls
        .paymentMethod.value;


    // BUY NOW ORDER
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
              Array.isArray(product.image)
                ? product.image[0]
                : product.image,

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


      this.store.dispatch(
        createOrder({
          order
        })
      );


      return;

    }


    // CART ORDER
    this.cartProducts$
      .pipe(
        take(1)
      )
      .subscribe(products => {

        this.cartTotal$
          .pipe(
            take(1)
          )
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
                    Array.isArray(product.image)
                      ? product.image[0]
                      : product.image,

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


            this.store.dispatch(
              createOrder({
                order
              })
            );

          });

      });

  }


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


  editCart(): void {

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


  getProductImage(
    product: products
  ): string {

    return Array.isArray(product.image)
      ? product.image[0]
      : product.image;

  }

}