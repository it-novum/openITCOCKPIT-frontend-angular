import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    DropdownDividerDirective,
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
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectionServiceService } from '../../../layouts/coreui/select-all/selection-service.service';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Subscription } from 'rxjs';
import {
    getDefaultServiceescalationsIndexParams,
    ServiceescalationIndex,
    ServiceescalationIndexRoot,
    ServiceescalationsIndexParams
} from '../serviceescalations.interface';
import { ServiceescalationsService } from '../serviceescalations.service';
import { PaginatorChangeEvent } from '../../../layouts/coreui/paginator/paginator.interface';
import { DebounceDirective } from '../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { ActionsButtonComponent } from '../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../components/actions-button-element/actions-button-element.component';
import { ItemSelectComponent } from '../../../layouts/coreui/select-all/item-select/item-select.component';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { SelectAllComponent } from '../../../layouts/coreui/select-all/select-all.component';
import { DeleteAllModalComponent } from '../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { TableLoaderComponent } from '../../../layouts/primeng/loading/table-loader/table-loader.component';

@Component({
    selector: 'oitc-serviceescalations-index',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MultiSelectComponent,
        RowComponent,
        TranslocoPipe,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        ItemSelectComponent,
        MatSort,
        MatSortHeader,
        NgForOf,
        NgIf,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        SelectAllComponent,
        TableDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        DeleteAllModalComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        TableLoaderComponent
    ],
    templateUrl: './serviceescalations-index.component.html',
    styleUrl: './serviceescalations-index.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: ServiceescalationsService} // Inject the ServiceescalationsService into the DeleteAllModalComponent
    ]
})
export class ServiceescalationsIndexComponent implements OnInit, OnDestroy {
    private readonly TranslocoService = inject(TranslocoService);
    public params: ServiceescalationsIndexParams = getDefaultServiceescalationsIndexParams();
    public serviceescalations?: ServiceescalationIndexRoot;
    public hideFilter: boolean = true;

    public serviceFocus: boolean = true;
    public serviceExcludeFocus: boolean = false;

    public servicegroupFocus: boolean = true;
    public servicegroupExcludeFocus: boolean = false;


    public selectedItems: DeleteAllItem[] = [];

    private readonly ServiceescalationsService = inject(ServiceescalationsService);
    private subscriptions: Subscription = new Subscription();
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private SelectionServiceService: SelectionServiceService = inject(SelectionServiceService);
    private readonly modalService = inject(ModalService);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);

            let id = params['id'];
            if (id) {
                this.params['filter[Serviceescalations.id][]'] = [id];
            }

            this.loadServiceescalations();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadServiceescalations() {
        this.SelectionServiceService.deselectAll();
        this.subscriptions.add(this.ServiceescalationsService.getIndex(this.params)
            .subscribe((result) => {
                this.serviceescalations = result;
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
        this.loadServiceescalations();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.loadServiceescalations();
    }

    public resetFilter() {
        this.params = getDefaultServiceescalationsIndexParams();
        this.loadServiceescalations();
    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(serviceescalation?: ServiceescalationIndex) {
        let items: DeleteAllItem[] = [];
        if (serviceescalation) {
            // User just want to delete a single command
            items = [{
                id: serviceescalation.id,
                displayName: this.TranslocoService.translate('Service escalation #{id}', {id: serviceescalation.id})
            }];
        } else {
            // User clicked on delete selected button
            items = this.SelectionServiceService.getSelectedItems().map((item): DeleteAllItem => {
                return {
                    id: item.id,
                    displayName: this.TranslocoService.translate('Service escalation #{id}', {id: item.id})
                };
            });
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
            this.loadServiceescalations();
        }
    }
}
