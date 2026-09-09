import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Auth } from '../../core/services/auth.service';
import { RouterLink, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { loadCart } from '../../store/carts/cart.actions';
import { loadWishlist } from '../../store/wishlists/wishlists.actions';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {

  private auth = inject(Auth);
  private router = inject(Router);
  private store = inject(Store);

  // Login error message
  loginError = '';

  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])

  });


  submit() {

    // Clear previous login error
    this.loginError = '';

    // Check form validation
    if (this.loginForm.invalid) {

      // Show validation messages
      this.loginForm.markAllAsTouched();

      return;
    }


    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;


    this.auth.login(email, password).subscribe({

      next: (users) => {

        // Invalid email/password
        if (users.length === 0) {

          this.loginError = 'Invalid email or password.';

          return;
        }


        const loggedInUser = users[0];

        console.log('Login successful:', loggedInUser);


        // Save logged-in user
        this.auth.setUser(loggedInUser);


        // Check user ID
        if (loggedInUser.id === undefined) {

          this.loginError = 'User ID not found.';

          return;
        }


        // Load user's cart
        this.store.dispatch(
          loadCart({
            userId: loggedInUser.id
          })
        );


        // Load user's wishlist
        this.store.dispatch(
          loadWishlist({
            userId: loggedInUser.id
          })
        );


        // Navigate to home
        this.router.navigate(['/home']);

      },


      error: (error) => {

        console.log('Login failed:', error);

        this.loginError =
          'Something went wrong. Please try again.';

      }

    });

  }

}