import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SummaryStateServices } from '../../../hosts/summary_state.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TacticalOverviewServicesWidgetService } from './tactical-overview-services-widget.service';
import { GenericValidationError } from '../../../../generic-responses';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ServicegroupsService } from '../../../servicegroups/servicegroups.service';
import { TacticalOverviewServicesConfig } from './tactical-overview-services-widget.interface';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import {
    ButtonDirective,
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';

@Component({
    selector: 'oitc-tactical-overview-services-widget',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslocoDirective,
        NgIf,
        FaIconComponent,
        AsyncPipe,
        RouterLink,
        TranslocoPipe,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        DebounceDirective,
        FormCheckInputDirective,
        RegexHelperTooltipComponent,
        NgSelectComponent,
        MultiSelectComponent,
        ButtonDirective

    ],
    templateUrl: './tactical-overview-services-widget.component.html',
    styleUrl: './tactical-overview-services-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TacticalOverviewServicesWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    public servicestatusSummary?: SummaryStateServices;
    public config?: TacticalOverviewServicesConfig;
    protected servicegroups: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    private readonly TacticalOverviewServicesWidgetService = inject(TacticalOverviewServicesWidgetService);
    private readonly notyService = inject(NotyService);

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadServicegroups('');
            }
            this.cdr.markForCheck();
        });
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.TacticalOverviewServicesWidgetService.getTacticalOverviewWidget(this.widget, 'services')
                .subscribe((result) => {
                    this.config = result.config;
                    this.keywords = this.config.Service.keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Service.not_keywords.split(',').filter(Boolean);
                    this.servicestatusSummary = result.servicestatusSummary;
                    this.cdr.markForCheck();
                }));
        }
    }

    protected loadServicegroups = (search: string) => {
        let servicegroupIds: number[] = [];
        if (this.config?.Servicegroup._ids) {
            servicegroupIds = this.config.Servicegroup._ids;
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString({
            'filter[Containers.name]': search,
            'selected[]': servicegroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
            this.cdr.markForCheck();
        }));
    }

    public onFilterChange($event: any) {
        this.cdr.markForCheck();
        this.load();
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Service.keywords = this.keywords.join(',');
        this.config.Service.not_keywords = this.notKeywords.join(',');

        this.subscriptions.add(this.TacticalOverviewServicesWidgetService.saveWidget(this.widget, this.config)
            .subscribe({
                next: (result) => {
                    this.cdr.markForCheck();
                    const title = this.TranslocoService.translate('Success');
                    const msg = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.notyService.scrollContentDivToTop();
                    this.load();
                    this.flipped.set(false);

                    return;
                },
                // Error
                error: (error) => {
                    const errorResponse = error as GenericValidationError;
                    this.notyService.genericError();
                }
            }));

    }
}
