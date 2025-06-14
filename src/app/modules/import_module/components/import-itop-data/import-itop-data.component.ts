import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
  AlertComponent,
  AlertHeadingDirective,
  ButtonCloseDirective,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalService,
  ModalTitleDirective,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';

import { PermissionDirective } from '../../../../permissions/permission.directive';
import { Router, RouterLink } from '@angular/router';
import {
    Application,
    Applications,
    ExternalSystemEntity
} from '../../pages/externalsystems/external-systems.interface';
import { ExternalSystemsService } from '../../pages/externalsystems/external-systems.service';
import { GenericMessageResponse } from '../../../../generic-responses';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-import-itop-data',
    imports: [
    ButtonCloseDirective,
    ColComponent,
    FaIconComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NgForOf,
    NgIf,
    RowComponent,
    TranslocoDirective,
    XsButtonDirective,
    FaStackComponent,
    FaStackItemSizeDirective,
    PermissionDirective,
    RouterLink,
    AlertComponent,
    AlertHeadingDirective,
    TableLoaderComponent,
    TableDirective,
    DebounceDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormsModule
],
    templateUrl: './import-itop-data.component.html',
    styleUrl: './import-itop-data.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportITopDataComponent implements OnInit, OnDestroy {
    @ViewChild('modal') private modal!: ModalComponent;
    @Output() completed = new EventEmitter<boolean>();

    public readonly router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly modalService = inject(ModalService);
    private readonly ExternalSystemService = inject(ExternalSystemsService);

    public externalSystem?: ExternalSystemEntity;
    protected iTopData: {
        success: boolean; data: Applications | GenericMessageResponse;
    } | undefined;
    public applications: Application[] = [];
    public ignoreExternalSystem: boolean = false;
    public showSynchronizingSpinner: boolean = false;
    public showSpinner: boolean = false;
    public errors: GenericMessageResponse | null = null;
    public hasRootPrivileges: boolean = false;
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit() {
        this.ExternalSystemService.modalExternalSystem$.subscribe((externalSystem: ExternalSystemEntity) => {
            this.externalSystem = externalSystem;
            this.cdr.markForCheck();
        });


        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            this.cdr.markForCheck();
            if (state.show === true && state.id === 'importITopData') {
                if (!this.externalSystem) {
                    return;
                }

                switch (this.externalSystem.system_type) {
                    case 'itop':
                        this.ExternalSystemService.loadDataFromITop(this.externalSystem).subscribe(data => {
                            this.iTopData = data;
                            this.cdr.markForCheck();
                            if (this.iTopData.success) {
                                // @ts-ignore
                                for (let application of this.iTopData.data<Application>) {
                                    this.applications.push(application);
                                }
                                // @ts-ignore
                                this.hasRootPrivileges = this.iTopData.hasRootPrivileges;
                                this.cdr.markForCheck();
                            }
                            if (!this.iTopData.success) {
                                if (this.iTopData.hasOwnProperty('error')) {
                                    // @ts-ignore
                                    this.errors = this.iTopData.error;
                                    this.cdr.markForCheck();
                                }
                            }

                        });
                        break;

                    default:
                        console.log('External System not supported yet')
                        return;
                }
            }
        }));

    }

    public hideModal() {
        this.modalService.toggle({
            show: false,
            id: 'importITopData'
        });
    }


    public startDataImport() {
        this.cdr.markForCheck();
        if (this.externalSystem && !this.externalSystem.id) {
            return;
        }
        if (this.externalSystem) {
            this.showSpinner = true;
            this.showSynchronizingSpinner = true;
            this.errors = null;
            this.ExternalSystemService.startDataImport(this.externalSystem, this.ignoreExternalSystem).subscribe(data => {
                this.cdr.markForCheck();
                this.showSynchronizingSpinner = false;
                this.showSpinner = false;
                if (data.success) {
                    this.hideModal();
                    this.completed.emit(true);
                }
            });
        }
    }
}
