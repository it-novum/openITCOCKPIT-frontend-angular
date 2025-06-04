import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramSettingsIndexComponent } from './telegram-settings-index.component';

describe('TelegramSettingsIndexComponent', () => {
  let component: TelegramSettingsIndexComponent;
  let fixture: ComponentFixture<TelegramSettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelegramSettingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelegramSettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
