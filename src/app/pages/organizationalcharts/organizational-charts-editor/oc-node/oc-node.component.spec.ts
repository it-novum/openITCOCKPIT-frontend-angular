import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcNodeComponent } from './oc-node.component';

describe('TenantNodeComponent', () => {
    let component: OcNodeComponent;
    let fixture: ComponentFixture<OcNodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OcNodeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OcNodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
