import { TestBed } from '@angular/core/testing';

import { carts } from './carts.service';

describe('Cart', () => {
  let service: carts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(carts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
