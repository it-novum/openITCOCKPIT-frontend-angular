import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    NavComponent,
    NavItemComponent,
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { Subscription } from 'rxjs';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgFor, NgIf } from '@angular/common';
import {
    Contact,
    ContactAccessKey,
    GetTelegramSettings,
    TelegramChat,
    TelegramSettings
} from '../../../telegram.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { TelegramService } from '../../../telegram.service';


@Component({
    selector: 'oitc-telegram-settings-index',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        FormLoaderComponent,
        NgIf,
        NgFor,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NavComponent,
        NavItemComponent,
        TrueFalseDirective,
        ApikeyDocModalComponent,
        CardFooterComponent,
        XsButtonDirective,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        ButtonCloseDirective
    ],
    templateUrl: './telegram-settings-index.component.html',
    styleUrl: './telegram-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelegramSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly notyService: NotyService = inject(NotyService);
    private readonly telegramService: TelegramService = inject(TelegramService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public post!: TelegramSettings;
    public contacts: Contact[] = [];
    public contactsAccessKeys: ContactAccessKey[] = [];
    public chats: TelegramChat[] = [];
    public errors: GenericValidationError | null = null;
    public showHowToModal: boolean = false;

    public ngOnInit(): void {
        this.loadTelegramSettings();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadTelegramSettings(): void {
        this.subscriptions.add(
            this.telegramService.getTelegramSettings().subscribe((data: GetTelegramSettings) => {
                this.post = data.telegramSettings;
                this.contacts = data.contacts;
                this.contactsAccessKeys = data.contactsAccessKeys;
                this.chats = data.chats;
                this.cdr.markForCheck();
            })
        );
    }

    public submitTelegramSettings(): void {
        if (!this.post) {
            return;
        }

        // Validate required fields for two-way integration
        if (this.post.two_way && (!this.post.external_webhook_domain || !this.post.webhook_api_key)) {
            this.notyService.genericError('Fill out all required fields!');
            return;
        }

        this.subscriptions.add(
            this.telegramService.setTelegramSettings(this.post).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.errors = null;
                    this.post = result.data;
                    this.notyService.genericSuccess();
                } else if (result.data.message !== undefined) {
                    this.notyService.genericError(result.data.message);
                } else {
                    this.errors = result.data as GenericValidationError;
                    this.notyService.genericError();
                }
                this.cdr.markForCheck();
            })
        );
    }

    public isContactAccessKeyGenerated(contactUuid: string): string | false {
        for (const contactAccessKeyObj of this.contactsAccessKeys) {
            if (contactAccessKeyObj.contact_uuid === contactUuid) {
                return contactAccessKeyObj.access_key;
            }
        }
        return false;
    }

    public generateAccessKeyForContact(contactUuid: string): void {
        this.subscriptions.add(
            this.telegramService.generateAccessKeyForContact(contactUuid).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.contactsAccessKeys = result.data;
                    this.notyService.genericSuccess();
                    this.errors = null;
                } else {
                    this.notyService.genericError();
                    this.errors = result.data as GenericValidationError;
                }
                this.cdr.markForCheck();
            })
        );
    }

    public removeAccessKeyForContact(contactUuid: string): void {
        this.subscriptions.add(
            this.telegramService.removeAccessKeyForContact(contactUuid).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.contactsAccessKeys = result.data;
                    this.notyService.genericSuccess();
                    this.errors = null;
                } else {
                    this.notyService.genericError();
                    this.errors = result.data as GenericValidationError;
                }
                this.cdr.markForCheck();
            })
        );
    }

    public getContactForUuid(contactUuid: string): Contact | null {
        for (const contact of this.contacts) {
            if (contact.uuid === contactUuid) {
                return contact;
            }
        }
        return null;
    }

    public deleteChat(chatId: number): void {
        this.subscriptions.add(
            this.telegramService.deleteChat(chatId).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.chats = result.data;
                    this.notyService.genericSuccess();
                    this.errors = null;
                } else {
                    this.notyService.genericError();
                    this.errors = result.data as GenericValidationError;
                }
                this.cdr.markForCheck();
            })
        );
    }

    public sendTestChatMessage(chatId: number): void {
        this.subscriptions.add(
            this.telegramService.sendTestChatMessage(chatId).subscribe((result: GenericResponseWrapper): void => {
                if (result.success) {
                    this.notyService.genericSuccess(result.data);
                } else {
                    this.notyService.genericError(result.data);
                }
                this.cdr.markForCheck();
            })
        );
    }

    public openHowToModal(): void {
        this.showHowToModal = true;
    }

    public closeHowToModal(): void {
        this.showHowToModal = false;
    }
}
