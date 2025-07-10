import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapgeneratorsIndexComponent } from './mapgenerators-index.component';

describe('MapgeneratorsIndexComponent', () => {
    let component: MapgeneratorsIndexComponent;
    let fixture: ComponentFixture<MapgeneratorsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapgeneratorsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapgeneratorsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
