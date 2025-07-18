import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PagerdutySettingsService } from '../PagerdutySettings.service';
import { Subscription } from 'rxjs';
import { PagerdutySettings } from '../PagerdutySettings.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgIf } from '@angular/common';

import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';


import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';

@Component({
    selector: 'oitc-settings-edit',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormLoaderComponent,
        NgIf,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        PaginatorModule,
        RequiredIconComponent,
        XsButtonDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        ApikeyDocModalComponent
    ],
    templateUrl: './settings-edit.component.html',
    styleUrl: './settings-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsEditComponent implements OnInit, OnDestroy {
    private readonly pagerdutySettingsService: PagerdutySettingsService = inject(PagerdutySettingsService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    protected errors: GenericValidationError | null = null;
    protected currentCommandAsPostRequest: string = '';
    private readonly notyService: NotyService = inject(NotyService);
    protected post?: PagerdutySettings;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(
            this.pagerdutySettingsService.getPagerdutySettings().subscribe((settings: PagerdutySettings): void => {
                    this.post = settings;
                    this.cdr.markForCheck();
                }
            )
        );
        const API_KEY_TRANSLATION = this.TranslocoService.translate('YOUR_API_KEY_HERE');
        this.currentCommandAsPostRequest = `https://${window.location.hostname}/pagerduty_module/acknowledge/submit.json?apikey=${API_KEY_TRANSLATION}`;
        this.cdr.markForCheck();
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    protected updatePagerdutySettings(): void {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(
            this.pagerdutySettingsService.setPagerdutySettings(this.post).subscribe((result: GenericResponseWrapper): void => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        this.errors = null;
                        this.post = result.data as PagerdutySettings;
                        this.notyService.genericSuccess();
                        return;
                    }

                    this.errors = result.data as GenericValidationError;
                    this.notyService.genericError();
                }
            )
        );
    }
}
