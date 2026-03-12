import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationItem } from './medication-item';

describe('MedicationItem', () => {
  let component: MedicationItem;
  let fixture: ComponentFixture<MedicationItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
