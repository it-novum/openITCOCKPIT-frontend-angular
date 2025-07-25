import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsViewerComponent } from './organizational-charts-viewer.component';

describe('OrganizationalChartsViewerComponent', () => {
  let component: OrganizationalChartsViewerComponent;
  let fixture: ComponentFixture<OrganizationalChartsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
