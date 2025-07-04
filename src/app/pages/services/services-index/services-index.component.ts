/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PermissionsService } from '../../../permissions/permissions.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { Subscription } from 'rxjs';
import { ServicesService } from '../services.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    getDefaultServiceIndexParams,
    getDefaultServicesIndexFilter,
    getDefaultServicesIndexFilterApiRequest,
    getServiceCurrentStateForApi,
    ServiceIndexFilter,
    ServiceObject,
    ServiceParams,
    ServicesIndexFilterApiRequest,
    ServicesIndexRoot,
} from "../services.interface";
import {
    ServicestatusIconComponent
} from '../../../components/services/servicestatus-icon/servicestatus-icon.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceAcknowledgeModalComponent
} from '../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import { HoststatusIconComponent } from '../../hosts/hoststatus-icon/hoststatus-icon.component';

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
    InputGroupComponent,
    InputGroupTextDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { DowntimeIconComponent } from '../../downtimes/downtime-icon/downtime-icon.component';
import {
    AcknowledgementIconComponent
} from '../../acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { PopoverGraphComponent } from '../../../components/popover-graph/popover-graph.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { DisableModalComponent } from '../../../layouts/coreui/disable-modal/disable-modal.component';
import { DISABLE_SERVICE_TOKEN } from '../../../tokens/disable-injection.token';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    ColumnsConfigExportModalComponent
} from '../../../layouts/coreui/columns-config-export-modal/columns-config-export-modal.component';
import {
    ColumnsConfigImportModalComponent
} from '../../../layouts/coreui/columns-config-import-modal/columns-config-import-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';
import {
    ExternalCommandsService,
    ServiceAcknowledgeItem,
    ServiceDowntimeItem,
    ServiceNotifcationItem,
    ServiceResetItem
} from '../../../services/external-commands.service';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { TimezoneConfiguration as TimezoneObject, TimezoneService } from '../../../services/timezone.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { FilterBookmarkComponent } from '../../../components/filter-bookmark/filter-bookmark.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RegexHelperTooltipComponent
} from '../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ExternalCommandsEnum } from '../../../enums/external-commands.enum';
import { AcknowledgementTypes } from '../../acknowledgements/acknowledgement-types.enum';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    ServiceAddToServicegroupModalComponent
} from '../../../components/services/service-add-to-servicegroup-modal/service-add-to-servicegroup-modal.component';
import { IndexPage } from '../../../pages.interface';

@Component({
    selector: 'oitc-services-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        DebounceDirective,
        DisableModalComponent,
        RouterLink,
        RouterModule,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardTitleDirective,
        MatSort,
        MatSortHeader,
        TableDirective,
        NgIf,
        ItemSelectComponent,
        RowComponent,
        NoRecordsComponent,
        ColComponent,
        ContainerComponent,
        PaginateOrScrollComponent,
        NgClass,
        TooltipDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        ServicestatusIconComponent,
        HoststatusIconComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        SelectAllComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        PopoverGraphComponent,
        DeleteAllModalComponent,
        ServiceMaintenanceModalComponent,
        ServiceAcknowledgeModalComponent,
        TranslocoPipe,
        DowntimeIconComponent,
        AcknowledgementIconComponent,
        CopyToClipboardComponent,
        CardFooterComponent,
        FilterBookmarkComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectComponent,
        NgSelectModule,
        ReactiveFormsModule,
        RegexHelperTooltipComponent,
        FormsModule,
        ColumnsConfigExportModalComponent,
        ColumnsConfigImportModalComponent,
        DropdownDividerDirective,
        TableLoaderComponent,
        ServiceAddToServicegroupModalComponent,
        AsyncPipe
    ],
    templateUrl: './services-index.component.html',
    styleUrl: './services-index.component.css',
    providers: [
        {provide: DISABLE_SERVICE_TOKEN, useClass: ServicesService},
        {provide: DELETE_SERVICE_TOKEN, useClass: ServicesService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesIndexComponent implements OnInit, OnDestroy, IndexPage {
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private ServicesService: ServicesService = inject(ServicesService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly modalService = inject(ModalService);
    private readonly TimezoneService = inject(TimezoneService);
    private readonly ExternalCommandsService = inject(ExternalCommandsService);
    private readonly LocalStorageService = inject(LocalStorageService);
    public fields: boolean[] = [true, true, true, true, true, true, true, true, false, false, true, true, true, true]; //defailt
    public fieldNames: string[] = [
        'Servicestatus',
        'is acknowledged',
        'is in downtime',
        'Notifications enabled',
        'Charts',
        'Passively transferred service',
        'Priority',
        'Service name',
        'Service type',
        'Service description',
        'Last state change',
        'Last check',
        'Next check',
        'Service output'
    ];
    public columnsTableKey: string = 'ServicesIndexColumns';
    public configString: string = ''
    //Filter
    public satellites: ServicesIndexRoot['satellites'] = [];
    public serviceTypes: any[] = [];
    public filter: ServiceIndexFilter = getDefaultServicesIndexFilter();
    private RequestFilter: ServicesIndexFilterApiRequest = getDefaultServicesIndexFilterApiRequest();

    //end filter
    public params: ServiceParams = {
        angular: true,
        scroll: true,
        sort: 'Servicestatus.current_state',
        page: 1,
        direction: 'desc'
    };

    public hideFilter: boolean = true;
    public showColumnConfig: boolean = false;
    public services?: ServicesIndexRoot;
    public timezone!: TimezoneObject;
    public selectedItems: any[] = [];
    public userFullname: string = '';

    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.loadColumns();
        this.serviceTypes = this.ServicesService.getServiceTypes();
        this.getUserTimezone();

        this.route.queryParams.subscribe(params => {
            let serviceId = params['service_id'] || params['id']
            if (serviceId) {
                this.filter.Services.id = [].concat(serviceId); // make sure we always get an array
            }

            let hostId = params['host_id']
            if (hostId) {
                this.filter.Hosts.id = [].concat(hostId); // make sure we always get an array
            }

            let containerId = params['BrowserContainerId'] || undefined
            if (containerId) {
                this.params.BrowserContainerId = parseInt(containerId, 10);
            }

            let hostname = params['hostname'] || undefined;
            if (hostname) {
                this.filter.Hosts.name = hostname;
            }

            let name_regex = params['name_regex'];
            if (name_regex === 'true') {
                this.filter.Hosts.name_regex = true;
            }

            let servicename = params['servicename'] || undefined;
            if (servicename) {
                this.filter.Services.name = servicename;
            }

            let servicename_regex = params['servicename_regex'];
            if (servicename_regex === 'true') {
                this.filter.Services.name_regex = true;
            }

            let servicedescription = params['servicedescription'] || undefined;
            if (servicedescription) {
                this.filter.Services.servicedescription = servicedescription;
            }

            let acknowledged = params['acknowledged'];
            if (acknowledged === 'true') {
                this.filter.Servicestatus.acknowledged = true;
            }
            let not_acknowledged = params['not_acknowledged'];
            if (not_acknowledged === 'true') {
                this.filter.Servicestatus.not_acknowledged = true;
            }
            let in_downtime = params['in_downtime'];
            if (in_downtime === 'true') {
                this.filter.Servicestatus.in_downtime = true;
            }
            let not_in_downtime = params['not_in_downtime'];
            if (not_in_downtime === 'true') {
                this.filter.Servicestatus.not_in_downtime = true;
            }
            let passive = params['passive'];
            if (passive === 'true') {
                this.filter.Servicestatus.passive = true;
            }
            let unhandled = params['unhandled'];
            if (unhandled === 'true') {
                this.filter.Servicestatus.not_acknowledged = true;
                this.filter.Servicestatus.not_in_downtime = true;
            }

            let keywords = params['keywords'] || undefined;
            if (keywords) {
                this.filter.Services.keywords = [keywords];
            }

            let not_keywords = params['not_keywords'] || undefined;
            if (not_keywords) {
                this.filter.Services.not_keywords = [not_keywords];
            }

            let direction = params['direction'];
            if (direction && direction === 'asc' || direction === 'desc') {
                this.params.direction = direction;
            }

            let sort = params['sort'];
            if (sort) {
                this.params.sort = sort;
            }

            let servicestate = params['servicestate'] || undefined;
            if (servicestate) {
                //first reset all states
                this.filter.Servicestatus.current_state.ok = false;
                this.filter.Servicestatus.current_state.warning = false;
                this.filter.Servicestatus.current_state.critical = false;
                this.filter.Servicestatus.current_state.unknown = false;

                servicestate = [].concat(servicestate); // make sure we always get an array
                servicestate.forEach((state: any) => {
                    switch (parseInt(state, 10)) {
                        case 0:
                            this.filter.Servicestatus.current_state.ok = true;
                            break;
                        case 1:
                            this.filter.Servicestatus.current_state.warning = true;
                            break;
                        case 2:
                            this.filter.Servicestatus.current_state.critical = true;
                            break;
                        case 3:
                            this.filter.Servicestatus.current_state.unknown = true;
                            break;
                        default:
                            break;
                    }
                });
            }
            this.setFilterAndLoad(this.filter);
            this.cdr.markForCheck();
        });

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.ServicesService.getServicesIndexViaPost(this.params, this.RequestFilter)
            .subscribe((services) => {
                this.cdr.markForCheck();
                this.services = services;
                if (services.satellites) {
                    this.satellites = services.satellites;
                }
                this.userFullname = services.username;
            })
        );
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public refresh() {
        this.load();
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
        if (this.hideFilter) {
            this.showColumnConfig = false;
        }
    }

    public problemsOnly() {
        //this.resetFilter();
        this.params = getDefaultServiceIndexParams();
        this.filter = getDefaultServicesIndexFilter();

        this.filter.Servicestatus.current_state = {
            ok: false,
            warning: true,
            critical: true,
            unknown: true
        };

        this.filter.Servicestatus.acknowledged = false;
        this.filter.Servicestatus.not_acknowledged = true;

        this.filter.Servicestatus.in_downtime = false;
        this.filter.Servicestatus.not_in_downtime = true;

        this.setFilterAndLoad(this.filter);

    }


    public togglecolumnConfiguration() {
        this.showColumnConfig = !this.showColumnConfig;
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
    }

    public toggleColumnsConfigImport() {
        this.modalService.toggle({
            show: true,
            id: 'columnsConfigImportModal',
        });
        this.cdr.markForCheck();
    }

    public linkFor(type: string) {
        let baseUrl: string = '/services/listToPdf.pdf?';
        if (type === 'csv') {
            baseUrl = '/services/listToCsv?';
        }

        let hasBeenAcknowledged = '';
        let inDowntime = '';
        let notificationsEnabled = '';
        let activeChecksEnabled = '';

        if (this.filter.Servicestatus.acknowledged !== this.filter.Servicestatus.not_acknowledged) {
            hasBeenAcknowledged = String(this.filter.Servicestatus.acknowledged === true);
        }
        if (this.filter.Servicestatus.in_downtime !== this.filter.Servicestatus.not_in_downtime) {
            inDowntime = String(this.filter.Servicestatus.in_downtime === true);
        }
        if (this.filter.Servicestatus.notifications_enabled !== this.filter.Servicestatus.notifications_not_enabled) {
            notificationsEnabled = String(this.filter.Servicestatus.notifications_enabled === true);
        }
        if (this.filter.Servicestatus.active !== this.filter.Servicestatus.passive) {
            activeChecksEnabled = String(this.filter.Servicestatus.active === true);
        }

        let priorityFilter = [];
        /* for (var key in this.filter.Services.priority) {
             // @ts-ignore
             if (this.filter.Services.priority[key] === true) {
                 priorityFilter.push(key);
             }
         } */
        for (const key in this.filter.Services.priority) {
            if (this.filter.Services.priority.hasOwnProperty(key)) {
                // @ts-ignore
                if (this.filter.Services.priority[key] === true) {
                    priorityFilter.push(key);
                }
            }
        }

        let urlParams = {
            'angular': true,
            'sort': this.params.sort,
            'page': this.params.page,
            'direction': this.params.direction,
            'filter[Hosts.id][]': this.filter.Hosts.id,
            'filter[Hosts.name]': this.filter.Hosts.name,
            'filter[Hosts.name_regex]': this.filter.Hosts.name_regex,
            'filter[Hosts.satellite_id][]': this.filter.Hosts.satellite_id,
            'filter[Services.id][]': this.filter.Services.id,
            'filter[Services.service_type][]': this.filter.Services.service_type,
            'filter[servicename]': this.filter.Services.name,
            'filter[servicename_regex]': this.filter.Services.name_regex,
            'filter[servicedescription]': this.filter.Services.servicedescription,
            'filter[Servicestatus.output]': this.filter.Servicestatus.output,
            'filter[Servicestatus.current_state][]': getServiceCurrentStateForApi(this.filter.Servicestatus.current_state),
            'filter[keywords][]': this.filter.Services.keywords,
            'filter[not_keywords][]': this.filter.Services.not_keywords,
            'filter[Servicestatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Servicestatus.scheduled_downtime_depth]': inDowntime,
            'filter[Servicestatus.active_checks_enabled]': activeChecksEnabled,
            'filter[Servicestatus.notifications_enabled]': notificationsEnabled,
            'filter[servicepriority][]': priorityFilter,
        };


        let stringParams: HttpParams = new HttpParams();

        stringParams = stringParams.appendAll(urlParams);
        return baseUrl + stringParams.toString();

    }

    public resetChecktime() {
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceResetItem => {
            return {
                command: ExternalCommandsEnum.rescheduleService,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                satelliteId: item.Host.satelliteId
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Reschedule');
                const url = ['services', 'index'];
                this.notyService.genericSuccess(result.message, title, url);
            } else {
                this.notyService.genericError();
            }
        }));
    }

    public disableNotifications() {
        // let commands = [];
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitDisableServiceNotifications,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('Disable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                // this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }
            setTimeout(() => {
                this.load()
            }, 5000);
        }));
    }

    public enableNotifications() {
        const commands = this.SelectionServiceService.getSelectedItems().map((item): ServiceNotifcationItem => {
            return {
                command: ExternalCommandsEnum.submitEnableServiceNotifications,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid
            };

        });
        if (commands.length === 0) {
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(commands).subscribe((result) => {
            if (result.message) {
                const title = this.TranslocoService.translate('enable Notifications');

                this.notyService.genericSuccess(result.message, title, []);
                //this.notyService.scrollContentDivToTop();
                // this.SelectionServiceService.deselectAll()
            } else {
                this.notyService.genericError();
            }

            setTimeout(() => {
                this.load()
            }, 5000);
        }));
    }

    public toggleDowntimeModal() {
        let items: ServiceDowntimeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): ServiceDowntimeItem => {
            return {
                command: ExternalCommandsEnum.submitServiceDowntime,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                start: 0,
                end: 0,
                author: this.userFullname,
                comment: '',
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
            id: 'serviceMaintenanceModal',
        });
    }

    public toggleDisableModal(service?: ServiceObject) {
        let items: DisableItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: service.id,
                displayName: service.hostname + '/' + service.servicename
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): DisableItem => {
                return {
                    id: item.Service.id,
                    displayName: item.Service.hostname + '/' + item.Service.servicename
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

    public acknowledgeStatus() {
        let items: ServiceAcknowledgeItem[] = [];
        items = this.SelectionServiceService.getSelectedItems().map((item): ServiceAcknowledgeItem => {
            return {
                command: ExternalCommandsEnum.submitServicestateAck,
                hostUuid: item.Host.uuid,
                serviceUuid: item.Service.uuid,
                sticky: 0,
                notify: false,
                author: this.userFullname,
                comment: '',
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
            id: 'serviceAcknowledgeModal',
        });
    }

    public toggleDeleteAllModal(service?: ServiceObject) {
        let items: DeleteAllItem[] = [];

        if (service) {
            // User just want to delete a single command
            items = [{
                id: Number(service.id),
                displayName: String(service.hostname) + '/' + String(service.servicename)
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {

                return {
                    id: item.Service.id,
                    displayName: item.Service.hostname + '/' + item.Service.servicename
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

    public navigateCopy() {
        let ids = this.SelectionServiceService.getSelectedItems().map(item => item.Service.id).join(',');
        if (ids) {
            this.router.navigate(['/', 'services', 'copy', ids]);
        } else{
            const message = this.TranslocoService.translate('No items selected!');
            this.notyService.genericError(message);
            return;
        }
    }

    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    public onSelectedBookmark(filterstring: string) {
        if (filterstring === '') {
            this.resetFilter();
        }
        if (filterstring && filterstring.length > 0) {
            //cnditions to apply old bookmarks
            const bookmarkfilter = JSON.parse(filterstring);
            this.params = getDefaultServiceIndexParams();
            this.filter = bookmarkfilter;
            this.setFilterAndLoad(this.filter);
        }
        this.cdr.markForCheck();
    }

    private setFilterAndLoad(filter: ServiceIndexFilter) {
        this.params.page = 1;

        let priorityFilter: string[] = [];
        for (const key in filter.Services.priority) {
            if (filter.Services.priority.hasOwnProperty(key)) {
                // console.log(key); // Logs the key
                // @ts-ignore
                if (filter.Services.priority[key] === true) {
                    priorityFilter.push(key);
                }
            }
        }

        this.RequestFilter['Hosts.id'] = filter.Hosts.id;
        this.RequestFilter['Hosts.name'] = filter.Hosts.name;
        this.RequestFilter['Hosts.name_regex'] = !!(filter.Hosts.name_regex);
        this.RequestFilter['Hosts.satellite_id'] = filter.Hosts.satellite_id;

        this.RequestFilter['Services.id'] = filter.Services.id;
        this.RequestFilter['servicename'] = filter.Services.name;
        this.RequestFilter['servicename_regex'] = (!!filter.Services.name_regex);
        this.RequestFilter['keywords'] = filter.Services.keywords;
        this.RequestFilter['not_keywords'] = filter.Services.not_keywords;
        this.RequestFilter['servicedescription'] = filter.Services.servicedescription;
        this.RequestFilter['servicepriority'] = priorityFilter
        this.RequestFilter['Services.service_type'] = filter.Services.service_type;

        this.RequestFilter['Servicestatus.current_state'] = getServiceCurrentStateForApi(filter.Servicestatus.current_state);
        this.RequestFilter['Servicestatus.output'] = filter.Servicestatus.output;
        this.RequestFilter['Servicestatus.problem_has_been_acknowledged'] = '';
        this.RequestFilter['Servicestatus.scheduled_downtime_depth'] = '';
        this.RequestFilter['Servicestatus.notifications_enabled'] = '';
        this.RequestFilter['Servicestatus.active_checks_enabled'] = '';

        if (filter.Servicestatus.acknowledged !== filter.Servicestatus.not_acknowledged) {
            this.RequestFilter['Servicestatus.problem_has_been_acknowledged'] = String(filter.Servicestatus.acknowledged);
        }

        if (filter.Servicestatus.in_downtime !== filter.Servicestatus.not_in_downtime) {
            this.RequestFilter['Servicestatus.scheduled_downtime_depth'] = String(filter.Servicestatus.in_downtime);
        }

        if (filter.Servicestatus.notifications_enabled !== filter.Servicestatus.notifications_not_enabled) {
            this.RequestFilter['Servicestatus.notifications_enabled'] = String(filter.Servicestatus.notifications_enabled);
        }

        if (filter.Servicestatus.passive !== filter.Servicestatus.active) {
            this.RequestFilter['Servicestatus.active_checks_enabled'] = String(filter.Servicestatus.active);
        }

        this.filter = filter;
        this.load();

    }

    private getUserTimezone() {
        this.subscriptions.add(this.TimezoneService.getTimezoneConfiguration().subscribe(data => {
            this.timezone = data;
            this.cdr.markForCheck();
        }));
    }

    public loadColumns() {
        if (this.LocalStorageService.hasItem(this.columnsTableKey, 'true')) {
            this.fields = JSON.parse(String(this.LocalStorageService.getItem(this.columnsTableKey)));
            this.cdr.markForCheck();
        }
    }

    public getDefaultColumns() {
        this.fields = [true, true, true, true, true, true, true, true, false, false, true, true, true, true];
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

    //filter
    public resetFilter() {
        this.params = getDefaultServiceIndexParams();
        this.filter = getDefaultServicesIndexFilter();
        this.setFilterAndLoad(this.filter);
    }

    public onFilterChange(event: Event | null) {
        this.setFilterAndLoad(this.filter);
    }


    protected confirmAddServicesToServicegroup(service?: ServiceObject): void {
        this.cdr.markForCheck();

        let items: SelectKeyValue[] = [];

        if (service) {
            items = [{
                key: Number(service.id),
                value: String(service.hostname + "/" + service.servicename)
            }];
        } else {
            items = this.SelectionServiceService.getSelectedItems().map((item): SelectKeyValue => {
                return {
                    key: item.Service.id,
                    value: item.Service.hostname + "/" + item.Service.servicename
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
            id: 'serviceAddToServicegroupModal',
        });
    }


    protected readonly AcknowledgementTypes = AcknowledgementTypes;
}
