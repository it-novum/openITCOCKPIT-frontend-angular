import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SummaryStateHosts, SummaryStatesHosts } from '../../../hosts/summary_state.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';
import { RouterLink } from '@angular/router';
import {
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TacticalOverviewHostsWidgetService } from './tactical-overview-hosts-widget.service';
import { TacticalOverviewHostsConfig } from './tactical-overview-hosts-widget.interface';
import { GenericValidationError } from '../../../../generic-responses';
import { NotyService } from '../../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-tactical-overview-hosts-widget',
    imports: [
        FaIconComponent,
        NgIf,
        TranslocoDirective,
        AsyncPipe,
        RouterLink,
        ColComponent,
        DebounceDirective,
        FormCheckInputDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        RowComponent,
        TranslocoPipe,
        FormsModule,
        NgSelectComponent,
        MultiSelectComponent,
        XsButtonDirective
    ],
    templateUrl: './tactical-overview-hosts-widget.component.html',
    styleUrl: './tactical-overview-hosts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TacticalOverviewHostsWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public hoststatusSummary?: SummaryStateHosts;
    public config?: TacticalOverviewHostsConfig;
    protected hostgroups: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    private readonly TacticalOverviewHostsWidgetService = inject(TacticalOverviewHostsWidgetService);
    private readonly notyService = inject(NotyService);


    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadHostgroups('');
            }
            this.cdr.markForCheck();
        });
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.TacticalOverviewHostsWidgetService.getTacticalOverviewWidget(this.widget, 'hosts')
                .subscribe((result) => {
                    this.config = result.config;
                    this.keywords = this.config.Host.keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Host.not_keywords.split(',').filter(Boolean);
                    this.hoststatusSummary = result.hoststatusSummary;
                    this.cdr.markForCheck();
                }));
        }
    }

    protected loadHostgroups = (search: string) => {
        let hostgroupIds: number[] = [];
        if (this.config?.Hostgroup._ids) {
            hostgroupIds = this.config.Hostgroup._ids;
        }
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({
            'filter[Containers.name]': search,
            'selected[]': hostgroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Host.keywords = this.keywords.join(',');
        this.config.Host.not_keywords = this.notKeywords.join(',');

        this.subscriptions.add(this.TacticalOverviewHostsWidgetService.saveWidget(this.widget, this.config)
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
