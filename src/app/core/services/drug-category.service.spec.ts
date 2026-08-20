import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DrugCategoryService } from './drug-category.service';
import { environment } from '../../../environments/environment';

describe('DrugCategoryService', () => {
  let service: DrugCategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DrugCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('exposes the categories returned by the API', () => {
    service.load();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/drug-categories`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Plantes qui libèrent la surface' }]);

    expect(service.categoriesSignal()).toEqual([
      { id: 1, name: 'Plantes qui libèrent la surface' },
    ]);
  });

  it('logs the failure and keeps the categories empty when the API call fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    service.load();

    httpMock
      .expectOne(`${environment.apiBaseUrl}/api/drug-categories`)
      .flush({ message: 'boom' }, { status: 500, statusText: 'Internal Server Error' });

    expect(consoleError).toHaveBeenCalled();
    expect(service.categoriesSignal()).toEqual([]);

    consoleError.mockRestore();
  });
});
