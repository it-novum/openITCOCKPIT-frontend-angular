import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { NgClass } from '@angular/common';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { HistoryService } from '../../../history.service';
import { TitleService } from '../../../services/title.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { CrganizationalChartsContainer, OrganizationalChartsPost } from '../organizationalcharts.interface';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import {
    OrganizationalChartsViewerComponent
} from '../organizational-charts-viewer/organizational-charts-viewer.component';

@Component({
    selector: 'oitc-organizational-charts-browser-view',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BlockLoaderComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        QueryHandlerCheckerComponent,
        NavComponent,
        NavItemComponent,
        NgClass,
        CardBodyComponent,
        CardFooterComponent,
        SelectComponent,
        RowComponent,
        ColComponent,
        NoRecordsComponent,
        OrganizationalChartsViewerComponent
    ],
    templateUrl: './organizational-charts-browser-view.component.html',
    styleUrl: './organizational-charts-browser-view.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsBrowserViewComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly TitleService: TitleService = inject(TitleService);
    public containerId: number = 0;
    public containers: CrganizationalChartsContainer[] = [];
    public organizationalCharts: SelectKeyValue[] = [];
    public organizationalchartId: number = 0;
    public organizationalChart?: OrganizationalChartsPost;
    public title: string = '';

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            let id: number = params['containerId'] || 0;
            this.organizationalCharts = [];
            if (id) {
                this.containerId = id;
                // Process all query params first and then trigger the load function
                this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartsByContainerId(id)
                    .subscribe((result) => {
                        this.organizationalCharts = result;
                        const found = this.organizationalCharts.find((chart => {
                            return chart.key === this.organizationalchartId
                        }));
                        if (!found) {
                            this.organizationalchartId = 0; // Reset to 0 if not found
                        }
                        if (this.organizationalchartId === 0 && this.organizationalCharts[0]) {
                            this.organizationalchartId = this.organizationalCharts[0].key; // Default to the first organizational chart
                            this.title = this.organizationalCharts[0].value;
                        }
                        this.onOrganizationalchartsChange();
                        this.cdr.markForCheck();

                        // Update the title.
                        this.TitleService.setTitle(`${this.title} | ` + this.TranslocoService.translate('Organizational charts'));
                    })
                );

                this.cdr.markForCheck();
            }
        });

    }

    public onOrganizationalchartsChange() {
        if (this.organizationalchartId) {
            this.organizationalChart = undefined;
            this.cdr.markForCheck();

            this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartById(this.organizationalchartId)
                .subscribe((result) => {
                    this.organizationalChart = result.organizationalChart;
                    this.title = this.organizationalChart.name || '';
                    this.TitleService.setTitle(`${this.title} | ` + this.TranslocoService.translate('Organizational charts'));

                    this.containers = result.containers;
                    this.cdr.markForCheck();
                    return;
                })
            );
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
