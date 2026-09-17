import { Component, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  
} from '@angular/forms';

import {
  RouterLink,
  Router,

} from '@angular/router';

import { Auth } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast';
import { FormInput } from '../../shared/form-input/form-input.component';

@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormInput
  ],

  templateUrl: './login.component.html',

  styleUrl: './login.component.css'
})


export class Login {

  private auth = inject(Auth);

  private router = inject(Router);

  private toastService = inject(ToastService)


  loginError = '';

  isSubmitting = false;


  // Login form
  loginForm = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/
      )
    ]),



  });


  submit(): void {

    this.loginError = '';


    // Check form validation
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }


    const email =
      this.loginForm.controls.email.value!
        .trim()
        .toLowerCase();


    const password =
      this.loginForm.controls.password.value!;


    this.isSubmitting = true;


    // Login request
    this.auth.login(
      email,
      password
    ).subscribe({

      next: (users) => {

        // No matching user
        if (users.length === 0) {

          this.isSubmitting = false;

          this.loginError =
            'Invalid email or password.';

          return;
        }


        // Logged-in user
        const loggedInUser =
          users[0];


        // Check user ID before saving user
        if (!loggedInUser.id) {

          this.isSubmitting = false;

          this.loginError =
            'Unable to sign in. User information is incomplete.';

          return;
        }


        // Save logged-in user
        this.auth.setUser(
          loggedInUser
        );


        this.isSubmitting = false;


        // Navigate to home
        this.toastService.success('Login successful');

        if (loggedInUser.role === 'admin') {
          this.router.navigate(['/admin'], {
            replaceUrl: true
          });
        } else {
          this.router.navigate(['/home'], {
            replaceUrl: true
          });
        }

      },


      error: () => {

        this.isSubmitting = false;

        this.loginError =
          'Something went wrong. Please try again later.';

      }

    });

  }

}