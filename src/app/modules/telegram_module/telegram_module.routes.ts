import { Routes } from '@angular/router';

export const telegramModuleRoutes: Routes = [{
    path: 'telegram_module/TelegramSettings/index',
    loadComponent: () => import('./pages/TelegramSettings/telegram-settings-index/telegram-settings-index.component').then(m => m.TelegramSettingsIndexComponent)
}];
