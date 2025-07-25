import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsEditComponent } from './organizational-charts-edit.component';

describe('OrganizationalChartsEditComponent', () => {
  let component: OrganizationalChartsEditComponent;
  let fixture: ComponentFixture<OrganizationalChartsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
