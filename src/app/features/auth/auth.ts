import { Component, inject, OnInit, signal } from '@angular/core';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { Auth } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast';
import { FirebaseAuthService } from '../../core/firebase-auth';
import { FormInput } from '../../shared/form-input/form-input.component';


@Component({
  selector: 'app-auth',

  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormInput
  ],

  templateUrl: './auth.html',

  styleUrl: './auth.css'
})


export class Auths implements OnInit {

  private auth = inject(Auth);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private toastService = inject(ToastService);

  private firebaseAuthService = inject(FirebaseAuthService);


  // Login / Register mode
  isLogin = signal(true);


  // Login
  loginError = '';

  // Register
  registrationError = '';

  isSubmitting = false;

  otpSent = false;

  phoneVerified = false;

  animationStarted = false;


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
    ])

  });


  // Register form
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


  ngOnInit(): void {

    // Check whether current route is login or register
    this.route.data.subscribe(data => {

      const mode = data['mode'];

      this.isLogin.set(mode === 'login');

    });


    // Login animation
    setTimeout(() => {

      this.animationStarted = true;

    }, 150);

  }


  // =========================
  // LOGIN
  // =========================

  submitLogin(): void {

    this.loginError = '';


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


        const loggedInUser = users[0];


        // Check active account
        if (!loggedInUser.active) {

          this.isSubmitting = false;

          this.loginError =
            'Your account has been deactivated. Please contact the administrator.';

          return;
        }


        // Check user ID
        if (!loggedInUser.id) {

          this.isSubmitting = false;

          this.loginError =
            'Unable to sign in. User information is incomplete.';

          return;
        }


        // Save user
        this.auth.setUser(
          loggedInUser
        );


        this.isSubmitting = false;


        this.toastService.success(
          'Login successful'
        );


        // Admin
        if (loggedInUser.role === 'admin') {

          this.router.navigate(
            ['/admin'],
            {
              replaceUrl: true
            }
          );

        }

        // User
        else {

          this.router.navigate(
            ['/home'],
            {
              replaceUrl: true
            }
          );

        }

      },


      error: () => {

        this.isSubmitting = false;

        this.loginError =
          'Something went wrong. Please try again later.';

      }

    });

  }


  // =========================
  // REGISTER
  // =========================

  submitRegister(): void {

    this.registrationError = '';


    // Form validation
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    // Phone verification
    if (!this.phoneVerified) {

      this.registrationError =
        'Please verify your phone number before creating your account.';

      return;
    }


    const password =
      this.registerForm.controls.password.value;


    const confirmPassword =
      this.registerForm.controls.confirmPassword.value;


    // Password confirmation
    if (password !== confirmPassword) {

      this.registerForm.controls.confirmPassword.setErrors({
        passwordMismatch: true
      });

      this.registerForm.controls.confirmPassword.markAsTouched();

      return;
    }


    const user = {

      name:
        this.registerForm.controls.name.value!
          .trim(),

      email:
        this.registerForm.controls.email.value!
          .trim()
          .toLowerCase(),

      phone:
        this.registerForm.controls.phone.value!,

      password:
        password!,

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


        this.router.navigate(
          ['/login']
        );

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


        // Other errors
        this.registrationError =
          'Unable to create your account. Please try again later.';

      }

    });

  }


  // =========================
  // SEND OTP
  // =========================

  sendOtp(): void {

    const phone =
      this.registerForm.controls.phone.value;


    if (
      !phone ||
      this.registerForm.controls.phone.invalid
    ) {

      this.registerForm.controls.phone.markAsTouched();

      return;
    }


    const fullPhoneNumber =
      `+91${phone}`;


    this.firebaseAuthService.setupRecaptcha();


    this.firebaseAuthService
      .sendOtp(fullPhoneNumber)

      .then(() => {

        this.otpSent = true;


        this.toastService.success(
          'OTP sent to your phone number'
        );

      })

      .catch((error) => {

        console.error(
          'OTP sending failed:',
          error
        );


        this.toastService.error(
          'Unable to send OTP. Please try again.'
        );

      });

  }


  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(): void {

    const otp =
      this.registerForm.controls.otp.value;


    if (
      !otp ||
      !/^[0-9]{6}$/.test(otp)
    ) {

      this.registerForm.controls.otp.markAsTouched();

      return;
    }


    this.firebaseAuthService
      .verifyOtp(otp)

      .then(() => {

        this.phoneVerified = true;


        this.toastService.success(
          'Phone number verified successfully'
        );

      })

      .catch((error) => {

        console.error(
          'OTP verification failed:',
          error
        );


        this.toastService.error(
          'Invalid OTP. Please try again.'
        );

      });

  }

}