import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityComponent } from './priority.component';

describe('PriorityComponent', () => {
    let component: PriorityComponent;
    let fixture: ComponentFixture<PriorityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PriorityComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PriorityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
