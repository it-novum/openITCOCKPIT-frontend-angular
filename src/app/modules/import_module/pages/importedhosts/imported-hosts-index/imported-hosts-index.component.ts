import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    BadgeComponent,
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
    TableDirective
} from '@coreui/angular';
import {
    getDefaultImportedHostsIndexParams,
    Importedhost,
    ImportedHostIndex,
    ImportedhostsIndexParams,
    ImportedhostsIndexRoot,
    MaxUploadLimit
} from '../importedhosts.interface';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { ImportedhostsService } from '../importedhosts.service';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { ExternalSystemEntity } from '../../externalsystems/external-systems.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ExternalSystemsService } from '../../externalsystems/external-systems.service';
import { Importer } from '../../importers/importers.interface';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ItemSelectComponent } from '../../../../../layouts/coreui/select-all/item-select/item-select.component';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { SelectAllComponent } from '../../../../../layouts/coreui/select-all/select-all.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ImportedHostFlagsEnum } from '../imported-hosts.enum';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { ImportersService } from '../../importers/importers.service';
import { ImportDataComponent } from '../../../components/import-data/import-data.component';
import { ImportCsvDataComponent } from '../../../components/import-csv-data/import-csv-data.component';

@Component({
    selector: 'oitc-imported-hosts-index',
    imports: [
        FormsModule,
        PaginatorModule,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        DeleteAllModalComponent,
        DropdownComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        PermissionDirective,
        RowComponent,
        SelectAllComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        TrueFalseDirective,
        XsButtonDirective,
        RouterLink,
        NgClass,
        MultiSelectComponent,
        ImportDataComponent,
        ImportCsvDataComponent,
        KeyValuePipe
    ],
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ImportedhostsService} // Inject the ImportedhostsService into the DeleteAllModalComponent
    ],
    templateUrl: './imported-hosts-index.component.html',
    styleUrl: './imported-hosts-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportedHostsIndexComponent implements OnInit, OnDestroy {
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    public params: ImportedhostsIndexParams = getDefaultImportedHostsIndexParams()

    public importedhosts: Importedhost[] = [];
    public importers: Importer[] = [];
    public isLoadingImporters: boolean = true;
    public maxUploadLimit?: MaxUploadLimit;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    private readonly ImportedhostsService = inject(ImportedhostsService);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public allImportedHosts?: ImportedhostsIndexRoot;
    private readonly notyService = inject(NotyService);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);
    private readonly ImportersService = inject(ImportersService);
    private cdr = inject(ChangeDetectorRef);
    protected readonly ImportedHostFlagsEnum = ImportedHostFlagsEnum;

    public imported = 1;
    public disabled = 0;
    public not_imported = 1;

    public ready_for_import = 1;
    public not_ready_for_import = 1;

    public marked_for_disabled = 0;
    public marked_hosts_with_changes = 0;
    public marked_for_re_enable = 0;

    constructor() {
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
            this.loadImporters();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.SelectionServiceService.deselectAll();
        let imported: string | boolean = '';
        let ready_for_import: string | boolean = '';
        let disabled: string | boolean = '';
        let flags: number | string = '';

        // ALL "Already synchronized" filter are selected or deselected
        if (this.imported === this.not_imported && this.not_imported === this.disabled) {
            // "In monitoring (active)" and "NEW" checkboxes are selected
            // Do not filter by imported status
            imported = '';
            disabled = '';
        } else if (!(this.disabled | this.not_imported) && this.imported) {
            // Only "In monitoring (active)" checkbox is selected
            imported = true;
            disabled = false;
        } else if ((this.imported !== this.not_imported) && !this.disabled) {
            // "In monitoring (active)" or "NEW" checkbox is selected
            // Do not filter by disabled status
            imported = this.imported === 1;
            disabled = '';
        } else if ((this.imported & this.disabled) && !this.not_imported) {
            // "In monitoring (active)" and " In monitoring (disabled) " checkbox is selected - "NEW" checkbox is not selected
            imported = true;
            disabled = '';
        } else if (!(this.imported | this.not_imported) && this.imported) {
            // Only "In monitoring (active) " checkbox is selected
            imported = true;
            disabled = true;

        } else if (!(this.imported ^ this.not_imported) && this.disabled) {
            // Only "In monitoring (disabled) " checkbox is selected
            imported = true;
            disabled = true;
        } else if ((this.disabled & this.not_imported) && !this.imported) {
            // "In monitoring (disabled)" and "NEW" checkbox is selected - "In monitoring (active)" checkbox is not selected
            imported = '';
            disabled = true;
        } else if ((this.imported & this.not_imported) && !this.disabled) {
            // "In monitoring (active)" and "NEW" checkbox is selected - "In monitoring (disabled)" checkbox is not selected
            imported = '';
            disabled = false;
        }

        if (this.ready_for_import ^ this.not_ready_for_import) {
            ready_for_import = this.ready_for_import === 1;
        }

        if (this.marked_hosts_with_changes ^ this.marked_for_disabled
            ^ this.marked_for_re_enable) {
            flags = this.marked_hosts_with_changes ^ this.marked_for_disabled ^ this.marked_for_re_enable;
        }

        this.params['filter[imported]'] = imported;
        this.params['filter[ready_for_import]'] = ready_for_import;
        this.params['filter[disabled]'] = disabled;
        this.params['filter[ImportedHosts.flags]'] = flags;

        this.subscriptions.add(this.ImportedhostsService.getIndex(this.params)
            .subscribe((result) => {
                this.allImportedHosts = result;
                this.importedhosts = result.importedhosts;
                this.maxUploadLimit = result.maxUploadLimit;
                this.cdr.markForCheck();
            })
        );
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public resetFilter() {
        this.imported = 1;
        this.disabled = 0;
        this.not_imported = 1;

        this.ready_for_import = 1;
        this.not_ready_for_import = 1;

        this.marked_for_disabled = 0;
        this.marked_hosts_with_changes = 0;
        this.marked_for_re_enable = 0;
        this.params = getDefaultImportedHostsIndexParams();
        this.load();
    }

    public onPaginatorChange(importedhost: PaginatorChangeEvent): void {
        this.params.page = importedhost.page;
        this.params.scroll = importedhost.scroll;
        this.load();
    }

    public onFilterChange($event: any) {
        this.params.page = 1;
        this.load();
    }

    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(importedhost?: ImportedHostIndex) {
        let items: DeleteAllItem[] = [];

        if (importedhost) {
            // User just want to delete a single calendar
            items = [{
                id: importedhost.id,
                displayName: importedhost.name
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: item.name
                };
            });
        }

        // Pass selection to the modal
        this.selectedItems = items;
        this.cdr.markForCheck();

        // open modal
        this.modalService.toggle({
            show: true,
            id: 'deleteAllModal',
        });
    }

    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.load();
        }
    }

    public synchronizeWithMonitoring() {
        this.showSynchronizingSpinner = true;
        this.subscriptions.add(this.ImportedhostsService.synchronizeWithMonitoring()
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.notyService.genericSuccess(result.message);
                    this.showSynchronizingSpinner = false;
                    return;
                }
                // Error
                this.notyService.genericError(result.message);
                this.showSynchronizingSpinner = false;
            })
        );
    }

    public loadExternalSystem(externalSystem: ExternalSystemEntity) {
        this.ExternalSystemsService.openImportedHostGroupDataModal(externalSystem);
    }

    public onImportIsCompleted($event: boolean) {
        this.load();

    }

    public loadImporter(importer: Importer) {
        this.ImportersService.openImportedHostsDataModal(importer);
    }

    public hasFlag(importedHostFlag: number, compareFlag: ImportedHostFlagsEnum) {
        return importedHostFlag & compareFlag;
    }

    public loadImporters() {
        this.importers = [];
        this.isLoadingImporters = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.ImportedhostsService.getImporters()
            .subscribe((result) => {
                this.importers = result.importers;
                this.isLoadingImporters = false;
                this.cdr.markForCheck();
            })
        );
    }

    protected readonly Object = Object;
}
