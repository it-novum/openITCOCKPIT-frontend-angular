import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-browser-menu-loader',
    imports: [
        RowComponent,
        ColComponent,
        SkeletonModule
    ],
    templateUrl: './browser-menu-loader.component.html',
    styleUrl: './browser-menu-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This loader mimics the optic of the menu used on /hosts/browser and /services/browser pages
export class BrowserMenuLoaderComponent {

}
