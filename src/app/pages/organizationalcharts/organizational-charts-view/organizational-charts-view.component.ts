import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { OrganizationalChartsPost } from '../organizationalcharts.interface';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { TitleService } from '../../../services/title.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import { NgIf } from '@angular/common';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    OrganizationalChartsViewerComponent
} from '../organizational-charts-viewer/organizational-charts-viewer.component';
import { BackButtonDirective } from '../../../directives/back-button.directive';

@Component({
    selector: 'oitc-organizational-charts-view',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        BlockLoaderComponent,
        OrganizationalChartsViewerComponent,
        BackButtonDirective
    ],
    templateUrl: './organizational-charts-view.component.html',
    styleUrl: './organizational-charts-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsViewComponent implements OnInit, OnDestroy {

    public organizationalChart?: OrganizationalChartsPost;
    public title: string = '';
    public allowEdit: boolean = false;

    private organizationalChartId: number = 0;

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);
    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly TitleService: TitleService = inject(TitleService);

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.organizationalChartId = id;
            this.loadOrganizationalChart();
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadOrganizationalChart() {
        this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartById(this.organizationalChartId)
            .subscribe((result) => {
                this.organizationalChart = result.organizationalChart;
                this.allowEdit = result.allowEdit;

                this.title = this.organizationalChart.name || '';
                this.TitleService.setTitle(`${this.title} | ` + this.TranslocoService.translate('Organizational charts'));

                this.cdr.markForCheck();
                return;
            }));
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
