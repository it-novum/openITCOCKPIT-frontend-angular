/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { ApplicationConfig, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LEGACY_BASE_URL } from "./tokens/legacy-base-url.token";
import { AuthService } from "./auth/auth.service";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { PROXY_PATH } from "./tokens/proxy-path.token";
import { authInterceptor } from "./auth/auth.interceptor";
import { csrfInterceptor } from "./auth/csrf.interceptor";
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { DropdownService } from '@coreui/angular';
import { loaderInterceptor } from './interceptors/loader.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';

//import Aura from '@primeng/themes/aura';
import OItcPrimeNGPreset from './layouts/primeng/primeng.preset';

export const appConfig: ApplicationConfig = {
    providers: [
        {provide: LOCALE_ID, useValue: 'en-US'},
        {provide: LEGACY_BASE_URL, useValue: '/#!'}, // Must be replaced by real staged URL
        {provide: PROXY_PATH, useValue: ''},
        {provide: Window, useValue: window},
        {provide: AuthService, useClass: AuthService},
        provideHttpClient(
            withInterceptors([authInterceptor, csrfInterceptor, loaderInterceptor]),
            /*
            withXsrfConfiguration({
              // cookieName: 'csrfToken',
              headerName: 'x-csrf-token',
            })

             */
        ),
        //importProvidersFrom(BrowserAnimationsModule),

        provideRouter(routes),
        //provideRouter(snmpTrapModuleRoutes),
        provideHttpClient(),
        provideToastr(),
        provideTransloco({
            // All options: https://jsverse.github.io/transloco/docs/getting-started/config-options
            config: {
                availableLangs: ['en_US', 'de_DE', 'es_ES', 'fr_FR', 'pl_PL', 'ru_RU', 'uk_UA'],
                defaultLang: 'en_US',
                failedRetries: 1,
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader
        }),
        provideAnimationsAsync(),
        DropdownService,
        providePrimeNG({
            theme: {
                preset: OItcPrimeNGPreset,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark-theme',
                    cssLayer: false
                }
            }
        })
    ]
};
