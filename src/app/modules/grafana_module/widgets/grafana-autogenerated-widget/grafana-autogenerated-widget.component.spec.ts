import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaAutogeneratedWidgetComponent } from './grafana-autogenerated-widget.component';

describe('GrafanaAutogeneratedWidgetComponent', () => {
  let component: GrafanaAutogeneratedWidgetComponent;
  let fixture: ComponentFixture<GrafanaAutogeneratedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaAutogeneratedWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaAutogeneratedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
