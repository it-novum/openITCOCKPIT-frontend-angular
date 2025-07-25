import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { BadgeComponent, TableDirective } from '@coreui/angular';
import { NodeExtended } from '../dependency-tree.component';
import { GetKeys } from '../../../../../classes/GetKeys';
import { StatusSummaryState, SummaryStateHosts } from '../../../../../pages/hosts/summary_state.interface';

@Component({
    selector: 'oitc-host-group-summary',
    imports: [
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    NgIf,
    TranslocoDirective,
    BadgeComponent,
    NgForOf,
    TableDirective
],
    templateUrl: './host-group-summary.component.html',
    styleUrl: './host-group-summary.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostGroupSummaryComponent {
    @Input() hostgroupSummeryState!: StatusSummaryState;
    @Input() selectedNode!: NodeExtended;
    public TranslocoService: TranslocoService = inject(TranslocoService);

    // By the love of god - how the fuck can we do this the right way?
    // Use GetKeys - this is for reference
    //public HostgroupSummaryStatesHostsKeys = Array<keyof HostgroupSummaryStatesHosts>('0', '1', '2', 'hostIds');
    //public HostgroupSummaryStatesServicesKeys = Array<keyof HostgroupSummaryStatesServices>('0', '1', '2', '3', 'serviceIds');


    public hostSummaryRowLabels: { key: keyof SummaryStateHosts, label: string, queryParams: {} }[] = [
        {
            key: 'state',
            label: this.TranslocoService.translate('State'),
            queryParams: {}
        }, {
            key: 'acknowledged',
            label: this.TranslocoService.translate('Acknowledged'),
            queryParams: {
                'acknowledged': true,

            }
        }, {
            key: 'in_downtime',
            label: this.TranslocoService.translate('In downtime'),
            queryParams: {
                'in_downtime': true
            }
        }, {
            key: 'not_handled',
            label: this.TranslocoService.translate('Not handled'),
            queryParams: {
                'not_acknowledged': true,
                'not_in_downtime': true
            }
        }, {
            key: 'passive',
            label: this.TranslocoService.translate('Passive'),
            queryParams: {
                'passive': true
            }
        }
    ];
    protected readonly Object = Object;

    protected readonly GetKeys = GetKeys;
}
