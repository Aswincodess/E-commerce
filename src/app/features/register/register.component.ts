import { Component, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Auth } from '../../core/services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast';
import { FormInput } from '../../shared/form-input/form-input.component';

@Component({
  selector: 'app-register',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormInput
  ],

  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class Register {

  private auth = inject(Auth);

  private router = inject(Router);
  private toastService = inject(ToastService)


  registrationError = '';

  isSubmitting = false;


  registerForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z ]+$/)
    ]),


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


    confirmPassword: new FormControl('', [
      Validators.required
    ])

  });


  submit() {

    this.registrationError = '';


    // Check form validation
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    const password =
      this.registerForm.controls.password.value;

    const confirmPassword =
      this.registerForm.controls.confirmPassword.value;


    // Check password confirmation
    if (password !== confirmPassword) {

      this.registerForm.controls.confirmPassword.setErrors({
        passwordMismatch: true
      });

      this.registerForm.controls.confirmPassword.markAsTouched();

      return;
    }

    const user = {

      name:
        this.registerForm.controls.name.value!.trim(),

      email:
        this.registerForm.controls.email.value!.trim().toLowerCase(),

      password: password!,

      role: 'user' as const,
      active: true

    };


    this.isSubmitting = true;


    this.auth.register(user).subscribe({

      next: () => {

        this.isSubmitting = false;
        this.toastService.success(
          'Registration successful'
        );

        this.router.navigate(['/login']);

      },


      error: (error) => {

        this.isSubmitting = false;

        console.error(
          'Registration failed:',
          error
        );


        // Email already exists
        if (error.status === 409) {

          this.registrationError =
            'An account with this email already exists.';

          this.registerForm.controls.email.setErrors({
            emailExists: true
          });

          return;
        }


        // Other API/server errors
        this.registrationError =
          'Unable to create your account. Please try again later.';

      }

    });

  }

}