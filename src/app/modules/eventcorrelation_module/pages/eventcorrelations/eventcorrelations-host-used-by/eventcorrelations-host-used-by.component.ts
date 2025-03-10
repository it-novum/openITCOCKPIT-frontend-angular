import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    ModalService,
    NavComponent,
    NavItemComponent,
    TableDirective,
    TooltipDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    NotUsedByObjectComponent
} from '../../../../../layouts/coreui/not-used-by-object/not-used-by-object.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { UsedByEvcObject } from '../eventcorrelations.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import { DeleteAllModalComponent } from '../../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { DELETE_SERVICE_TOKEN } from '../../../../../tokens/delete-injection.token';
import { SelectionServiceService } from '../../../../../layouts/coreui/select-all/selection-service.service';
import { HostEntity } from '../../../../../pages/hosts/hosts.interface';

@Component({
    selector: 'oitc-eventcorrelations-host-used-by',
    imports: [
        AsyncPipe,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ContainerComponent,
        FaIconComponent,
        FormLoaderComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NotUsedByObjectComponent,
        PermissionDirective,
        TableDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        TranslocoPipe,
        TooltipDirective,
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        DropdownDividerDirective,
        DropdownItemDirective,
        DeleteAllModalComponent
    ],
    templateUrl: './eventcorrelations-host-used-by.component.html',
    styleUrl: './eventcorrelations-host-used-by.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: EventcorrelationsService} // Inject the ServicesService into the DeleteAllModalComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsHostUsedByComponent implements OnInit, OnDestroy {
    public host?: HostEntity;
    public usedBy: UsedByEvcObject[] = [];
    public total: number = 0;

    public selectedItems: DeleteAllItem[] = [];


    public PermissionsService: PermissionsService = inject(PermissionsService);

    private readonly EventcorrelationsService: EventcorrelationsService = inject(EventcorrelationsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private readonly SelectionServiceService = inject(SelectionServiceService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly modalService = inject(ModalService);
    private id: number = 0;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.id = Number(params['id']);
            this.load();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        if (this.id > 0) {
            this.subscriptions.add(this.EventcorrelationsService.hostUsedBy(this.id)
                .subscribe((result) => {
                    this.host = result.host;
                    this.total = Object.values(result.eventcorrelations).length;
                    this.usedBy = Object.values(result.eventcorrelations); // As array for ngFor

                    this.cdr.markForCheck();
                }));
        }

    }

    // Open the Delete All Modal
    public toggleDeleteAllModal(evcHost: UsedByEvcObject) {
        let items: DeleteAllItem[] = [];

        if (evcHost.hasWritePermission) {
            // User just want to delete a single command
            items = [{
                id: Number(evcHost.Hosts.id),
                displayName: String(evcHost.Hosts.name)
            }];
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
            this.load();
        }
    }
}
