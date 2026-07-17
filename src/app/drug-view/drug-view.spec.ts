import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DrugViewComponent } from './drug-view';
import { DrugDetail } from '../core/models/drug.model';

describe('DrugView', () => {
  let component: DrugViewComponent;
  let fixture: ComponentFixture<DrugViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugViewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.drug = { id: 1, name: 'Shi Gao', associations: [] } as DrugDetail;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display a Yao yao badge next to effects flagged as such', () => {
    component.drug = {
      id: 1,
      name: 'Shi Gao',
      associations: [],
      effects: [
        { text: 'Clarifie la Chaleur du Qi', yaoYao: true },
        { text: 'Calme la soif', yaoYao: false },
      ],
    } as DrugDetail;

    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Clarifie la Chaleur du Qi');
    expect(text).toContain('Yao yao');
    expect(text).toContain('Calme la soif');
  });
});
