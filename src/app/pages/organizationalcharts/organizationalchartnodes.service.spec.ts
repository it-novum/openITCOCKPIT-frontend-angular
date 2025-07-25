import { TestBed } from '@angular/core/testing';

import { OrganizationalChartNodesService } from './organizationalchartnodes.service';

describe('OrganizationalChartNodesService', () => {
    let service: OrganizationalChartNodesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OrganizationalChartNodesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
