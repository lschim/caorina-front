import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugPreview } from './drug-preview';
import { Drug } from '../core/models/drug.model';

describe('DrugPreview', () => {
  let component: DrugPreview;
  let fixture: ComponentFixture<DrugPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugPreview);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.drug = { id: 1, name: 'Shi Gao' } as Drug;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
