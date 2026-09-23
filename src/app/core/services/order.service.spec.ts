import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service.js';

describe('OrderServiceTs', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
