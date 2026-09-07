import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBuild } from './custom-build.component';

describe('CustomBuild', () => {
  let component: CustomBuild;
  let fixture: ComponentFixture<CustomBuild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomBuild],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomBuild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
