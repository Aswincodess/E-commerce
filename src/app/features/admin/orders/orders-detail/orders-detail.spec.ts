import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsComponent } from './orders-detail.component';

describe('OrdersDetail', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
