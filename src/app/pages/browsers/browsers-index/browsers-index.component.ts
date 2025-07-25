import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    getDefaultHostsIndexFilter,
    getDefaultHostsIndexParams,
    getHostCurrentStateForApi,
    HostObject,
    HostsCurrentStateFilter,
    HostsIndexFilter,
    HostsIndexParams,
    HostsIndexRoot
} from '../../hosts/hosts.interface';
import { Subscription } from 'rxjs';
import { ContainerTypesEnum, ROOT_CONTAINER } from '../../changelogs/object-types.enum';
import { HostsService } from '../../hosts/hosts.service';
import { BrowsersService } from '../browsers.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { HttpParams } from '@angular/common/http';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import {
    HostAcknowledgeItem,
    HostDisableNotificationsItem,
    HostDowntimeItem,
    HostEnableNotificationsItem
} from '../../../services/external-commands.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { HostBrowserTabs } from '../../hosts/hosts.enum';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import {
    HostAcknowledgeModalComponent
} from '../../../components/hosts/host-acknowledge-modal/host-acknowledge-modal.component';
import {
    HostsAddToHostgroupComponent
} from '../../../components/hosts/hosts-add-to-hostgroup/hosts-add-to-hostgroup.component';
import {
    HostsDisableNotificationsModalComponent
} from '../../../components/hosts/hosts-disable-notifications-modal/hosts-disable-notifications-modal.component';
import {
    HostsEnableNotificationsModalComponent
} from '../../../components/hosts/hosts-enable-notifications-modal/hosts-enable-notifications-modal.component';
import {
    HostsMaintenanceModalComponent
} from '../../../components/hosts/hosts-maintenance-modal/hosts-maintenance-modal.component';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import {
    QueryHandlerCheckerComponent
} from '../../../layouts/coreui/query-handler-checker/query-handler-checker.component';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { TrustAsHtmlPipe } from '../../../pipes/trust-as-html.pipe';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BrowsersContainer, BrowsersIndexResponse, StatuscountResponse } from '../browsers.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { HostPieChartComponent } from '../../../components/charts/host-pie-chart/host-pie-chart.component';
import { ServicePieChartComponent } from '../../../components/charts/service-pie-chart/service-pie-chart.component';
import {
    ColumnsConfigExportModalComponent
} from '../../../layouts/coreui/columns-config-export-modal/columns-config-export-modal.component';
import {
    ColumnsConfigImportModalComponent
} from '../../../layouts/coreui/columns-config-import-modal/columns-config-import-modal.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { IndexPage } from '../../../pages.interface';
import { TitleService } from '../../../services/title.service';

@Component({
    selector: 'oitc-browsers-index',
    imports: [
        AcknowledgementIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        CopyToClipboardComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DisableModalComponent,
        DowntimeIconComponent,
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        FaStackComponent,
        FaStackItemSizeDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        HostAcknowledgeModalComponent,
        HostsAddToHostgroupComponent,
        HostsDisableNotificationsModalComponent,
        HostsEnableNotificationsModalComponent,
        HostsMaintenanceModalComponent,
        HoststatusIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgSelectComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PaginatorModule,
        PermissionDirective,
        QueryHandlerCheckerComponent,
        RegexHelperTooltipComponent,
        RowComponent,
        SelectAllComponent,
        ServiceResetChecktimeModalComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        TrustAsHtmlPipe,
        XsButtonDirective,
        RouterLink,
        NgClass,
        TooltipDirective,
        BlockLoaderComponent,
        HostPieChartComponent,
        ServicePieChartComponent,
        ColumnsConfigExportModalComponent,
        ColumnsConfigImportModalComponent,
        AsyncPipe
    ],
    templateUrl: './browsers-index.component.html',
    styleUrl: './browsers-index.component.css',
    providers: [
        {provide: DISABLE_SERVICE_TOKEN, useClass: HostsService},
        {provide: DELETE_SERVICE_TOKEN, useClass: HostsService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowsersIndexComponent implements OnInit, OnDestroy, IndexPage {
// Filter vars
    public params: HostsIndexParams = getDefaultHostsIndexParams();
    public filter: HostsIndexFilter = getDefaultHostsIndexFilter();
    public currentStateFilter: HostsCurrentStateFilter = {
        up: false,
        down: false,
        unreachable: false
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
    public notificationsFilter = {
        enabled: false,
        not_enabled: false
    };
    public priorityFilter: { [key: string]: boolean } = {
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false
    };

    // Filter end

    public containerId: number = 0;
    public containers?: BrowsersIndexResponse;
    public organizationalCharts: SelectKeyValue[] = [];
    public statusCounts?: StatuscountResponse;
    public containerFilter: string = '';
    public hosts?: HostsIndexRoot;
    public hideFilter: boolean = true;

    public hostTypes: any[] = [];
    public selectedItems: any[] = [];
    public userFullname: string = '';

    public columnsTableKey: string = 'HostsBrowserColumns';
    public showColumnConfig: boolean = false;
    public configString: string = ''
    public fields: boolean[] = [true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, false, false]; //default fields to show
    //fields for column configuration
    public fieldNames: string[] = [
        'Hoststatus',
        'is acknowledged',
        'is in downtime',
        'Notifications enabled',
        'Shared',
        'Passively transferred host',
        'Priority',
        'Host name',
        'Host description',
        'IP address',
        'Last state change',
        'Last check',
        'Host output',
        'Instance',
        'Service Summary ',
        'Host notes',
        'Host type'
    ];

    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly HostsService = inject(HostsService);
    private readonly BrowsersService = inject(BrowsersService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);
    private readonly LocalStorageService = inject(LocalStorageService);
    private readonly TitleService: TitleService = inject(TitleService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.loadColumns();
        this.route.queryParams.subscribe(params => {
            let containerId = params['containerId'] || ROOT_CONTAINER;
            this.organizationalCharts = [];
            if (containerId) {
                this.params.BrowserContainerId = parseInt(containerId, 10);
                this.containerId = parseInt(containerId, 10);
            }

            // Process all query params first and then trigger the load function

            this.subscriptions.add(this.BrowsersService.getIndex(this.containerId)
                .subscribe((result) => {
                    this.containers = result;
                    this.organizationalCharts = result.organizationalCharts;
                    this.cdr.markForCheck();

                    // Update the title.
                    let newTitle: string = this.containers.breadcrumbs[this.containers.breadcrumbs.length - 1].value;
                    this.TitleService.setTitle(`${newTitle} | ` + this.TranslocoService.translate('Browser'));
                })
            );


            // ITC-3258 isRecursiveBrowserEnabled is now also hardcoded in the AngularController
            this.loadStatusCounts(this.containerId);

            // If isRecursiveBrowserEnabled is enabled or not is hardcoded in the HostsController
            this.loadHosts();
            this.cdr.markForCheck();
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadStatusCounts(containerId: number) {
        this.subscriptions.add(this.BrowsersService.getStatusCountsByContainer([containerId])
            .subscribe((result) => {
                this.statusCounts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadHosts() {
        this.SelectionServiceService.deselectAll();

        let hasBeenAcknowledged = '';
        let inDowntime = '';
        let notificationsEnabled = '';
        if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
            hasBeenAcknowledged = String(this.acknowledgementsFilter.acknowledged === true);
        }
        if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
            inDowntime = String(this.downtimeFilter.in_downtime === true);
        }
        if (this.notificationsFilter.enabled !== this.notificationsFilter.not_enabled) {
            notificationsEnabled = String(this.notificationsFilter.enabled === true);
        }
        let priorityFilter = [];
        for (var key in this.priorityFilter) {
            if (this.priorityFilter[key] === true) {
                priorityFilter.push(key);
            }
        }
        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }

        this.filter['Hoststatus.problem_has_been_acknowledged'] = hasBeenAcknowledged;
        this.filter['Hoststatus.scheduled_downtime_depth'] = inDowntime;
        this.filter['Hoststatus.notifications_enabled'] = notificationsEnabled;
        this.filter['hostpriority'] = priorityFilter;
        this.filter['Hoststatus.is_hardstate'] = state_type;
        this.filter['Hoststatus.current_state'] = getHostCurrentStateForApi(this.currentStateFilter);

        this.subscriptions.add(this.HostsService.getIndex(this.params, this.filter)
            .subscribe((result) => {
                this.hosts = result;
                this.userFullname = result.username;
                this.cdr.markForCheck();
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public problemsOnly() {
        this.resetFilter();

        this.currentStateFilter = {
            up: false,
            down: true,
            unreachable: true
        };
        this.acknowledgementsFilter = {
            acknowledged: false,
            not_acknowledged: true
        };
        this.downtimeFilter = {
            in_downtime: false,
            not_in_downtime: true
        };
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.loadHosts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadHosts();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadHosts();
    }

    public resetFilter() {
        this.params = getDefaultHostsIndexParams();
        this.filter = getDefaultHostsIndexFilter();

        // Keep the selected container
        this.params.BrowserContainerId = this.containerId;

        this.currentStateFilter = {
            up: false,
            down: false,
            unreachable: false
        };
        this.state_typesFilter = {
            soft: false,
            hard: false
        };
        this.acknowledgementsFilter = {
            acknowledged: false,
            not_acknowledged: false
        };
        this.downtimeFilter = {
            in_downtime: false,
            not_in_downtime: false
        };
        this.notificationsFilter = {
            enabled: false,
            not_enabled: false
        };
        this.priorityFilter = {
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false
        };
        this.loadHosts();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(host?: HostObject) {
        let items: DeleteAllItem[] = [];

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.hostname)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.hostname
                };
            });
        }


        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        // Pass selection to the modal
        this.selectedItems = items;
        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadHosts();
        }
    }

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Host.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hosts', 'copy', ids]);
        } else {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }

    public linkForEditDetails() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Host.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'hosts', 'edit_details', ids]);
        }
    }

    public linkFor(format: 'pdf' | 'csv') {
        let baseUrl = '/hosts/listToPdf.pdf?';
        if (format === 'csv') {
            baseUrl = '/hosts/listToCsv?';
        }

        let hasBeenAcknowledged = '';
        let inDowntime = '';
        let notificationsEnabled = '';
        if (this.acknowledgementsFilter.acknowledged !== this.acknowledgementsFilter.not_acknowledged) {
            hasBeenAcknowledged = String(this.acknowledgementsFilter.acknowledged === true);
        }
        if (this.downtimeFilter.in_downtime !== this.downtimeFilter.not_in_downtime) {
            inDowntime = String(this.downtimeFilter.in_downtime === true);
        }
        if (this.notificationsFilter.enabled !== this.notificationsFilter.not_enabled) {
            notificationsEnabled = String(this.notificationsFilter.enabled === true);
        }
        let priorityFilter = [];
        for (var key in this.priorityFilter) {
            if (this.priorityFilter[key] === true) {
                priorityFilter.push(key);
            }
        }
        let state_type: string = '';
        if (this.state_typesFilter.soft !== this.state_typesFilter.hard) {
            state_type = '0';
            if (this.state_typesFilter.hard) {
                state_type = '1';
            }
        }

        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'filter[Hosts.name]': this.filter['Hosts.name'],
            'filter[Hosts.description]': this.filter.hostdescription,
            'filter[Hoststatus.output]': this.filter['Hoststatus.output'],
            'filter[Hoststatus.current_state][]': getHostCurrentStateForApi(this.currentStateFilter),
            'filter[Hosts.keywords][]': this.filter['Hosts.keywords'],
            'filter[Hosts.not_keywords][]': this.filter['Hosts.not_keywords'],
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Hoststatus.is_hardstate]': state_type,
            'filter[Hosts.address]': this.filter['Hosts.address'],
            'filter[Hosts.satellite_id][]': this.filter['Hosts.satellite_id'],
            'filter[Hosts.host_type][]': this.filter['Hosts.host_type'],
            'filter[hostpriority][]': priorityFilter,
            'BrowserContainerId': this.containerId
        };

        let stringParams: HttpParams = new HttpParams();
        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();
    }

    public toggleDisableModal(host?: HostObject) {
        let items: DisableItem[] = [];

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.name)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DisableItem => {
                return {
                    id: item.Host.id,
                    displayName: item.Host.name
                };
            });
        }
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;

        this.modalService.toggle({
            show: true,
            id: 'disableModal',
        });
    }

    public resetChecktime() {
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            this.selectedItems.push({
                command: ExternalCommandsEnum.rescheduleHost,
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
                satelliteId: 0
            });
        });

        if (this.selectedItems.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'serviceResetChecktimeModal'
        });
    }

    public disableNotifications() {
        let items: HostDisableNotificationsItem[] = [];
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            items.push({
                command: ExternalCommandsEnum.submitDisableHostNotifications,
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
            });
        });
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }

        this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'hostDisableNotificationsModal',
        });
    }

    public enableNotifications() {
        let items: HostEnableNotificationsItem[] = [];
        this.selectedItems = [];
        let selectedHostIds: number[] = this.SelectionServiceService.getSelectedItems().map((item) => item.Host.id);

        this.hosts?.all_hosts.forEach((item) => {
            if (typeof (item.Host.id) === "undefined" || typeof (item.Host.uuid) === "undefined") {
                return;
            }
            if (!selectedHostIds.includes(item.Host.id)) {
                return;
            }

            items.push({
                command: ExternalCommandsEnum.submitEnableHostNotifications,
                hostUuid: item.Host.uuid,
                type: 'hostOnly',
            });
        });

        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;
        this.modalService.toggle({
            show: true,
            id: 'hostEnableNotificationsModal',
        });
    }


    public toggleDowntimeModal() {
        let items: HostDowntimeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): HostDowntimeItem => {
            return {
                command: ExternalCommandsEnum.submitHostDowntime,
                hostUuid: item.Host.uuid,
                start: 0,
                end: 0,
                author: this.userFullname,
                comment: '',
                downtimetype: ''
            };
        });
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.selectedItems = items;

        this.modalService.toggle({
            show: true,
            id: 'hostMaintenanceModal',
        });
    }

    public acknowledgeStatus() {
        let items: HostAcknowledgeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): HostAcknowledgeItem => {
            return {
                command: ExternalCommandsEnum.submitHoststateAck,
                hostUuid: item.Host.uuid,
                hostAckType: item.type,
                author: this.userFullname,
                comment: '',
                notify: true,
                sticky: 0
            };
        });
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'hostAcknowledgeModal',
        });
    }

    protected confirmAddHostsToHostgroup(host?: HostObject): void {
        let items: SelectKeyValue[] = [];

        if (host) {
            items = [{
                key: Number(host.id),
                value: String(host.hostname)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): SelectKeyValue => {
                return {
                    key: item.Host.id,
                    value: item.Host.name
                };
            });
        }
        this.selectedItems = items;
        if (items.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.modalService.toggle({
            show: true,
            id: 'hostAddToHostgroupModal',
        });
    }

    public getFilteredContainers(): BrowsersContainer[] {
        if (!this.containers) {
            return [];
        }

        if (!this.containerFilter) {
            return this.containers.containers;
        }
        return this.containers.containers.filter((container: any) =>
            container.value.name.toLowerCase().includes(this.containerFilter.toLowerCase())
        );
    }

    public togglecolumnConfiguration() {
        this.showColumnConfig = !this.showColumnConfig;
    }

    public toggleColumnsConfigExport() {
        const exportConfigObject = {
            key: this.columnsTableKey,
            value: this.fields
        };
        this.configString = JSON.stringify(exportConfigObject);
        this.modalService.toggle({
            show: true,
            id: 'columnsConfigExportModal',
        });
    }

    public loadColumns() {
        if (this.LocalStorageService.hasItem(this.columnsTableKey, 'true')) {
            this.fields = JSON.parse(String(this.LocalStorageService.getItem(this.columnsTableKey)));
        }
    }

    public toggleColumnsConfigImport() {
        this.modalService.toggle({
            show: true,
            id: 'columnsConfigImportModal',
        });
    }

    public getDefaultColumns() {
        this.fields = [true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, false, false];
        this.LocalStorageService.removeItem(this.columnsTableKey)
        this.cdr.markForCheck();
    };

    public saveColumnsConfig() {
        this.LocalStorageService.removeItem(this.columnsTableKey);
        this.LocalStorageService.setItem(this.columnsTableKey, JSON.stringify(this.fields));
        this.cdr.markForCheck();
    }

    public setColumnConfig(fieldsConfig: boolean[]) {
        this.fields = fieldsConfig;
        this.cdr.markForCheck();
    }

    protected readonly String = String;
    protected readonly HostBrowserTabs = HostBrowserTabs;

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
