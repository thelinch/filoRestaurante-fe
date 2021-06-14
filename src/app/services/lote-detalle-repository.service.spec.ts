import { TestBed } from '@angular/core/testing';

import { LoteDetalleRepositoryService } from './lote-detalle-repository.service';

describe('LoteDetalleRepositoryService', () => {
  let service: LoteDetalleRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteDetalleRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
