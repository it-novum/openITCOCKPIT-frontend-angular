import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationInputComponent } from './duration-input.component';

describe('DurationInputComponent', () => {
    let component: DurationInputComponent;
    let fixture: ComponentFixture<DurationInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DurationInputComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DurationInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
