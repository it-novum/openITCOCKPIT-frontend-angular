import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { MatSort } from '@angular/material/sort';
import { TableDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-table-loader',
    imports: [
        TableModule,
        SkeletonModule,
        MatSort,
        TableDirective
    ],
    templateUrl: './table-loader.component.html',
    styleUrl: './table-loader.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

// This loader mimics the optic of a table that is loading data
export class TableLoaderComponent {

}
