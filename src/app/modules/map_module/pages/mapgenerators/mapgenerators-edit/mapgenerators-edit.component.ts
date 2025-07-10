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
import { Mapgenerator, MapgeneratorPost } from '../mapgenerators.interface';
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
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

@Component({
    selector: 'oitc-mapgenerators-edit',
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
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormLoaderComponent
    ],
    templateUrl: './mapgenerators-edit.component.html',
    styleUrl: './mapgenerators-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapgeneratorsEditComponent implements OnInit, OnDestroy {

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

    protected mapgeneratorId: number = 0;

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): MapgeneratorPost {
        return {
            Mapgenerator: {
                name: '',
                description: '',
                interval: 90,
                type: 1,
                items_per_line: 10,
                containers: {
                    _ids: []
                }
            }
        };
    }

    ngOnInit(): void {
        this.mapgeneratorId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.load();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.MapgeneratorsService.getEdit(this.mapgeneratorId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                const mapgenerator: Mapgenerator = result.mapgenerator;
                let selectedContainer = [];

                for (let key in mapgenerator.containers) {
                    selectedContainer.push(parseInt(String(mapgenerator.containers[key].id), 10));
                }

                this.post.Mapgenerator.containers._ids = mapgenerator.containers.map(container => container.id);
                this.post.Mapgenerator.name = mapgenerator.name;
                this.post.Mapgenerator.description = mapgenerator.description;
                this.post.Mapgenerator.interval = parseInt(String(mapgenerator.interval), 10);
                this.post.Mapgenerator.type = mapgenerator.type;
                this.post.Mapgenerator.items_per_line = mapgenerator.items_per_line;
            }));
    }

    public updateMapgenerator(): void {
        this.subscriptions.add(this.MapgeneratorsService.updateMapgenerator(this.post, this.mapgeneratorId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('updated successfully');
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

        this.subscriptions.add(this.MapgeneratorsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

}
