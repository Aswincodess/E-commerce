import { Injectable } from '@angular/core';

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

import { firebaseApp } from './firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  private auth = getAuth(firebaseApp);

  private recaptchaVerifier!: RecaptchaVerifier;

  private confirmationResult!: ConfirmationResult;


  setupRecaptcha(): void {

    this.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      'recaptcha-container',
      {
        size: 'normal',

        callback: () => {
          console.log('reCAPTCHA completed');
        },

        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      }
    );

    this.recaptchaVerifier.render()
      .then(() => {
        console.log('reCAPTCHA rendered successfully');
      })
      .catch((error) => {
        console.error(
          'reCAPTCHA render failed:',
          error
        );
      });

  }


  sendOtp(phoneNumber: string): Promise<void> {

    return signInWithPhoneNumber(
      this.auth,
      phoneNumber,
      this.recaptchaVerifier
    )
      .then((result) => {

        this.confirmationResult = result;

        console.log('OTP sent successfully');

      });

  }


  verifyOtp(otp: string): Promise<void> {

    return this.confirmationResult
      .confirm(otp)
      .then(() => {

        console.log(
          'Phone number verified successfully'
        );

      });

  }

}