import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DrugsView } from './drugs-view';

describe('DrugsView', () => {
  let component: DrugsView;
  let fixture: ComponentFixture<DrugsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugsView],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
