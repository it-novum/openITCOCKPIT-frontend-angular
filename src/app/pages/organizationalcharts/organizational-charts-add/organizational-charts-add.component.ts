import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
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
import {
    OrganizationalChartsEditorComponent
} from '../organizational-charts-editor/organizational-charts-editor.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { GenericValidationError } from '../../../generic-responses';
import { OrganizationalChartsPost } from '../organizationalcharts.interface';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-organizational-charts-add',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        OrganizationalChartsEditorComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        BadgeComponent,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        XsButtonDirective
    ],
    templateUrl: './organizational-charts-add.component.html',
    styleUrl: './organizational-charts-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsAddComponent implements OnDestroy {

    public createAnother: boolean = false;
    public post: OrganizationalChartsPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;

    public nodeErrors: { [key: number]: GenericValidationError } = {};

    public hasUnsavedChanges: boolean = false;

    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);


    private readonly subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): OrganizationalChartsPost {
        return {
            name: '',
            description: '',
            organizational_chart_connections: [],
            organizational_chart_nodes: []
        };
    }


    public submit(): void {

        this.subscriptions.add(this.OrganizationalChartsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as OrganizationalChartsPost;

                    const title = this.TranslocoService.translate('Organizational chart');
                    const msg = this.TranslocoService.translate('created successfully');
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
