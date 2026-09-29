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
import { FormInput } from '../../shared/form-input/form-input.component';
import { EmailOtpService } from '../../core/services/email-otp/email-otp';


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

  private emailOtpService = inject(EmailOtpService);


  // Login / Register mode
  isLogin = signal(true);


  // Login
  loginError = '';


  // Register
  registrationError = '';

  isSubmitting = false;

  animationStarted = false;


  // =========================
  // LOGIN FORM
  // =========================

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


  // =========================
  // REGISTER FORM
  // =========================

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


  // =========================
  // INIT
  // =========================

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


    // Create temporary user data
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


    // Generate 6-digit OTP
    const otp =
      this.emailOtpService.generateOtp();


    // Save OTP for 60 seconds
    this.emailOtpService.saveOtp(
      otp
    );


    // Save registration data temporarily
    sessionStorage.setItem(
      'pendingRegistration',
      JSON.stringify(user)
    );


    // Send OTP to user's email
    this.emailOtpService
      .sendOtp(
        user.name,
        user.email,
        otp
      )

      .then(() => {

        this.isSubmitting = false;


        this.toastService.success(
          'OTP sent to your email'
        );


        // Go to separate OTP page
        this.router.navigate(
          ['/verify-otp']
        );

      })

      .catch((error) => {

        this.isSubmitting = false;


        console.error(
          'OTP sending failed:',
          error
        );


        // Remove temporary OTP
        this.emailOtpService.clearOtp();


        // Remove temporary registration
        sessionStorage.removeItem(
          'pendingRegistration'
        );


        this.registrationError =
          'Unable to send OTP. Please try again later.';

      });

  }

}