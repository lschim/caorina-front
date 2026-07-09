import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugViewComponent } from './drug-view';

describe('DrugView', () => {
  let component: DrugViewComponent;
  let fixture: ComponentFixture<DrugViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
