import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapgeneratorsAddComponent } from './mapgenerators-add.component';

describe('MapgeneratorsAddComponent', () => {
  let component: MapgeneratorsAddComponent;
  let fixture: ComponentFixture<MapgeneratorsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapgeneratorsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapgeneratorsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
