import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, Sort } from '@angular/material/sort';
import {
    getDefaultSlaAvailabilityStatusHostsLogIndexParams,
    SlaAvailabilityStatusHostsLogIndexRoot
} from '../sla-availability-status-hosts-log.interface';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';

import { DebounceDirective } from '../../../../../directives/debounce.directive';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AsyncPipe, DecimalPipe, formatDate, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { IndexPage } from '../../../../../pages.interface';
import { SlaAvailabilityStatusHostsLogService } from '../sla-availability-status-hosts-log.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CopyToClipboardComponent } from '../../../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FilterPipe } from '../../../../../pipes/filter.pipe';
import { SlaAvailabilityStatusLogIndexParams } from '../../slas/slas.interface';

@Component({
    selector: 'oitc-sla-availability-status-hosts-log-index',
    imports: [
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        SkeletonModule,
        CopyToClipboardComponent,
        FilterPipe,
        DecimalPipe,
        AsyncPipe
    ],
    templateUrl: './sla-availability-status-hosts-log-index.component.html',
    styleUrl: './sla-availability-status-hosts-log-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaAvailabilityStatusHostsLogIndexComponent implements OnInit, OnDestroy, IndexPage {

    private readonly SlaAvailabilityStatusHostsLogService: SlaAvailabilityStatusHostsLogService = inject(SlaAvailabilityStatusHostsLogService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private cdr = inject(ChangeDetectorRef);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public hideFilter: boolean = true;
    public isLoading: boolean = true;

    protected hostId: number = 0;
    private fromParam: number | null = null;
    private toParam: number | null = null;

    public slaHostAndStatusLog: SlaAvailabilityStatusHostsLogIndexRoot = {} as SlaAvailabilityStatusHostsLogIndexRoot;
    public params: SlaAvailabilityStatusLogIndexParams = getDefaultSlaAvailabilityStatusHostsLogIndexParams(this.fromParam, this.toParam);
    public declineValues: number[] = [];

    public from_time: string = this.params['filter[from]'];
    public to_time: string = this.params['filter[to]'];

    public ngOnInit() {

        this.hostId = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.fromParam = params['from'];
            this.toParam = params['to'];
            this.params = getDefaultSlaAvailabilityStatusHostsLogIndexParams(this.fromParam, this.toParam);
            this.from_time = this.params['filter[from]'];
            this.to_time = this.params['filter[to]'];
            this.load();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {

        this.isLoading = true;

        this.params['filter[from]'] = formatDate(new Date(this.from_time), 'yyyy-MM-ddTHH:mm', 'en-US');
        this.params['filter[to]'] = formatDate(new Date(this.to_time), 'yyyy-MM-ddTHH:mm', 'en-US');

        this.subscriptions.add(this.SlaAvailabilityStatusHostsLogService.getIndex(this.hostId, this.params)
            .subscribe((result: SlaAvailabilityStatusHostsLogIndexRoot) => {
                this.isLoading = false;
                this.slaHostAndStatusLog = result;
                this.createDeclineValues();
                this.cdr.markForCheck();
            }));

    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.params = getDefaultSlaAvailabilityStatusHostsLogIndexParams(this.fromParam, this.toParam);
        this.from_time = this.params['filter[from]'];
        this.to_time = this.params['filter[to]'];
        this.load();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }


    // Callback when a filter has changed
    public onFilterChange(event: Event) {
        this.params.page = 1;
        this.load();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    private createDeclineValues() {
        for (let i = 0; i < this.slaHostAndStatusLog.slaHostStatusLog.length; i++) {
            this.declineValues[i] = this.getDeclineValue(i);
        }
    }

    private getDeclineValue(index: number): number {
        if (index < this.slaHostAndStatusLog.slaHostStatusLog.length - 1) {
            return this.slaHostAndStatusLog.slaHostStatusLog[index + 1].determined_availability_percent - this.slaHostAndStatusLog.slaHostStatusLog[index].determined_availability_percent;
        }
        return 0;
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
        }
    }
}
