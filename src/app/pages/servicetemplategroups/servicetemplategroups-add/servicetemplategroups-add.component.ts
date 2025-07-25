import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';

import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import {
    LoadContainersRoot,
    LoadServiceTemplatesRoot,
    ServiceTemplateGroupsAddPostServicetemplategroup
} from '../servicetemplategroups.interface';
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicetemplategroups-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        MultiSelectComponent
    ],
    templateUrl: './servicetemplategroups-add.component.html',
    styleUrl: './servicetemplategroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly router: Router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected createAnother: boolean = false;
    protected servicetemplates: SelectKeyValue[] = [];
    protected post: ServiceTemplateGroupsAddPostServicetemplategroup = {} as ServiceTemplateGroupsAddPostServicetemplategroup;
    protected containers: SelectKeyValue[] = [];

    private preSelectedIds: number[] = [];

    constructor() {
        this.post = this.getDefaultPost();
    }

    public ngOnInit() {
        this.loadContainers();

        // preSelectedIds is used for "Append to service template group from /servicetemplates/index"
        let preSelectedIds = this.route.snapshot.paramMap.get('ids');
        if (preSelectedIds !== null) {
            let idsAsString = preSelectedIds.split(',');
            this.preSelectedIds = [];
            //int ids are required for AngularJS
            for (let i in idsAsString) {
                this.preSelectedIds.push(parseInt(idsAsString[i], 10));
            }
        }

        if (preSelectedIds === null) {
            this.preSelectedIds = [];
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public addServicetemplategroup(): void {
        this.subscriptions.add(this.ServicetemplategroupsService.addServicetemplateGroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Service template group');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['servicetemplategroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/servicetemplategroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    this.errors = {} as GenericValidationError;
                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.ServicetemplategroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot): void => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private getDefaultPost(): ServiceTemplateGroupsAddPostServicetemplategroup {
        return {
            container: {
                name: '',
                parent_id: 0
            },
            description: '',
            servicetemplates: {
                _ids: []
            }
        }
    }


    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        // preselect servicetemplates if ids are passed
        this.post.servicetemplates._ids = this.preSelectedIds;
        this.loadServicetemplates('');
    }

    /*******************
     * ARROW functions *
     *******************/
    protected loadServicetemplates = (servicetemplateName: string): void => {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplatesByContainerId(this.post.container.parent_id, servicetemplateName, this.post.servicetemplates._ids)
            .subscribe((result: LoadServiceTemplatesRoot): void => {
                this.servicetemplates = result.servicetemplates;
                this.cdr.markForCheck();
            }))
    }
}
