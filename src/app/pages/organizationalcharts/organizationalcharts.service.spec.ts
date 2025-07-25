import { TestBed } from '@angular/core/testing';

import { OrganizationalChartsService } from './organizationalcharts.service';

describe('OrganizationalChartsService', () => {
    let service: OrganizationalChartsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OrganizationalChartsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
