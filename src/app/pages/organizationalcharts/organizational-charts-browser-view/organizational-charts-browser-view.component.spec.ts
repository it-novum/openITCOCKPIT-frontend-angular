import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsBrowserViewComponent } from './organizational-charts-browser-view.component';

describe('OrganizationalChartsViewComponent', () => {
    let component: OrganizationalChartsBrowserViewComponent;
    let fixture: ComponentFixture<OrganizationalChartsBrowserViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrganizationalChartsBrowserViewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OrganizationalChartsBrowserViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
