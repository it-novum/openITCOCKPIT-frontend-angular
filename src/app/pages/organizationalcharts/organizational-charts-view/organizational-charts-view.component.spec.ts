import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsViewComponent } from './organizational-charts-view.component';

describe('OrganizationalChartsViewComponent', () => {
  let component: OrganizationalChartsViewComponent;
  let fixture: ComponentFixture<OrganizationalChartsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
