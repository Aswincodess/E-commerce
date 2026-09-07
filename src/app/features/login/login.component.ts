import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Auth } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { loadCart } from '../../store/carts/cart.actions';

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

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    this.auth.login(email, password).subscribe({
      next: (users) => {

        if (users.length === 0) {
          console.log('Invalid email or password');
          return;
        }

        const loggedInUser = users[0];

        console.log('Login successful:', loggedInUser);

        localStorage.setItem(
          'user',
          JSON.stringify(loggedInUser)
        );

        if (loggedInUser.id === undefined) {
          console.log('User ID not found');
          return;
        }

        this.store.dispatch(
          loadCart({
            userId: loggedInUser.id
          })
        );

        this.router.navigate(['/home']);
      },

      error: (error) => {
        console.log('Login failed:', error);
      }
    });
  }
}