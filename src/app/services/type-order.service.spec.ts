import { TestBed } from '@angular/core/testing';

import { TypeOrderService } from './type-order.service';

describe('TypeOrderService', () => {
  let service: TypeOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
