import { Component, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  RouterLink,
  Router
} from '@angular/router';

import { Auth } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.component.html',

  styleUrl: './login.component.css'
})
export class Login {

  private auth = inject(Auth);

  private router = inject(Router);


  loginError = '';

 //loginform
  loginForm = new FormGroup({

    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.email
      ]
    ),

    password: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    )

  });




  submit(): void {

    this.loginError = '';


    // Validate form
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();//Checks whether any validation rule has failed.

      return;
    }


    const email =
      this.loginForm.value.email!;


    const password =
      this.loginForm.value.password!;


    // Login request
    this.auth.login(
      email,
      password
    ).subscribe({

      next: (users) => {

        // Invalid credentials
        if (users.length === 0) {

          this.loginError =
            'Invalid email or password.';

          return;
        }


        // Logged-in user
        const loggedInUser =
          users[0];


        // ==================================
        // SAVE USER
        // ==================================

        this.auth.setUser(
          loggedInUser
        );


        // ==================================
        // CHECK USER ID
        // ==================================

        if (loggedInUser.id === undefined) {

          this.loginError =
            'User ID not found.';

          return;
        }


        // ==================================
        // NAVIGATE
        // ==================================

        this.router.navigate(
          ['/home'],
          {
            replaceUrl: true
          }
        );

      },


      error: () => {

        this.loginError =
          'Something went wrong. Please try again.';

      }

    });

  }

}