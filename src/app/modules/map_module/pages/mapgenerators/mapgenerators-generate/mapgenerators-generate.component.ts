import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MapgeneratorsService } from '../mapgenerators.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GenericValidationError } from '../../../../../generic-responses';
import {
    GeneratedMapsAndItems,
    Mapgenerator,
    MapgeneratorGenerateRoot,
    MapgeneratorsEditRoot
} from '../mapgenerators.interface';
import {
    AlertComponent,
    BorderDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { ProgressBar } from 'primeng/progressbar';
import { Map } from '../../maps/maps.interface';

@Component({
    selector: 'oitc-mapgenerators-generate',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormsModule,
        PermissionDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        AlertComponent,
        ColComponent,
        FormLoaderComponent,
        RowComponent,
        BorderDirective,
        AsyncPipe,
        TableDirective,
        BackButtonDirective,
        NavComponent,
        NavItemComponent,
        ProgressBar,
        FaStackComponent,
        FaStackItemSizeDirective
    ],
    templateUrl: './mapgenerators-generate.component.html',
    styleUrl: './mapgenerators-generate.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapgeneratorsGenerateComponent implements OnInit, OnDestroy {

    private readonly MapgeneratorsService: MapgeneratorsService = inject(MapgeneratorsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: {
        field: string;
        errors: {
            errorKey: string;
            errorMessage: string;
        }[];
    }[] | null = null;

    private cdr = inject(ChangeDetectorRef);

    protected mapgeneratorId: number = 0;
    protected init = true;
    public isGeneratorRunning: boolean = false;
    public generationSuccessfully: boolean = true;
    public isGeneratorFinished: boolean = false;
    public generatedMapsAndItems?: GeneratedMapsAndItems;
    public allGeneratedMaps: number[] = [];
    public newGeneratedMaps: number[] = [];

    protected mapgenerator: Mapgenerator = {} as Mapgenerator;
    protected mapCount: number = 0;

    constructor() {
    }

    ngOnInit(): void {
        this.mapgeneratorId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadMapgenerator();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadMapgenerator(): void {
        this.subscriptions.add(this.MapgeneratorsService.getGenerator(this.mapgeneratorId)
            .subscribe((result: MapgeneratorsEditRoot) => {
                this.mapgenerator = result.mapgenerator;
                if (result.mapgenerator.maps?.length) {
                    this.mapCount = result.mapgenerator.maps?.length;
                    this.allGeneratedMaps = this.mapgenerator.maps!.map(map => (map as Map).id);
                }
                this.init = false;
                this.cdr.markForCheck();
            }))
    }

    public generate() {
        this.isGeneratorRunning = true;
        this.isGeneratorFinished = false;
        this.subscriptions.add(this.MapgeneratorsService.generate(this.mapgeneratorId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.isGeneratorRunning = false;
                this.isGeneratorFinished = true;
                if (result.success) {
                    const response = result.data as MapgeneratorGenerateRoot;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('created successfully');

                    this.generatedMapsAndItems = response.generatedMapsAndItems;
                    this.allGeneratedMaps = this.generatedMapsAndItems.maps;
                    this.newGeneratedMaps = this.generatedMapsAndItems.newMaps;

                    this.mapCount = this.allGeneratedMaps.length;

                    this.generationSuccessfully = true;

                    if (this.newGeneratedMaps.length || this.generatedMapsAndItems.amountOfNewGeneratedItems) {
                        this.notyService.genericSuccess(msg, title);
                    }
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.generationSuccessfully = false;
                this.notyService.genericError();
                if (result) {
                    this.errors = this.genericValidationErrorObjectToArray(errorResponse);

                }
            }))
    }

    private genericValidationErrorObjectToArray(errorObject: GenericValidationError) {
        return Object.entries(errorObject).map(([field, errors]) => {
            return {
                field,
                errors: Object.entries(errors).map(([errorKey, errorMessage]) => ({
                    errorKey,
                    errorMessage
                }))
            };
        });
    }

    protected readonly String = String;
    protected readonly Number = Number;
}
