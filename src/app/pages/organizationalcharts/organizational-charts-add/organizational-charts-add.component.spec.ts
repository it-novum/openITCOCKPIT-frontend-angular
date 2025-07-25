import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsAddComponent } from './organizational-charts-add.component';

describe('OrganizationalChartsAddComponent', () => {
  let component: OrganizationalChartsAddComponent;
  let fixture: ComponentFixture<OrganizationalChartsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
