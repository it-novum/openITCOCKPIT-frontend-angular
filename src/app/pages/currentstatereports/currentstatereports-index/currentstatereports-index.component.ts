import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AlertComponent,
  BorderDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormLabelDirective,
  InputGroupComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaLayersComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { ServicesCurrentStateFilter, ServicesLoadServicesByStringParams } from '../../services/services.interface';
import { Subscription } from 'rxjs';
import { ServicesService } from '../../services/services.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericValidationError } from '../../../generic-responses';
import { SelectItemOptionGroup, SelectKeyValueString } from '../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import {
    CurrentStateReportHtmlResponse,
    CurrentStateReportPerfdataArrayValue,
    CurrentStateReportsHtmlParams,
    CurrentStateReportsPdfParams,
    ReportFormat
} from '../currentstatereports.interface';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { CurrentstatereportsService } from '../currentstatereports.service';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';

import { BadgeOutlineComponent } from '../../../layouts/coreui/badge-outline/badge-outline.component';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import {
    CurrentstatereportPerfdataGaugesComponent
} from './currentstatereport-perfdata-gauges/currentstatereport-perfdata-gauges.component';
import { saveAs } from 'file-saver';

@Component({
    selector: 'oitc-currentstatereports-index',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    PermissionDirective,
    QueryHandlerCheckerComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    CardFooterComponent,
    NgIf,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    InputGroupComponent,
    MultiSelectOptgroupComponent,
    RequiredIconComponent,
    RowComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    BorderDirective,
    NgForOf,
    NgClass,
    TranslocoPipe,
    LabelLinkComponent,
    DowntimeIconComponent,
    AcknowledgementIconComponent,
    TableDirective,
    FaLayersComponent,
    BadgeOutlineComponent,
    ContainerComponent,
    TrustAsHtmlPipe,
    CurrentstatereportPerfdataGaugesComponent,
    AlertComponent
],
    templateUrl: './currentstatereports-index.component.html',
    styleUrl: './currentstatereports-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentstatereportsIndexComponent implements OnInit, OnDestroy {
    public TranslocoService: TranslocoService = inject(TranslocoService);


    public isGeneratingReport: boolean = false;
    public services: SelectItemOptionGroup[] = [];
    public selectedServices: number[] = [];
    public errors: GenericValidationError | null = null;
    public selectedFormat: ReportFormat = 'html';
    public formats: SelectKeyValueString[] = [
        {key: 'html', value: this.TranslocoService.translate('HTML')},
        {key: 'pdf', value: this.TranslocoService.translate('PDF')}
    ];

    public report?: CurrentStateReportHtmlResponse;

    // Filter vars
    public currentStateFilter: ServicesCurrentStateFilter = {
        ok: true,
        warning: true,
        critical: true,
        unknown: true
    };
    public state_typesFilter = {
        soft: false,
        hard: false
    };
    public acknowledgementsFilter = {
        acknowledged: false,
        not_acknowledged: false
    };
    public downtimeFilter = {
        in_downtime: false,
        not_in_downtime: false
    };
    public checkTypeFilter = {
        active: false,
        passive: false
    };

    private subscriptions: Subscription = new Subscription();

    private readonly CurrentstatereportsService: CurrentstatereportsService = inject(CurrentstatereportsService);
    private readonly ServicesService: ServicesService = inject(ServicesService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.loadServices('');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadServices = (searchString: string) => {
        let selected: number[] = [];
        if (this.selectedServices) {
            selected = this.selectedServices;
        }
        let params: ServicesLoadServicesByStringParams = {
            angular: true,
            'filter[servicename]': searchString,
            'filter[Services.disabled]': 0,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.ServicesService.loadServicesByString(params)
            .subscribe((result) => {
                this.services = result;
                this.cdr.markForCheck();
            })
        );
    }

    public generateReport() {
        this.isGeneratingReport = true;

        if (this.selectedFormat === 'pdf') {
            // Generate PDF report

            let params: CurrentStateReportsPdfParams = {
                angular: true,
                'data[current_state][ok]': this.currentStateFilter.ok,
                'data[current_state][warning]': this.currentStateFilter.warning,
                'data[current_state][critical]': this.currentStateFilter.critical,
                'data[current_state][unknown]': this.currentStateFilter.unknown,
                'data[services][]': this.selectedServices,
                'data[Servicestatus][current_state][]': [],
                'data[Servicestatus][hasBeenAcknowledged]': '',
                'data[Servicestatus][inDowntime]': '',
                'data[Servicestatus][passive]': this.checkTypeFilter.passive ? false : ''
            }

            if (this.currentStateFilter.ok) {
                params['data[Servicestatus][current_state][]'].push(0);
            }
            if (this.currentStateFilter.warning) {
                params['data[Servicestatus][current_state][]'].push(1);
            }
            if (this.currentStateFilter.critical) {
                params['data[Servicestatus][current_state][]'].push(2);
            }
            if (this.currentStateFilter.unknown) {
                params['data[Servicestatus][current_state][]'].push(3);
            }

            if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
                params['data[Servicestatus][hasBeenAcknowledged]'] = this.acknowledgementsFilter.acknowledged === true;
            }

            if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
                params['data[Servicestatus][inDowntime]'] = this.downtimeFilter.in_downtime === true;
            }

            this.subscriptions.add(this.CurrentstatereportsService.validateReportFormForPdf(params)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        // Success - Form data is valid - now we can generate the report
                        const filename = result.data.filename;
                        this.subscriptions.add(this.CurrentstatereportsService.generateReportPdf(params).subscribe({
                            next: (data: Blob) => {
                                this.isGeneratingReport = false;
                                const blob = new Blob([data], {type: 'application/pdf'});

                                // Open save as dialog in all browsers
                                saveAs(blob, filename);
                            },
                            error: (data: any) => {
                                this.notyService.genericError(
                                    this.TranslocoService.translate('An error occured while generating the report')
                                );
                            }
                        }));
                    } else {
                        // Error - dispaly form validation errors
                        this.isGeneratingReport = false;
                        this.notyService.genericError();
                        this.errors = result.data as GenericValidationError;
                    }
                })
            );

        } else {
            // Generate HTML report

            let params: CurrentStateReportsHtmlParams = {
                services: this.selectedServices,
                Servicestatus: {
                    current_state: [],
                    hasBeenAcknowledged: null,
                    inDowntime: null,
                    passive: null
                },
                // For some reason, the API requires an object AND an array of integers
                current_state: this.currentStateFilter
            }

            if (this.currentStateFilter.ok) {
                params.Servicestatus.current_state.push(0);
            }
            if (this.currentStateFilter.warning) {
                params.Servicestatus.current_state.push(1);
            }
            if (this.currentStateFilter.critical) {
                params.Servicestatus.current_state.push(2);
            }
            if (this.currentStateFilter.unknown) {
                params.Servicestatus.current_state.push(3);
            }

            if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
                params.Servicestatus.hasBeenAcknowledged = this.acknowledgementsFilter.acknowledged === true;
            }

            if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
                params.Servicestatus.inDowntime = this.downtimeFilter.in_downtime === true;
            }

            if (this.checkTypeFilter.active !== this.checkTypeFilter.passive) {
                // This becomes WHERE Servicestatus.active_checks_enabled 🤦‍♂️
                if (this.checkTypeFilter.active) {
                    params.Servicestatus.passive = true;
                }

                if (this.checkTypeFilter.passive) {
                    params.Servicestatus.passive = false;
                }
            }

            this.subscriptions.add(this.CurrentstatereportsService.createReportHtml(params)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    this.isGeneratingReport = false;
                    if (result.success) {
                        // Success

                        this.report = result.data as CurrentStateReportHtmlResponse;
                        this.errors = null;
                        return
                    }

                    // Error
                    this.notyService.genericError();
                    this.errors = result.data as GenericValidationError;
                })
            );

        }


    }

    public currentHostStateToBsClass = (currentState: number): 'success' | 'danger' | 'secondary' => {
        switch (currentState) {
            case 0:
                return 'success';
            case 1:
                return 'danger';
            default:
                return 'secondary';
        }
    }


    public currentServiceStateToBsClass = (currentState: number): 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (currentState) {
            case 0:
                return 'success';
            case 1:
                return 'warning';
            case 2:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    public getPerfdataAsArray(perfdata: any[] | {
        [key: string]: CurrentStateReportPerfdataArrayValue
    }): CurrentStateReportPerfdataArrayValue[] {
        // the server result is a hashmap - not an array.
        // We convert this into an array for easier handling in the template

        if (Array.isArray(perfdata)) {
            return perfdata;
        }

        return Object.values(perfdata);

    }

    protected readonly Object = Object;
    protected readonly Number = Number;
    protected readonly String = String;
}
