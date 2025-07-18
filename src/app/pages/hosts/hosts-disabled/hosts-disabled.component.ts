import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  ColComponent,
  ContainerComponent,
  DropdownDividerDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalService,
  NavComponent,
  NavItemComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { CopyToClipboardComponent } from '../../../layouts/coreui/copy-to-clipboard/copy-to-clipboard.component';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';




import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
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

import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';


import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HoststatusSimpleIconComponent } from '../hoststatus-simple-icon/hoststatus-simple-icon.component';
import { getDefaultHostsDisabledParams, HostObject, HostsDisabledParams, HostsDisabledRoot } from '../hosts.interface';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { HostsService } from '../hosts.service';
import { PermissionsService } from '../../../permissions/permissions.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ENABLE_SERVICE_TOKEN } from '../../../tokens/enable-injection.token';
import { DisableItem } from '../../../layouts/coreui/disable-modal/disable.interface';
import { EnableItem } from '../../../layouts/coreui/enable-modal/enable.interface';
import { EnableModalComponent } from '../../../layouts/coreui/enable-modal/enable-modal.component';

@Component({
    selector: 'oitc-hosts-disabled',
    imports: [
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
    DropdownDividerDirective,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormsModule,
    InputGroupComponent,
    InputGroupTextDirective,
    ItemSelectComponent,
    MatSort,
    MatSortHeader,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NgSelectModule,
    NoRecordsComponent,
    PaginateOrScrollComponent,
    PaginatorModule,
    PermissionDirective,
    QueryHandlerCheckerComponent,
    RegexHelperTooltipComponent,
    RowComponent,
    SelectAllComponent,
    TableDirective,
    TableLoaderComponent,
    TranslocoDirective,
    TranslocoPipe,
    XsButtonDirective,
    RouterLink,
    HoststatusSimpleIconComponent,
    EnableModalComponent,
    AsyncPipe
],
    templateUrl: './hosts-disabled.component.html',
    styleUrl: './hosts-disabled.component.css',
    providers: [
        { provide: DELETE_SERVICE_TOKEN, useClass: HostsService }, // Inject the ServicesService into the DeleteAllModalComponent
        { provide: ENABLE_SERVICE_TOKEN, useClass: HostsService },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsDisabledComponent implements OnInit, OnDestroy {
    // Filter vars
    public params: HostsDisabledParams = getDefaultHostsDisabledParams();
    // Filter end

    public hosts?: HostsDisabledRoot;
    public hideFilter: boolean = true;
    public satellites: SelectKeyValue[] = [];

    public selectedItems: any[] = [];

    private readonly HostsService = inject(HostsService);
    private subscriptions: Subscription = new Subscription();
    public readonly PermissionsService = inject(PermissionsService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)
    private readonly notyService: NotyService = inject(NotyService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit() {
        this.loadHosts();

        this.subscriptions.add(this.HostsService.getSatellites()
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.satellites = result;
            })
        );
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadHosts() {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(this.HostsService.getHostsDisabled(this.params)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.hosts = result;
            })
        );
    }

    // Show or hide the filter
    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
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
        this.params = getDefaultHostsDisabledParams();

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

    public toggleEnableModal(host?: HostObject) {
        let items: EnableItem[] = [];

        if (host) {
            // User just want to delete a single command
            items = [{
                id: Number(host.id),
                displayName: String(host.name),
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
            id: 'enableModal',
        });
    }

}
