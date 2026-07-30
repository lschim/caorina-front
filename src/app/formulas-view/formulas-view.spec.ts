import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormulasView } from './formulas-view';

describe('FormulasView', () => {
  let fixture: ComponentFixture<FormulasView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulasView],
    }).compileComponents();
    fixture = TestBed.createComponent(FormulasView);
    fixture.detectChanges();
  });

  it('shows a coming-soon message', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('bientôt');
  });
});
