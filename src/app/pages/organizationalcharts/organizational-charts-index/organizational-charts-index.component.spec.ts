import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsIndexComponent } from './organizational-charts-index.component';

describe('OrganizationalChartsIndexComponent', () => {
  let component: OrganizationalChartsIndexComponent;
  let fixture: ComponentFixture<OrganizationalChartsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
