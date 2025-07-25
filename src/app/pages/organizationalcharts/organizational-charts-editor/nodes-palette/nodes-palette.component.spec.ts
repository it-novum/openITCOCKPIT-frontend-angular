import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesPaletteComponent } from './nodes-palette.component';

describe('NodesPaletteComponent', () => {
  let component: NodesPaletteComponent;
  let fixture: ComponentFixture<NodesPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodesPaletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodesPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
