import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourLocatorPickerComponent } from './colour-locator-picker.component';

describe('ColourLocatorPickerComponent', () => {
    let component: ColourLocatorPickerComponent;
    let fixture: ComponentFixture<ColourLocatorPickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColourLocatorPickerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ColourLocatorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
