import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    ServicetemplateCommandArgument,
    ServicetemplateCopyPost
} from '../../servicetemplates/servicetemplates.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ServicetemplatesService } from '../servicetemplates.service';

@Component({
    selector: 'oitc-servicetemplates-copy',
    standalone: true,
    imports: [
        AlertComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NavComponent,
        NgForOf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './servicetemplates-copy.component.html',
    styleUrl: './servicetemplates-copy.component.css'
})
export class ServicetemplatesCopyComponent implements OnInit, OnDestroy {
    public servicetemplates: ServicetemplateCopyPost[] = [];
    public commands: SelectKeyValue[] = [];
    public eventhandlerCommands: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private ServicetemplatesService = inject(ServicetemplatesService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute)

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'servicetemplates', 'index']);
        }

        if (ids) {
            this.subscriptions.add(this.ServicetemplatesService.getServicetemplatesCopy(ids).subscribe(response => {
                for (let servicetemplate of response.servicetemplates) {

                    let st = <ServicetemplateCopyPost>{
                        Source: {
                            id: servicetemplate.id,
                            name: servicetemplate.name
                        },
                        Servicetemplate: servicetemplate,
                        Error: null
                    };
                    st.Servicetemplate.servicetemplatecommandargumentvalues = this.removeFieldsFromServicetemplatecommandargumentvalues(st.Servicetemplate.servicetemplatecommandargumentvalues);

                    delete st.Servicetemplate.id; // important

                    this.servicetemplates.push(st);
                }

                this.commands = response.commands;
                this.eventhandlerCommands = response.eventhandlerCommands;
            }));
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadCommandArguments(sourceServicetemplateId: number, commandId: number, index: number) {
        this.subscriptions.add(this.ServicetemplatesService.loadCommandArguments(commandId, sourceServicetemplateId).subscribe(response => {
            this.servicetemplates[index].Servicetemplate.servicetemplatecommandargumentvalues = response;
        }));
    }

    private removeFieldsFromServicetemplatecommandargumentvalues(servicetemplatecommandargumentvalues: ServicetemplateCommandArgument[]) {
        if (servicetemplatecommandargumentvalues.length === 0) {
            return [];
        }

        for (var i in servicetemplatecommandargumentvalues) {
            delete servicetemplatecommandargumentvalues[i].id;
            delete servicetemplatecommandargumentvalues[i].servicetemplate_id;
        }

        return servicetemplatecommandargumentvalues;
    }

    public copy() {
        const sub = this.ServicetemplatesService.saveServicetemplatesCopy(this.servicetemplates).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied host templates
                // 200 ok
                this.notyService.genericSuccess();
                this.router.navigate(['/', 'servicetemplates', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some host templates maybe already got created. For example when the user copied 3 host templates, and the first
                // two host templates where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.notyService.genericError();
                this.servicetemplates = error.error.result as ServicetemplateCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }
}
