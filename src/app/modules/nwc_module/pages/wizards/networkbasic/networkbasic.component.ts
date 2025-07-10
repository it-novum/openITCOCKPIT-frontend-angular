import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { WizardsAbstractComponent } from '../../../../../pages/wizards/wizards-abstract/wizards-abstract.component';
import { SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { NetworkbasicWizardService } from './networkbasic-wizard.service';
import {
    InterfaceServicetemplate,
    N0,
    NetworkbasicWizardGet,
    NetworkbasicWizardPost
} from './networkbasic-wizard.interface';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
    WizardsDynamicfieldsComponent
} from '../../../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';
import { OitcAlertComponent } from '../../../../../components/alert/alert.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Service } from '../../../../../pages/wizards/wizards.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';

@Component({
    selector: 'oitc-networkbasic',
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoPipe,
        RequiredIconComponent,
        SelectComponent,
        FormLabelDirective,
        FormControlDirective,
        NgIf,
        WizardsDynamicfieldsComponent,
        TranslocoDirective,
        OitcAlertComponent,
        ProgressBarModule,
        XsButtonDirective,
        CardTitleDirective,
        ColComponent,
        FormCheckInputDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        NgForOf,
        NgSelectComponent,
        RowComponent,
        BackButtonDirective,
        FormFeedbackComponent,
        FormErrorDirective,
        FormsModule,
        NgClass
    ],
    templateUrl: './networkbasic.component.html',
    styleUrl: './networkbasic.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkbasicComponent extends WizardsAbstractComponent {
    @ViewChild(WizardsDynamicfieldsComponent) childComponentLocal!: WizardsDynamicfieldsComponent;
    protected override WizardService: NetworkbasicWizardService = inject(NetworkbasicWizardService);

    protected override post: NetworkbasicWizardPost = {
// Default fields from the base wizard
        host_id: 0,
        services: [],
// Fields for the wizard
        authPassword: '',
        authProtocol: 'md5',
        interfaces: [],
        privacyPassword: '',
        privacyProtocol: 'des',
        securityLevel: '1',
        securityName: '',
        snmpCommunity: '',
        snmpVersion: '2'
    } as NetworkbasicWizardPost;
    protected snmpVersions: SelectKeyValueString[] = [
        {value: '1', key: 'SNMP V 1'},
        {value: '2', key: 'SNMP V 2c'},
        {value: '3', key: 'SNMP V 3'},
    ]
    protected searchedTags: string[] = [];


    protected securityLevels: SelectKeyValueString[] = [
        {key: 'authPriv', value: '1'},
        {key: 'authNoPriv', value: '2'},
        {key: 'noAuthNoPriv', value: '3'},
    ];
    protected authProtocols: SelectKeyValueString[] = [
        {key: 'MD5', value: 'md5'},
        {key: 'SHA', value: 'sha'},
    ];
    protected privacyProtocols: SelectKeyValueString[] = [
        {key: 'DES', value: 'des'},
        {key: 'AES', value: 'aes'},
        {key: 'AES128', value: 'aes128'},
        {key: '3DES', value: '3des'},
        {key: '3DESDE', value: '3desde'},
    ];
    protected interfaceServicetemplate: InterfaceServicetemplate = {} as InterfaceServicetemplate;

    protected override wizardLoad(result: NetworkbasicWizardGet): void {
        this.interfaceServicetemplate = result.interfaceServicetemplate;

        super.wizardLoad(result);
    }

    public override submit(): void {
        // let request = this.post; // Clone the original post object here!
        let request: NetworkbasicWizardPost = JSON.parse(JSON.stringify(this.post));

        // Remove all services from request where createService is false.
        request.services = this.post.services.filter((service: Service) => {
            return service.createService === true;
        });
        // Remove all interfaces from request where createService is false.
        request.interfaces = this.post.interfaces.filter((service: N0) => {
            return service.createService === true;
        });


        this.subscriptions.add(this.WizardService.submit(request)
            .subscribe((result: GenericResponseWrapper) => {
                this.errors = {} as GenericValidationError;
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
                    this.cdr.markForCheck();
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
                this.cdr.markForCheck();
            })
        );
    }

    protected toggleCheck(theService: Service | undefined): void {
        if (theService) {
            this.post.interfaces.forEach((service: N0) => {
                if (service.name !== theService.name) {
                    return;
                }
                service.createService = !service.createService
            });
            this.cdr.markForCheck();
            return;
        }
        this.post.interfaces.forEach((service: N0) => {
            if (!this.hasName(service.name)) {
                return;
            }
            service.createService = !service.createService
        });
        this.cdr.markForCheck();
    }

    protected detectColor = function (label: string): string {
        if (label.match(/warning/gi)) {
            return 'warning';
        }

        if (label.match(/critical/gi)) {
            return 'critical';
        }

        return '';
    };

    protected hasName = (name: string): boolean => {
        if (this.searchedTags.length === 0) {
            return true;
        }
        return this.searchedTags.some((tag) => {
            return name.toLowerCase().includes(tag.toLowerCase());
        });
    }

    protected runSnmpDiscovery(): void {
        this.post.interfaces = [];
        this.cdr.markForCheck();
        this.WizardService.executeSNMPDiscovery(this.post).subscribe((data: any) => {
            this.errors = {} as GenericValidationError;
            this.cdr.markForCheck();
            // Error
            if (data.interfaces) {
                for (let key in data.interfaces) {
                    let servicetemplatecommandargumentvalues = JSON.parse(JSON.stringify(this.interfaceServicetemplate.servicetemplatecommandargumentvalues));
                    servicetemplatecommandargumentvalues[0].value = data.interfaces[key].value.name;
                    this.post.interfaces.push(
                        {
                            createService: !this.isServiceAlreadyPresent(this.WizardGet.servicesNamesForExistCheck, data.interfaces[key].value.name),
                            description: String(data.interfaces[key].value.number),
                            host_id: this.post.host_id,
                            name: String(data.interfaces[key].value.name),
                            servicecommandargumentvalues: servicetemplatecommandargumentvalues,
                            servicetemplate_id: this.interfaceServicetemplate.id
                        });
                }
                this.childComponentLocal.cdr.markForCheck();
                this.cdr.markForCheck();
                return;
            }
            this.notyService.genericError();
            const errorResponse: GenericValidationError = data.data as GenericValidationError;
            if (data.data) {
                this.errors = errorResponse;
            }
            this.cdr.markForCheck();
        });
    }
}
