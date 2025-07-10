import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { DesignsService } from '../designs.service';
import { Design, DesignsEditRoot, MaxUploadLimit } from '../designs.interface';
import Dropzone from 'dropzone';
import { DOCUMENT, NgIf } from '@angular/common';
import { AuthService } from '../../../../../auth/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import {
    ButtonCloseDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective,
    RowComponent
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import {
    ReloadInterfaceModalComponent
} from '../../../../../layouts/coreui/reload-interface-modal/reload-interface-modal.component';

@Component({
    selector: 'oitc-designs-edit',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalToggleDirective,
        RequiredIconComponent,
        SelectComponent,
        ButtonCloseDirective,
        ReloadInterfaceModalComponent,
        FormLabelDirective,
        ButtonGroupComponent,
        NgIf
    ],
    templateUrl: './designs-edit.component.html',
    styleUrl: './designs-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignsEditComponent implements OnInit, OnDestroy {

    private readonly DesignsService: DesignsService = inject(DesignsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly authService = inject(AuthService);
    private readonly modalService = inject(ModalService);
    private readonly document = inject(DOCUMENT);

    private subscriptions: Subscription = new Subscription();

    public errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);
    private post!: Design;
    private showExportButton: boolean = true;
    protected maxUploadLimit: MaxUploadLimit | null = null;
    private init: boolean = true;
    protected logoType: string | undefined;
    protected showUpload: boolean = false;
    protected logoPdfForHtml: string = '';
    protected smallLogoPdfForHtml: string = '';
    protected logoForHtml: string = '';
    protected headerLogoForHtml: string = '';
    protected customLoginBackgroundHtml: string = '';
    protected customStatusPageHeaderHtml: string = '';
    protected isCustomStatusPageHeader: boolean = false;
    protected logTypeOptions: SelectKeyValueString[] = [
        {key: '0', value: this.TranslocoService.translate('Interface and PDFs')},
        {key: '1', value: this.TranslocoService.translate('Notifications')},
        {key: '2', value: this.TranslocoService.translate('Interface and Login')},
        {key: '3', value: this.TranslocoService.translate('Header logo')},
        {key: '4', value: this.TranslocoService.translate('Login background image')},
        {key: '5', value: this.TranslocoService.translate('Status Page Header')},
    ];

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.DesignsService.getEdit()
            .subscribe((result: DesignsEditRoot) => {
                this.post = result.design;
                if (result.new === true) {
                    this.showExportButton = false;
                }
                this.maxUploadLimit = result.maxUploadLimit;
                // append timestamp to force reload of images (url changes on every request = reload image)
                let timestamp: string = "?" + new Date().getTime();
                this.logoPdfForHtml = result.logoPdfForHtml + timestamp;
                this.smallLogoPdfForHtml = result.smallLogoPdfForHtml + timestamp;
                this.logoForHtml = result.logoForHtml + timestamp;
                this.headerLogoForHtml = result.headerLogoForHtml + timestamp;
                this.customLoginBackgroundHtml = result.customLoginBackgroundHtml + timestamp;
                this.customStatusPageHeaderHtml = result.customStatusPageHeaderHtml + timestamp;
                this.isCustomStatusPageHeader = result.isCustomStatusPageHeader;
                this.init = false;
                this.cdr.markForCheck();
            }));
    };

    private createDropzone() {
        let logoDropzone = this.document.getElementById('logoDropzone');
        if (logoDropzone) {
            const dropzone = new Dropzone(logoDropzone, {
                method: "post",
                maxFilesize: this.maxUploadLimit?.value, //MB
                acceptedFiles: 'image/*', //mimetypes
                paramName: this.logoType,
                clickable: true,
                headers: {
                    'X-CSRF-TOKEN': this.authService.csrfToken || ''
                },
                url: '/design_module/uploads/uploadLogo.json?angular=true',
                removedfile: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();
                },
                sending: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: FormData) => {
                    this.cdr.markForCheck();
                },
                success: (file: Dropzone.DropzoneFile) => {
                    this.cdr.markForCheck();

                    const response = file.xhr;

                    let errorMessage: undefined | string = undefined;
                    if (response) {
                        const serverResponse = JSON.parse(response.response);

                        if (serverResponse.success) {
                            // Update the preview element to show check mark icon
                            this.updatePreviewElement(file, 'success');

                            this.notyService.genericSuccess(
                                serverResponse.message
                            );
                            this.hideUploadModals();
                            // open modal page reload modal
                            this.modalService.toggle({
                                show: true,
                                id: 'reloadInterfaceModal',
                            });
                            return;
                        }

                        if (serverResponse.message) {
                            errorMessage = serverResponse.message;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', errorMessage);
                    this.notyService.genericError(errorMessage);

                },
                error: (file: Dropzone.DropzoneFile, error: string | any, xhr: XMLHttpRequest) => {
                    this.cdr.markForCheck();

                    let message = '';
                    if (typeof error === 'string') {
                        message = error;
                    } else {
                        // Error is an object
                        // "error" contains now the server response
                        // This happens if you upload a wrong file type like ".exe" or ".pdf"
                        message = "Unknown server error";
                        if (error.hasOwnProperty('error')) {
                            message = error.error;
                        }
                    }

                    // Update the preview element to show the error message and the X icon
                    this.updatePreviewElement(file, 'error', message);

                    if (typeof xhr === 'undefined') {
                        // User tried to upload illegal file types such as .pdf or so
                        this.notyService.genericError(message);
                    } else {
                        // File got uploaded to the server, but server returned an error
                        let response = message as unknown as Error;
                        this.notyService.genericError(response.message);
                    }
                }
            });
        }
        this.cdr.markForCheck();
    };

    private updatePreviewElement(file: Dropzone.DropzoneFile, state: 'success' | 'error', tooltipMessage: string | undefined = undefined) {
        const previewElement = file.previewElement;

        previewElement.classList.remove('dz-processing');
        previewElement.classList.add(`dz-${state}`); // dz-error or dz-success

        const errorMessageElement = previewElement.children.item(3);  // .dz-error-message
        if (errorMessageElement && tooltipMessage) {
            errorMessageElement.children[0].innerHTML = tooltipMessage; // .dz-error-message span
        }
    }

    protected resetLogo(type: number) {
        this.subscriptions.add(this.DesignsService.resetLogo(type)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    this.notyService.genericSuccess(result.success);
                    // open modal page reload modal
                    this.modalService.toggle({
                        show: true,
                        id: 'reloadInterfaceModal',
                    });
                    return;
                }

                // Error
                this.notyService.genericError(result.message);
            }))
    }

    private hideUploadModals() {
        this.modalService.toggle({
            show: false,
            id: 'UploadLogoModal',
        });
    };

    protected triggerUploadLogoModal(selectedLogoOption?: number) {
        if (typeof selectedLogoOption !== "undefined") {
            // Pre-select a logo / background option in the select box
            this.logoType = String(selectedLogoOption);
        }
        this.onLogoTypeChange();
        this.modalService.toggle({
            show: true,
            id: 'UploadLogoModal',
        });
    }

    public onLogoTypeChange() {
        if (this.logoType != null) {
            this.showUpload = true;

            //destroy previous dropzone instances
            let logoDropzone = this.document.getElementById('logoDropzone');
            if (logoDropzone && logoDropzone.dropzone) {
                logoDropzone.dropzone.destroy();
            }

            if (this.maxUploadLimit != null) {
                this.createDropzone();
            }
        }
    };

}
