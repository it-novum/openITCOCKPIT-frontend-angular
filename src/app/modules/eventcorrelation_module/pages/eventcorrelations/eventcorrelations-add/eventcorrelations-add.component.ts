import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { HostAddEditSuccessResponse, HostPost } from '../../../../../pages/hosts/hosts.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import { HosttemplatePost } from '../../../../../pages/hosttemplates/hosttemplates.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  AlertComponent,
  AlertHeadingDirective,
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
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CheckAttemptsInputComponent
} from '../../../../../layouts/coreui/check-attempts-input/check-attempts-input.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { HumanTimeComponent } from '../../../../../layouts/coreui/interval-input/human-time/human-time.component';
import { IntervalInputComponent } from '../../../../../layouts/coreui/interval-input/interval-input.component';
import { LabelLinkComponent } from '../../../../../layouts/coreui/label-link/label-link.component';
import { MacrosComponent } from '../../../../../components/macros/macros.component';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { PriorityComponent } from '../../../../../layouts/coreui/priority/priority.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { TemplateDiffBtnComponent } from '../../../../../components/template-diff-btn/template-diff-btn.component';
import { TemplateDiffComponent } from '../../../../../components/template-diff/template-diff.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostsService } from '../../../../../pages/hosts/hosts.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ObjectTypesEnum, ROOT_CONTAINER } from '../../../../../pages/changelogs/object-types.enum';
import { EventcorrelationsService } from '../eventcorrelations.service';

@Component({
    selector: 'oitc-eventcorrelations-add',
    imports: [
    AlertComponent,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CheckAttemptsInputComponent,
    FaIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    HumanTimeComponent,
    IntervalInputComponent,
    LabelLinkComponent,
    MacrosComponent,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgForOf,
    NgIf,
    NgSelectModule,
    PermissionDirective,
    PriorityComponent,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    TrueFalseDirective,
    XsButtonDirective,
    RouterLink,
    TranslocoPipe,
    AlertHeadingDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    TemplateDiffComponent,
    TemplateDiffBtnComponent,
    AsyncPipe,
    BackButtonDirective,
    CheckAttemptsInputComponent,
    FormErrorDirective,
    FormFeedbackComponent,
    HumanTimeComponent,
    IntervalInputComponent,
    LabelLinkComponent,
    MacrosComponent,
    MultiSelectComponent,
    PermissionDirective,
    PriorityComponent,
    RequiredIconComponent,
    SelectComponent,
    TemplateDiffBtnComponent,
    TemplateDiffComponent,
    TrueFalseDirective,
    XsButtonDirective
],
    templateUrl: './eventcorrelations-add.component.html',
    styleUrl: './eventcorrelations-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsAddComponent implements OnInit, OnDestroy {
    public containers: SelectKeyValue[] | undefined;
    public commands: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];
    public post: HostPost = {} as HostPost;
    public showRootAlert: boolean = false;

    public data = {
        isHostnameInUse: false
    };

    public hosttemplates: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValue[] = [];
    public timeperiods: SelectKeyValue[] = [];
    public checkperiods: SelectKeyValue[] = [];
    public contacts: SelectKeyValue[] = [];
    public contactgroups: SelectKeyValue[] = [];
    public sharingContainers: SelectKeyValue[] = [];
    public exporters: SelectKeyValue[] = [];
    public slas: SelectKeyValue[] = [];
    public parenthosts: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;
    public hasMacroErrors: boolean = false;

    protected hosttemplate?: HosttemplatePost;

    private readonly HostsService = inject(HostsService);
    private readonly EventcorrelationsService = inject(EventcorrelationsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.loadCommands();

            this.post = this.getDefaultPost();
        });

        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): HostPost {
        this.tagsForSelect = [];

        return {
            name: '',
            description: '',
            hosttemplate_id: 0,
            address: '',
            command_id: 0,
            eventhandler_command_id: 0,
            check_interval: 3600,
            retry_interval: 60,
            max_check_attempts: 3,
            first_notification_delay: 0,
            notification_interval: 7200,
            notify_on_down: 1,
            notify_on_unreachable: 1,
            notify_on_recovery: 1,
            notify_on_flapping: 0,
            notify_on_downtime: 0,
            flap_detection_enabled: 0,
            flap_detection_on_up: 0,
            flap_detection_on_down: 0,
            flap_detection_on_unreachable: 0,
            low_flap_threshold: 0,
            high_flap_threshold: 0,
            process_performance_data: 0,
            freshness_checks_enabled: 0,
            freshness_threshold: 0,
            passive_checks_enabled: 1,
            event_handler_enabled: 0,
            active_checks_enabled: 1,
            retain_status_information: 0,
            retain_nonstatus_information: 0,
            notifications_enabled: 1,
            notes: '',
            priority: 1,
            check_period_id: 0,
            notify_period_id: 0,
            tags: '',
            container_id: 0,
            host_url: '',
            satellite_id: 0,
            sla_id: null,
            contacts: {
                _ids: []
            },
            contactgroups: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            hosts_to_containers_sharing: {
                _ids: []
            },
            parenthosts: {
                _ids: []
            },
            customvariables: [],
            hostcommandargumentvalues: [],
            prometheus_exporters: {
                _ids: []
            }
        };
    }

    public loadContainers() {
        this.subscriptions.add(this.HostsService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    public loadCommands() {
        this.subscriptions.add(this.HostsService.loadCommands()
            .subscribe((result) => {
                this.commands = result;
                this.cdr.markForCheck();
            })
        );
    }


    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadElements(containerId, 0, 1)
            .subscribe((result) => {
                this.hosttemplates = result.hosttemplates;
                this.hostgroups = result.hostgroups;
                this.timeperiods = result.timeperiods;
                this.checkperiods = result.checkperiods;
                this.contacts = result.contacts;
                this.contactgroups = result.contactgroups;
                this.sharingContainers = result.sharingContainers;
                this.exporters = result.exporters;
                this.slas = result.slas;
                this.cdr.markForCheck();
            })
        );
    }

    public loadParentHosts = (searchString: string) => {
        if (!this.post.container_id) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadParentHosts(searchString, this.post.container_id, this.post.parenthosts._ids, this.post.satellite_id)
            .subscribe((result) => {
                this.parenthosts = result;
                this.cdr.markForCheck();
            })
        );
    };

    private loadCommandArguments() {
        const commandId = this.post.command_id;

        if (!commandId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadCommandArguments(commandId)
            .subscribe((result) => {
                this.post.hostcommandargumentvalues = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onContainerChange() {
        this.loadElements();
        this.loadParentHosts('');
        this.showRootAlert = this.post.container_id === ROOT_CONTAINER;
        this.cdr.markForCheck();
    }

    public onCommandChange() {
        this.loadCommandArguments();
    }

    public onHosttemplateChange() {
        const hosttemplateId = this.post.hosttemplate_id;
        if (!hosttemplateId) {
            return;
        }

        this.subscriptions.add(this.HostsService.loadHosttemplate(hosttemplateId)
            .subscribe((result) => {
                this.hosttemplate = result;
                this.setValuesFromHosttemplate();
            })
        );

    }

    public checkForDuplicateHostname() {
        this.subscriptions.add(this.HostsService.checkForDuplicateHostname(this.post.name)
            .subscribe((result) => {
                this.data.isHostnameInUse = result;
                this.cdr.markForCheck();
            })
        );
    }

    private setValuesFromHosttemplate() {
        if (!this.hosttemplate) {
            return;
        }

        this.cdr.markForCheck();

        const fields = [
            'description',
            'hosttemplate_id',
            'address',
            'command_id',
            'eventhandler_command_id',
            'check_interval',
            'retry_interval',
            'max_check_attempts',
            'first_notification_delay',
            'notification_interval',
            'notify_on_down',
            'notify_on_unreachable',
            'notify_on_recovery',
            'notify_on_flapping',
            'notify_on_downtime',
            'flap_detection_enabled',
            'flap_detection_on_up',
            'flap_detection_on_down',
            'flap_detection_on_unreachable',
            'low_flap_threshold',
            'high_flap_threshold',
            'process_performance_data',
            'freshness_checks_enabled',
            'freshness_threshold',
            'passive_checks_enabled',
            'event_handler_enabled',
            'active_checks_enabled',
            'retain_status_information',
            'retain_nonstatus_information',
            'notifications_enabled',
            'notes',
            'priority',
            'check_period_id',
            'notify_period_id',
            'tags',
            'host_url',
            'sla_id'
        ];

        for (let index in fields) {
            let field = fields[index];
            if (this.hosttemplate.hasOwnProperty(field)) {

                // Basically, we are doing the following:
                //this.post[field] = this.hosttemplate[field];

                (this.post as any)[field] = (this.hosttemplate as any)[field];
            }
        }

        var hasManyAssociations = [
            'hostgroups', 'contacts', 'contactgroups', 'prometheus_exporters'
        ];
        for (let index in hasManyAssociations) {
            let field = hasManyAssociations[index];
            if (this.hosttemplate.hasOwnProperty(field)) {
                // @ts-ignore
                this.post[field]._ids = this.hosttemplate[field]._ids;
            }
        }

        this.post.customvariables = [];
        for (let index in this.hosttemplate.customvariables) {
            this.post.customvariables.push({
                objecttype_id: ObjectTypesEnum['HOSTTEMPLATE'], //OBJECT_HOSTTEMPLATE because value from host template
                name: this.hosttemplate.customvariables[index].name,
                value: this.hosttemplate.customvariables[index].value,
                password: this.hosttemplate.customvariables[index].password
            });
        }

        this.post.hostcommandargumentvalues = [];
        for (let index in this.hosttemplate.hosttemplatecommandargumentvalues) {
            this.post.hostcommandargumentvalues.push({
                commandargument_id: this.hosttemplate.hosttemplatecommandargumentvalues[index].commandargument_id,
                value: this.hosttemplate.hosttemplatecommandargumentvalues[index].value,
                commandargument: this.hosttemplate.hosttemplatecommandargumentvalues[index].commandargument
            });
        }

        // "".split() returns [''] instead of [] like in php
        this.tagsForSelect = (this.post.tags !== '') ? this.post.tags.split(',') : [];
    }

    /*******************
     * MACRO functions *
     *******************/
    public addMacro() {
        this.post.customvariables.push({
            name: '',
            objecttype_id: ObjectTypesEnum["HOST"],
            password: 0,
            value: '',
        });
        this.cdr.markForCheck();
    }

    protected deleteMacro = (index: number) => {
        this.post.customvariables.splice(index, 1);
        this.cdr.markForCheck();
    }


    public submit() {
        this.post.tags = this.tagsForSelect.join(',');

        this.subscriptions.add(this.EventcorrelationsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as HostAddEditSuccessResponse;

                    const title = this.TranslocoService.translate('Event Correlation');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['hosts', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.router.navigate(['/eventcorrelation_module/eventcorrelations/editCorrelation', response.id]);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                    this.hasMacroErrors = false;
                    if (this.errors.hasOwnProperty('customvariables')) {
                        if (typeof (this.errors['customvariables']['custom']) === "string") {
                            this.hasMacroErrors = true;
                        }
                    }
                }
            }));

    }

    protected readonly ROOT_CONTAINER = ROOT_CONTAINER;
}
