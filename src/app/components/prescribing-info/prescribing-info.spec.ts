import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribingInfo } from './prescribing-info';

describe('PrescribingInfo', () => {
  let component: PrescribingInfo;
  let fixture: ComponentFixture<PrescribingInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescribingInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescribingInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
