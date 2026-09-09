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

import { take } from 'rxjs';

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


  cartProducts$ =
    this.store.select(selectCartProducts);


  cartTotal$ =
    this.store.select(selectCartTotal);


  checkoutForm = new FormGroup({

    fullName: new FormControl('', [
      Validators.required
    ]),

    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),

    addressLine: new FormControl('', [
      Validators.required
    ]),

    city: new FormControl('', [
      Validators.required
    ]),

    state: new FormControl('', [
      Validators.required
    ]),

    pincode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]),

    paymentMethod: new FormControl('COD', [
      Validators.required
    ])

  });


  placeOrder(): void {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }


    const storedUser =
      localStorage.getItem('user');


    if (!storedUser) {

      console.error(
        'No logged-in user found'
      );

      this.router.navigate(['/login']);

      return;
    }


    const user =
      JSON.parse(storedUser);


    this.cartProducts$
      .pipe(take(1))
      .subscribe(products => {

        this.cartTotal$
          .pipe(take(1))
          .subscribe(total => {


            const order: Order = {

              id: crypto.randomUUID(),

              userId: user.id,

              items: products.map(product => ({

                productId: product.id,

                name: product.name,

                price: product.price,

                image: product.image,

                quantity: product.quantity

              })),

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
                this.checkoutForm.value
                  .paymentMethod as 'COD' | 'UPI',

              status: 'pending',

              createdAt:
                new Date().toISOString()

            };


            console.log(
              'ORDER DISPATCHED:',
              order
            );


            this.store.dispatch(
              createOrder({ order })
            );

          });

      });

  }


  goBackToCart(): void {

    this.router.navigate(['/cart']);

  }

}