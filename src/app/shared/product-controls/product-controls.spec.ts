import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductControls } from './product-controls';

describe('ProductControls', () => {
  let component: ProductControls;
  let fixture: ComponentFixture<ProductControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductControls],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
