import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRecordsComponent } from './no-records.component';

describe('NoRecordsComponent', () => {
    let component: NoRecordsComponent;
    let fixture: ComponentFixture<NoRecordsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoRecordsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NoRecordsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
