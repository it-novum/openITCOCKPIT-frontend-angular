import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapgeneratorsEditComponent } from './mapgenerators-edit.component';

describe('MapgeneratorsEditComponent', () => {
    let component: MapgeneratorsEditComponent;
    let fixture: ComponentFixture<MapgeneratorsEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapgeneratorsEditComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapgeneratorsEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
