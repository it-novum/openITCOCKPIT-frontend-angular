import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTitleDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormDirective,
  FormLabelDirective,
  InputGroupComponent,
  NavComponent,
  NavItemComponent
} from '@coreui/angular';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostdependencyContainerResult, HostdependencyPost } from '../../hostdependencies/hostdependencies.interface';
import { HostdependenciesService } from '../hostdependencies.service';

import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from '../../../permissions/permissions.service';
import { HistoryService } from '../../../history.service';


@Component({
    selector: 'oitc-hostdependencies-add',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    BackButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    InputGroupComponent,
    LabelLinkComponent,
    MultiSelectComponent,
    NavComponent,
    NavItemComponent,
    NgIf,
    RequiredIconComponent,
    SelectComponent,
    TrueFalseDirective,
    XsButtonDirective,
    FormCheckComponent
],
    templateUrl: './hostdependencies-add.component.html',
    styleUrl: './hostdependencies-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostdependenciesAddComponent implements OnInit, OnDestroy {
    public containers: HostdependencyContainerResult | undefined;
    public post: HostdependencyPost = {} as HostdependencyPost;
    public hosts: SelectKeyValueWithDisabled[] = [];
    public hosts_dependent: SelectKeyValueWithDisabled[] = [];
    public hostgroups: SelectKeyValueWithDisabled[] = [];
    public hostgroups_dependent: SelectKeyValueWithDisabled[] = [];
    public timeperiods: SelectKeyValue[] = [];

    public errors: GenericValidationError | null = null;

    private readonly HostdependenciesService = inject(HostdependenciesService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private router: Router = inject(Router);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    constructor(private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            //Fire on page load
            this.loadContainers();
            this.post = this.getDefaultPost();
            this.cdr.markForCheck();
        });
    }

    public loadContainers() {
        this.subscriptions.add(this.HostdependenciesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    private loadElements() {
        const containerId = this.post.container_id;

        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdependenciesService.loadElements(containerId)
            .subscribe((result) => {
                this.cdr.markForCheck();

                this.hosts = result.hosts;
                this.hosts_dependent = result.hostsDependent;
                this.hostgroups = result.hostgroups;
                this.hostgroups_dependent = result.hostgroupsDependent;
                this.timeperiods = result.timeperiods;

                this.processChosenHosts();
                this.processChosenDependentHosts();
                this.processChosenHostgroups();
                this.processChosenDependentHostgroups();
            })
        );
    }

    public loadHosts = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }
        this.subscriptions.add(this.HostdependenciesService.loadHosts(containerId, searchString, this.post.hosts._ids)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.hosts = result.hosts;
                this.hosts = this.hosts.map(obj => ({
                    ...obj,
                    disabled: this.post.hosts_dependent._ids.includes(obj.key)
                }));
            })
        );
    }

    public loadDependentHosts = (searchString: string) => {
        const containerId = this.post.container_id;
        if (!containerId) {
            return;
        }

        this.subscriptions.add(this.HostdependenciesService.loadDependentHosts(containerId, searchString, this.post.hosts_dependent._ids)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.hosts_dependent = result.hosts;
                this.hosts_dependent = this.hosts_dependent.map(obj => {
                    return {
                        ...obj,
                        disabled: this.post.hosts._ids.includes(obj.key)
                    }
                });
            }));
    }

    public onContainerChange() {
        this.loadElements();
    }

    public processChosenHosts() {
        this.cdr.markForCheck();
        if (this.hosts.length === 0) {
            return;
        }
        for (let key in this.hosts) {
            this.hosts[key].disabled = this.post.hosts_dependent._ids.includes(this.hosts[key].key);
        }
    }

    public processChosenDependentHosts() {
        this.cdr.markForCheck();
        if (this.hosts_dependent.length === 0) {
            return;
        }

        for (let key in this.hosts_dependent) {
            this.hosts_dependent[key].disabled = this.post.hosts._ids.includes(this.hosts_dependent[key].key);
        }
    }

    public processChosenHostgroups() {
        this.cdr.markForCheck();
        if (this.hostgroups.length === 0) {
            return;
        }
        for (let key in this.hostgroups) {
            this.hostgroups[key].disabled = this.post.hostgroups_dependent._ids.includes(this.hostgroups[key].key);
        }
    }

    public processChosenDependentHostgroups() {
        this.cdr.markForCheck();
        if (this.hostgroups_dependent.length === 0) {
            return;
        }
        for (let key in this.hostgroups_dependent) {
            this.hostgroups_dependent[key].disabled = this.post.hostgroups._ids.includes(this.hostgroups_dependent[key].key);
        }
    }

    private getDefaultPost(): HostdependencyPost {
        return {
            container_id: null,
            inherits_parent: 0,
            timeperiod_id: null,
            execution_fail_on_up: 1,
            execution_fail_on_down: 1,
            execution_fail_on_unreachable: 1,
            execution_fail_on_pending: 1,
            execution_none: 0,
            notification_fail_on_up: 1,
            notification_fail_on_down: 1,
            notification_fail_on_unreachable: 1,
            notification_fail_on_pending: 1,
            notification_none: 0,
            hosts: {
                _ids: []
            },
            hosts_dependent: {
                _ids: []
            },
            hostgroups: {
                _ids: []
            },
            hostgroups_dependent: {
                _ids: []
            }
        };
    }

    public submit() {
        this.subscriptions.add(this.HostdependenciesService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Host hostdependency');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['hostdependencies', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    this.HistoryService.navigateWithFallback(['/hostdependencies/index']);

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    public ngOnDestroy(): void {
    }

    public checkExecutionFailureCriteria() {
        this.post.execution_none = (this.post.execution_fail_on_up | this.post.execution_fail_on_down | this.post.execution_fail_on_unreachable |
            this.post.execution_fail_on_pending) ? 0 : 1;
    }

    public resetExecutionOnFailureCriteria() {
        if (this.post.execution_none === 1) {
            this.post.execution_fail_on_up = 0;
            this.post.execution_fail_on_down = 0;
            this.post.execution_fail_on_unreachable = 0;
            this.post.execution_fail_on_pending = 0;
        } else {
            this.post.execution_fail_on_up = 1;
            this.post.execution_fail_on_down = 1;
            this.post.execution_fail_on_unreachable = 1;
            this.post.execution_fail_on_pending = 1;
        }
    }

    public checkNotificationFailureCriteria() {
        this.post.notification_none = (this.post.notification_fail_on_up | this.post.notification_fail_on_down | this.post.notification_fail_on_unreachable |
            this.post.notification_fail_on_pending) ? 0 : 1;
    }

    public resetNotificationOnFailureCriteria() {
        if (this.post.notification_none === 1) {
            this.post.notification_fail_on_up = 0;
            this.post.notification_fail_on_down = 0;
            this.post.notification_fail_on_unreachable = 0;
            this.post.notification_fail_on_pending = 0;
        } else {
            this.post.notification_fail_on_up = 1;
            this.post.notification_fail_on_down = 1;
            this.post.notification_fail_on_unreachable = 1;
            this.post.notification_fail_on_pending = 1;
        }
    }
}
