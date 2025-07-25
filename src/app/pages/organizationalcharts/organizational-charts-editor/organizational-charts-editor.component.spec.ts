import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartsEditorComponent } from './organizational-charts-editor.component';

describe('OrganizationalChartsEditorComponent', () => {
  let component: OrganizationalChartsEditorComponent;
  let fixture: ComponentFixture<OrganizationalChartsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationalChartsEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationalChartsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
