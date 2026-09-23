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
import { FirebaseAuthService } from '../../core/firebase-auth';
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
  private toastService = inject(ToastService);
  private firebaseAuthService = inject(FirebaseAuthService);


  registrationError = '';

  isSubmitting = false;
  otpSent = false;
  phoneVerified = false;


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

    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[6-9][0-9]{9}$/)
    ]),

    otp: new FormControl('', [
      Validators.pattern(/^[0-9]{6}$/)
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


    // Check phone verification
    if (!this.phoneVerified) {

      this.registrationError =
        'Please verify your phone number before creating your account.';

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

      phone:
        this.registerForm.controls.phone.value!,

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
  sendOtp() {

    const phone = this.registerForm.controls.phone.value;

    if (!phone || this.registerForm.controls.phone.invalid) {
      this.registerForm.controls.phone.markAsTouched();
      return;
    }

    const fullPhoneNumber = `+91${phone}`;

    this.firebaseAuthService.setupRecaptcha();

    this.firebaseAuthService.sendOtp(fullPhoneNumber)
      .then(() => {

        this.otpSent = true;

        this.toastService.success(
          'OTP sent to your phone number'
        );

      })
      .catch((error) => {

        console.error('OTP sending failed:', error);

        this.toastService.error(
          'Unable to send OTP. Please try again.'
        );

      });

  }

  verifyOtp() {

    const otp = this.registerForm.controls.otp.value;

    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      this.registerForm.controls.otp.markAsTouched();
      return;
    }

    this.firebaseAuthService.verifyOtp(otp)
      .then(() => {

        this.phoneVerified = true;

        this.toastService.success(
          'Phone number verified successfully'
        );

      })
      .catch((error) => {

        console.error('OTP verification failed:', error);

        this.toastService.error(
          'Invalid OTP. Please try again.'
        );

      });

  }

  

  

}