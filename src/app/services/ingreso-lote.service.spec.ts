import { TestBed } from '@angular/core/testing';

import { IngresoLoteService } from './ingreso-lote.service';

describe('IngresoLoteService', () => {
  let service: IngresoLoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresoLoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
