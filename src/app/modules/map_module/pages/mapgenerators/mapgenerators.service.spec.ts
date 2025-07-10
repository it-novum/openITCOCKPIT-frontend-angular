import { TestBed } from '@angular/core/testing';

import { MapgeneratorsService } from './mapgenerators.service';

describe('MapgeneratorsService', () => {
  let service: MapgeneratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapgeneratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
