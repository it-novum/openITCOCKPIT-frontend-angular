import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcNodeViewerComponent } from './oc-node-viewer.component';

describe('OcNodeViewerComponent', () => {
  let component: OcNodeViewerComponent;
  let fixture: ComponentFixture<OcNodeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcNodeViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcNodeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
