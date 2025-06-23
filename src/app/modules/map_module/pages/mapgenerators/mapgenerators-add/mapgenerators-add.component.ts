import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MapgeneratorsService } from '../mapgenerators.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { LoadContainersForMapgeneratorParams, MapgeneratorPost } from '../mapgenerators.interface';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-mapgenerators-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './mapgenerators-add.component.html',
    styleUrl: './mapgenerators-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapgeneratorsAddComponent implements OnInit, OnDestroy {

    private readonly MapgeneratorsService: MapgeneratorsService = inject(MapgeneratorsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: MapgeneratorPost = {} as MapgeneratorPost;
    protected containers: SelectKeyValue[] = [];
    protected startContainers: SelectKeyValue[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): MapgeneratorPost {
        return {
            Mapgenerator: {
                name: '',
                interval: 90,
                type: 1,
                containers: {
                    _ids: []
                },
                start_containers: {
                    _ids: []
                },
            }
        };
    }

    ngOnInit(): void {
        this.loadContainers();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.MapgeneratorsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['map_module', 'mapgenerators', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/mapgenerators/index']);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

    private loadContainers(): void {

        const params: LoadContainersForMapgeneratorParams = {
            'selectedContainers[]': []
        }

        this.subscriptions.add(this.MapgeneratorsService.loadContainers(params)
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    public loadStartContainers(): void {

        const params: LoadContainersForMapgeneratorParams = {
            'selectedContainers[]': this.post.Mapgenerator.containers._ids,
            loadStartContainers: true
        }

        this.subscriptions.add(this.MapgeneratorsService.loadContainers(params)
            .subscribe((result: LoadContainersRoot) => {
                this.startContainers = result.containers;
                this.cdr.markForCheck();
            }))
    }

}
