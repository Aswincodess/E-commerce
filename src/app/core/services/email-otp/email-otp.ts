import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailOtpService {

  private serviceId = 'service_0ltjkl4';

  private templateId = 'template_x8xa1dq';

  private publicKey = 'Jo5JzLbB5eF_TK3aS';


  // Generate 6 digit OTP
  generateOtp(): string {

    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();

  }


  // Send OTP through EmailJS....
  sendOtp(
    name: string,
    email: string,
    otp: string
  ): Promise<void> {

    const templateParams = {

      email: email,

      name: name,

      from_name: 'DeskForge',

      message: otp

    };


    return emailjs
      .send(
        this.serviceId,
        this.templateId,
        templateParams,
        {
          publicKey: this.publicKey
        }
      )
      .then(() => {

        console.log('OTP email sent successfully');

      });

  }


  // Save OTP temporarily
  saveOtp(otp: string): void {

    sessionStorage.setItem(
      'emailOtp',
      otp
    );

    sessionStorage.setItem(
      'emailOtpExpiry',
      (Date.now() + 60 * 1000).toString()
    );

  }


  // Check OTP
  verifyOtp(enteredOtp: string): boolean {

    const savedOtp =
      sessionStorage.getItem('emailOtp');

    const expiry =
      sessionStorage.getItem('emailOtpExpiry');


    if (!savedOtp || !expiry) {

      return false;

    }


    // OTP expired
    if (Date.now() > Number(expiry)) {

      this.clearOtp();

      return false;

    }


    return savedOtp === enteredOtp;

  }


  // Remove OTP
  clearOtp(): void {

    sessionStorage.removeItem('emailOtp');

    sessionStorage.removeItem('emailOtpExpiry');

  }


  // Check whether OTP expired
  isOtpExpired(): boolean {

    const expiry =
      sessionStorage.getItem('emailOtpExpiry');


    if (!expiry) {

      return true;

    }


    return Date.now() > Number(expiry);

  }

}