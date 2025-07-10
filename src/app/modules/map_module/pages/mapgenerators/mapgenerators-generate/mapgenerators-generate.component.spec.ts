import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapgeneratorsGenerateComponent } from './mapgenerators-generate.component';

describe('MapgeneratorsGenerateComponent', () => {
    let component: MapgeneratorsGenerateComponent;
    let fixture: ComponentFixture<MapgeneratorsGenerateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MapgeneratorsGenerateComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MapgeneratorsGenerateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
