import { TestBed } from '@angular/core/testing';

import { EmailOtpService } from './email-otp';

describe('EmailOtp', () => {
  let service: EmailOtpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailOtpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
