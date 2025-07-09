import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    Renderer2,
    signal
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ColorModeService, ContainerComponent, ModalService, ShadowOnScrollDirective } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { HistoryService } from './history.service';
//import { TranslocoService } from '@jsverse/transloco';
//import { NgSelectConfig } from '@ng-select/ng-select';
import { CoreuiHeaderComponent } from './layouts/coreui/coreui-header/coreui-header.component';
import { CoreuiNavbarComponent } from './layouts/coreui/coreui-navbar/coreui-navbar.component';
import { GlobalLoaderComponent } from './layouts/coreui/global-loader/global-loader.component';
import { AsyncPipe, DOCUMENT, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutOptions, LayoutService } from './layouts/coreui/layout.service';

import {
    MessageOfTheDayModalComponent
} from './components/message-of-the-day-modal/message-of-the-day-modal.component';
import { CurrentMessageOfTheDay } from './pages/messagesotd/messagesotd.interface';
import { MessagesOfTheDayService } from './pages/messagesotd/messagesotd.service';
import { AuthService } from './auth/auth.service';
import { TitleService } from './services/title.service';
import { SystemnameService } from './services/systemname.service';
import { PermissionsService } from './permissions/permissions.service';

@Component({
    selector: 'oitc-root',
    imports: [
        RouterOutlet,
        FontAwesomeModule,
        ContainerComponent,
        CoreuiHeaderComponent,
        CoreuiNavbarComponent,
        GlobalLoaderComponent,
        ShadowOnScrollDirective,
        NgIf,
        AsyncPipe,
        NgClass,
        MessageOfTheDayModalComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

    // Inject HistoryService to keep track of the previous URLs
    private historyService: HistoryService = inject(HistoryService);

    // I am the current messageOfTheDay.
    protected messageOfTheDay: CurrentMessageOfTheDay = {} as CurrentMessageOfTheDay;

    public readonly LayoutService = inject(LayoutService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TitleService: TitleService = inject(TitleService);
    private readonly document = inject(DOCUMENT);
    private readonly renderer: Renderer2 = inject(Renderer2);
    private navigationEndEvent: NavigationEnd | null = null;

    protected systemName: string = '';

    private subscription: Subscription = new Subscription();
    private mediaQueryList: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    constructor(library: FaIconLibrary,
                private router: Router,
                private IconSetService: IconSetService,
                // private selectConfig: NgSelectConfig,
                // private TranslocoService: TranslocoService,
                private colorService: ColorModeService,
                private cdr: ChangeDetectorRef,
                private MessageOfTheDayService: MessagesOfTheDayService,
                private readonly AuthService: AuthService,
                private readonly SystemnameService: SystemnameService,
                private readonly ModalService: ModalService,
    ) {
        // Add an icon to the library for convenient access in other components
        library.addIconPacks(fas);
        library.addIconPacks(far);
        library.addIconPacks(fab);

        this.IconSetService.icons = {...iconSubset};


        // Subscribe to the color mode changes (drop down menu in header)
        // This is to sync the selected theme color from CoreUI with Angular Material and PrimeNG
        const colorMode$ = toObservable(this.colorService.colorMode);
        this.subscription.add(colorMode$.subscribe((theme) => {
            // theme can be one of 'light', 'dark', 'auto' or undefined
            if (theme) {
                if (theme === 'dark') {
                    this.LayoutService.setTheme('dark');
                } else if (theme === 'auto') {
                    const osSystemDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (osSystemDarkModeEnabled) {
                        this.LayoutService.setTheme('dark');
                    } else {
                        this.LayoutService.setTheme('light');
                    }
                } else {
                    this.LayoutService.setTheme('light');
                }
            }
        }));

        // Fetch the message of the day
        this.watchMessageOfTheDay();

        // Fetch the systemname
        this.watchSystemname();
    }

    private watchSystemname(): void {
        this.subscription.add(this.SystemnameService.systemName$.subscribe((systemName: string) => {
            this.systemName = `${systemName}`;
            this.TitleService.setSystemName(systemName);
        }));
    }

    private watchMessageOfTheDay(): void {
        this.subscription.add(this.AuthService.authenticated$.subscribe((isLoggedIn) => {
            if (!isLoggedIn) {
                return;
            }
            // Solely fetch the current message of the day.
            this.subscription.add(this.MessageOfTheDayService.getCurrentMessageOfTheDay().subscribe((message: CurrentMessageOfTheDay) => {
                if (!message.messageOtdAvailable) {
                    this.cdr.markForCheck();
                    return;
                }
                this.messageOfTheDay = message;
                if (!message.showMessageAfterLogin) {
                    this.cdr.markForCheck();
                    return;
                }
                window.setTimeout(() => {
                    this.ModalService.toggle({
                        show: true,
                        id: 'messageOfTheDayModal'
                    });
                }, 500)
                this.cdr.markForCheck();
            }));
        }));
    }

    ngOnInit(): void {
        this.appendCustomStyle();
    }

    private appendCustomStyle(): void {
        this.PermissionsService.hasModuleObservable('DesignModule').subscribe(hasModule => {
            if (!hasModule) {
                return;
            }
            let link = this.renderer.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = `https://master/design_module/css/customStyle.css?v=${new Date().getTime()}`;
            this.renderer.appendChild(document.head, link);
        });
    }

    public ngOnDestroy(): void {
        this.mediaQueryList.removeEventListener('change', this.mediaQueryEventHandler);
        this.subscription.unsubscribe();
    }

    public ngAfterViewInit(): void {
        // Subscribe to route changes
        this.subscription.add(this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.navigationEndEvent = event;
                this.cdr.markForCheck();
                // Leave title empty to let the TitleService figure out the title itself.
                this.TitleService.setTitle();
            }
        }));

        // We are in the first page load (or hard refresh F5)
        // Check if the user has any preferred theme set in the local storage
        const coreUiTheme: 'light' | 'dark' | 'auto' | null = this.colorService.getStoredTheme('openitcockpit-theme-default');
        if (coreUiTheme === 'light' || coreUiTheme === 'dark') {
            // User has set a theme
            setTimeout(() => {
                // Tell CoreUi about the theme choice so it is marked in the dropdown menu
                this.LayoutService.setTheme(coreUiTheme);
            }, 100);
        } else {
            // User has not set a theme - let the OS decide
            setTimeout(() => {
                // Force CoreUI to use the OS theme
                this.colorService.colorMode.set('auto');
            }, 100);
        }

        // Add new Event Listener to fetch when the OS theme changes
        // Auto Dark Mode on macOS or Windows for example
        this.mediaQueryList.addEventListener('change', this.mediaQueryEventHandler);
    }

    private mediaQueryEventHandler = (event: MediaQueryListEvent) => {
        const coreUiTheme: 'light' | 'dark' | 'auto' | null = this.colorService.getStoredTheme('openitcockpit-theme-default');
        if (coreUiTheme === 'auto' || coreUiTheme === null) {
            let theme: 'light' | 'dark' = 'light';
            if (event.matches) {
                theme = 'dark';
            }

            // Update CoreUI
            this.document.documentElement.dataset['coreuiTheme'] = theme;
            const eventName = signal('ColorSchemeChange');
            this.document.documentElement.dispatchEvent(new Event(eventName()));

            // Update Angular Material and PrimeNG
            this.LayoutService.setTheme(theme);
        }
    }

    protected readonly LayoutOptions = LayoutOptions;
}
