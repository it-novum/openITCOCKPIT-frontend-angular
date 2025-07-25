import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IndexPage } from '../../../pages.interface';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import {
    getDefaultOrganizationalChartsIndexParams,
    OrganizationalChart,
    OrganizationalChartsIndexParams,
    OrganizationalChartsIndexRoot
} from '../organizationalcharts.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import { PermissionsService } from '../../../permissions/permissions.service';


@Component({
    selector: 'oitc-organizational-charts-index',
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        PermissionDirective,
        ContainerComponent,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        DebounceDirective,
        FormsModule,
        TranslocoPipe,
        InputGroupTextDirective,
        FormControlDirective,
        TableLoaderComponent,
        NgIf,
        TableDirective,
        MatSort,
        MatSortHeader,
        ItemSelectComponent,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        NoRecordsComponent,
        SelectAllComponent,
        PaginateOrScrollComponent,
        CardFooterComponent,
        DeleteAllModalComponent,
        NgForOf,
        TooltipDirective,
        AsyncPipe
    ],
    templateUrl: './organizational-charts-index.component.html',
    styleUrl: './organizational-charts-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: OrganizationalChartsService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsIndexComponent implements OnInit, OnDestroy, IndexPage {
    public params: OrganizationalChartsIndexParams = getDefaultOrganizationalChartsIndexParams()
    public organizationalcharts?: OrganizationalChartsIndexRoot;
    public hideFilter: boolean = true;
    public selectedItems: DeleteAllItem[] = [];

    private subscriptions: Subscription = new Subscription();
    private readonly OrganizationalChartsService = inject(OrganizationalChartsService);
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            this.loadOrganizationalCharts();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadOrganizationalCharts(): void {
        this.SelectionServiceService.deselectAll();

        this.subscriptions.add(
            this.OrganizationalChartsService.getIndex(this.params).subscribe((organizationalcharts) => {
                this.organizationalcharts = organizationalcharts;
                this.cdr.markForCheck();
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
        this.loadOrganizationalCharts();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.loadOrganizationalCharts();
        }
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadOrganizationalCharts();
    }


    // Generic callback whenever a mass action (like delete all) has been finished
    public onMassActionComplete(success: boolean) {
        if (success) {
            this.loadOrganizationalCharts();
        }
    }

    public resetFilter() {
        this.params = getDefaultOrganizationalChartsIndexParams();
        this.loadOrganizationalCharts();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(organizationalchart?: OrganizationalChart) {
        let items: DeleteAllItem[] = [];

        if (organizationalchart) {
            // User just want to delete a single organizational chart
            items = [{
                id: Number(organizationalchart.id),
                displayName: String(organizationalchart.name)
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

    protected readonly Boolean = Boolean;
    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
