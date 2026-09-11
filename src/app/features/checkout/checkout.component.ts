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


  cartProducts$ =
    this.store.select(
      selectCartProducts
    );


  cartTotal$ =
    this.store.select(
      selectCartTotal
    );


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


    if (!user.id) {

      console.error(
        'Logged-in user has no ID'
      );

      return;
    }


    this.cartProducts$
      .pipe(take(1))
      .subscribe(products => {

        this.cartTotal$
          .pipe(take(1))
          .subscribe(total => {

            const userId = user.id;

            if (!userId) {
              console.error('Logged-in user has no ID');
              return;
            }

            const order: Order = {

              id: crypto.randomUUID(),

              userId: userId,              items: products.map(product => ({

                productId: product.id,

                name: product.name,

                price: product.price,

                image: product.image,

                quantity: product.quantity

              })),

              total,

              fullName:
                this.checkoutForm.value
                  .fullName!,

              phone:
                this.checkoutForm.value
                  .phone!,

              addressLine:
                this.checkoutForm.value
                  .addressLine!,

              city:
                this.checkoutForm.value
                  .city!,

              state:
                this.checkoutForm.value
                  .state!,

              pincode:
                this.checkoutForm.value
                  .pincode!,

              paymentMethod:
                this.checkoutForm.value
                  .paymentMethod as
                'COD' | 'UPI',

              status: 'pending',

              createdAt:
                new Date().toISOString()

            };


            


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


  goBackToCart(): void {

    this.router.navigate([
      '/cart'
    ]);

  }

}