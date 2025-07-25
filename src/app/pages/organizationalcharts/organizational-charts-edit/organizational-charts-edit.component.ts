import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { HistoryService } from '../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { OrganizationalChartsPost } from '../organizationalcharts.interface';
import { GenericValidationError } from '../../../generic-responses';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';


@Component({
    selector: 'oitc-organizational-charts-edit',
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        OrganizationalChartsEditorComponent,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        FormLoaderComponent,
        RouterLink,
        NgIf
    ],
    templateUrl: './organizational-charts-edit.component.html',
    styleUrl: './organizational-charts-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsEditComponent implements OnInit, OnDestroy {

    public post?: OrganizationalChartsPost;
    public errors: GenericValidationError | null = null;

    public nodeErrors: { [key: number]: GenericValidationError } = {};

    public hasUnsavedChanges: boolean = false;

    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadOrganizationalChart(id);
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadOrganizationalChart(id: number) {
        this.subscriptions.add(this.OrganizationalChartsService.getOrganizationalChartEdit(id).subscribe(oc => {
            this.post = oc;
            this.cdr.markForCheck();
        }));
    }

    public submit(): void {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(this.OrganizationalChartsService.saveOrganizationalChartEdit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as OrganizationalChartsPost;

                    const title = this.TranslocoService.translate('Organizational chart');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['organizationalcharts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/organizationalcharts/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.nodeErrors = {};
                    if (errorResponse.hasOwnProperty('organizational_chart_nodes')) {
                        for (let i in errorResponse['organizational_chart_nodes']) {
                            const k = Number(i);
                            this.nodeErrors[k] = (errorResponse['organizational_chart_nodes'][i] as any as GenericValidationError);
                        }
                    }
                }
            }));
    }

}
