import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/toast/toast';
import { EmailOtpService } from '../../../core/services/email-otp/email-otp';


@Component({
  selector: 'app-verify-otp',

  imports: [
    ReactiveFormsModule
  ],

  templateUrl: './verify-otp.html',

  styleUrl: './verify-otp.css'
})


export class VerifyOtp implements OnInit, OnDestroy {

  private auth = inject(Auth);

  private router = inject(Router);

  private toastService = inject(ToastService);

  private emailOtpService = inject(EmailOtpService);


  otp = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[0-9]{6}$/)
  ]);


  email = '';

  otpError = '';

  timeLeft = 60;

  isSubmitting = false;

  canResend = false;

  private timer: ReturnType<typeof setInterval> | null = null;


  ngOnInit(): void {

    const pendingRegistration =
      sessionStorage.getItem('pendingRegistration');


    if (!pendingRegistration) {

      this.router.navigate(['/register']);

      return;
    }


    const user =
      JSON.parse(pendingRegistration);


    this.email = user.email;


    this.startTimer();

  }


  // =========================
  // TIMER
  // =========================

  startTimer(): void {

    this.stopTimer();


    this.timeLeft = 60;

    this.canResend = false;


    this.timer = setInterval(() => {

      this.timeLeft--;


      if (this.timeLeft <= 0) {

        this.timeLeft = 0;

        this.canResend = true;

        this.stopTimer();

      }

    }, 1000);

  }


  stopTimer(): void {

    if (this.timer) {

      clearInterval(this.timer);

      this.timer = null;

    }

  }


  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(): void {

    this.otpError = '';


    if (this.otp.invalid) {

      this.otp.markAsTouched();

      return;
    }


    if (this.emailOtpService.isOtpExpired()) {

      this.otpError =
        'OTP has expired. Please request a new OTP.';

      this.canResend = true;

      return;
    }


    const enteredOtp =
      this.otp.value!;


    const isValid =
      this.emailOtpService.verifyOtp(
        enteredOtp
      );


    if (!isValid) {

      this.otpError =
        'Invalid OTP. Please try again.';

      return;
    }


    const pendingRegistration =
      sessionStorage.getItem(
        'pendingRegistration'
      );


    if (!pendingRegistration) {

      this.otpError =
        'Registration session expired. Please register again.';

      return;
    }


    const user =
      JSON.parse(pendingRegistration);


    this.isSubmitting = true;


    this.auth.register(user).subscribe({

      next: () => {

        this.isSubmitting = false;


        this.emailOtpService.clearOtp();


        sessionStorage.removeItem(
          'pendingRegistration'
        );


        this.toastService.success(
          'Email verified and account created successfully'
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


        if (error.status === 409) {

          this.otpError =
            'An account with this email already exists.';

          this.emailOtpService.clearOtp();

          sessionStorage.removeItem(
            'pendingRegistration'
          );

          return;
        }


        this.otpError =
          'Unable to create your account. Please try again.';

      }

    });

  }


  // =========================
  // RESEND OTP
  // =========================

  resendOtp(): void {

    if (!this.canResend) {
      return;
    }


    const pendingRegistration =
      sessionStorage.getItem(
        'pendingRegistration'
      );


    if (!pendingRegistration) {

      this.router.navigate(['/register']);

      return;
    }


    const user =
      JSON.parse(pendingRegistration);


    const newOtp =
      this.emailOtpService.generateOtp();


    this.emailOtpService.saveOtp(
      newOtp
    );


    this.isSubmitting = true;

    this.otpError = '';


    this.emailOtpService
      .sendOtp(
        user.name,
        user.email,
        newOtp
      )

      .then(() => {

        this.isSubmitting = false;

        this.otp.reset();

        this.startTimer();


        this.toastService.success(
          'New OTP sent to your email'
        );

      })

      .catch((error) => {

        this.isSubmitting = false;


        console.error(
          'Resend OTP failed:',
          error
        );


        this.otpError =
          'Unable to resend OTP. Please try again.';

      });

  }


  ngOnDestroy(): void {

    this.stopTimer();

  }

}