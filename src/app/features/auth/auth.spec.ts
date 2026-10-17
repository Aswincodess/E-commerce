import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auths } from './auth';

describe('Auth', () => {
  let component: Auths;
  let fixture: ComponentFixture<Auths>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auths],
    }).compileComponents();

    fixture = TestBed.createComponent(Auths);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
