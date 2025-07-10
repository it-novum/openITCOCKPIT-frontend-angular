/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { PermissionsService } from '../../../permissions/permissions.service';
import { Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, InputGroupComponent, InputGroupTextDirective,
    NavComponent,
    NavItemComponent, RowComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { StatuspagesService } from '../statuspages.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import {
    StatuspagePost, SelectKeyValueExtended, SelectValueExtended, StatuspagePostEdit
}
    from '../statuspage.interface';
import { GenericValidationError } from '../../../generic-responses';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { intersection } from 'lodash';


@Component({
    selector: 'oitc-statuspages-add',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        BackButtonDirective,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormErrorDirective,
        SelectComponent,
        FormDirective,
        FormsModule,
        PaginatorModule,
        NgIf,
        FormFeedbackComponent,
        FormCheckInputDirective,
        FormControlDirective,
        MultiSelectComponent,
        CardFooterComponent,
        RowComponent,
        InputGroupComponent,
        AsyncPipe,
        ColComponent,
        InputGroupTextDirective
    ],
    templateUrl: './statuspages-add.component.html',
    styleUrl: './statuspages-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatuspagesAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private StatuspagesService: StatuspagesService = inject(StatuspagesService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);
    public containers: SelectKeyValue[] = [];
    public hostgroups: SelectKeyValueExtended[] = [];
    public hosts: SelectKeyValueExtended[] = [];
    public services: SelectKeyValueExtended[] = [];
    public servicegroups: SelectKeyValueExtended[] = [];
    public post: StatuspagePostEdit = {} as StatuspagePostEdit;
    public errors: GenericValidationError | null = null;
    public noItemsSelected: boolean = false;

    constructor(private _router: Router) {
    }

    public ngOnInit(): void {
        //Fire on page load
        this.post = this.getDefaultPost();
        this.loadContainers();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadContainers() {
        this.subscriptions.add(this.StatuspagesService.loadContainers()
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    loadHostgroups = (searchString: string) => {
        if (this.post.container_id === null) {
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadHostgroups(this.post.container_id, searchString, this.post.selected_hostgroups._ids)
            .subscribe((result) => {
                let hostgroupObjects: SelectKeyValueExtended[] = [];
                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {
                        key: 0,
                        value: '',
                        id: 0,
                        _joinData: {display_alias: ''}
                    };
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    hostgroupObjects.push(objectEntry);
                });
                this.hostgroups = hostgroupObjects;
                this.cdr.markForCheck();
            })
        );
    }
    public loadHosts = (searchString: string) => {
        if (this.post.container_id === null) {
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadHosts(this.post.container_id, searchString, this.post.selected_hosts._ids)
            .subscribe((result) => {
                let hostsObjects: SelectKeyValueExtended[] = [];

                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {
                        key: 0,
                        value: '',
                        id: 0,
                        _joinData: {display_alias: ''}
                    };
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    hostsObjects.push(objectEntry);
                });
                this.hosts = hostsObjects;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServices = (searchString: string) => {
        if (this.post.container_id === null) {
            return;
        }
        console.log('searchString', searchString);
        this.subscriptions.add(this.StatuspagesService.loadServices(this.post.container_id, searchString, this.post.selected_services._ids)
            .subscribe((result) => {
                let servicesObjects: SelectKeyValueExtended[] = [];

                result.map((item: SelectValueExtended) => {
                    let objectEntry: SelectKeyValueExtended = {
                        key: 0,
                        value: '',
                        id: 0,
                        _joinData: {display_alias: ''}
                    };
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value.servicename;
                    objectEntry._joinData.display_alias = "";
                    servicesObjects.push(objectEntry);
                });
                this.services = servicesObjects;
                this.cdr.markForCheck();
            })
        );
    }

    public loadServicegroups = (searchString: string) => {
        if (this.post.container_id === null) {
            return;
        }
        this.subscriptions.add(this.StatuspagesService.loadServicegroups(this.post.container_id, searchString, this.post.selected_servicegroups._ids)
            .subscribe((result) => {
                let servicegroupsObjects: SelectKeyValueExtended[] = [];

                result.map((item: SelectKeyValue) => {
                    let objectEntry: SelectKeyValueExtended = {
                        key: 0,
                        value: '',
                        id: 0,
                        _joinData: {display_alias: ''}
                    };
                    objectEntry.key = item.key;
                    objectEntry.id = item.key;
                    objectEntry.value = item.value;
                    objectEntry._joinData.display_alias = "";
                    servicegroupsObjects.push(objectEntry);
                });
                this.servicegroups = servicegroupsObjects;
                this.cdr.markForCheck();
            })
        );
    }


    public onContainerChange() {
        this.loadHostgroups('');
        this.loadServicegroups('');
        this.loadHosts('');
        this.loadServices('');
    }

    private getDefaultPost(): StatuspagePostEdit {

        return {
            container_id: null,
            name: '',
            description: '',
            public_title: '',
            public: false,
            show_downtimes: false,
            show_downtime_comments: false,
            show_acknowledgements: false,
            show_acknowledgement_comments: false,
            selected_hostgroups: {
                _ids: []
            },
            selected_hosts: {
                _ids: []
            },
            selected_servicegroups: {
                _ids: []
            },
            selected_services: {
                _ids: []
            },
            hostgroups: [],
            hosts: [],
            servicegroups: [],
            services: [],
        };
    }

    public submit = () => {
        this.cleanUpForSubmit();
        this.filterForSubmit();

        this.subscriptions.add(this.StatuspagesService.addStatuspage(this.post)
            .subscribe((result) => {

                this.cdr.markForCheck();
                if (result.success) {

                    this.errors = null;
                    const title: string = this.TranslocoService.translate('Statuspage');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    this.notyService.genericSuccess(msg, title);
                    this._router.navigate(['statuspages', 'index']);
                    this.notyService.scrollContentDivToTop();
                    return;

                }

                // Error
                this.notyService.genericError();
                const errorResponse = result.data as GenericValidationError;
                if (result) {
                    this.noItemsSelected = false;
                    this.errors = errorResponse;
                    if (this.errors.hasOwnProperty('selected_hostgroups') ||
                        this.errors.hasOwnProperty('selected_servicegroups') ||
                        this.errors.hasOwnProperty('selected_hosts') ||
                        this.errors.hasOwnProperty('selected_services')
                    ) {
                        this.noItemsSelected = true;
                    }
                    this.cdr.markForCheck();
                }

            })
        );


    }

    private filterForSubmit = () => {

        this.post.hostgroups = this.hostgroups.filter((hostgroup) => {
            if (this.post.selected_hostgroups._ids.indexOf(hostgroup.id) !== -1) {
                return hostgroup;
            } else {
                return;
            }
        });

        this.post.servicegroups = this.hostgroups.filter((servicegroup) => {
            if (this.post.selected_servicegroups._ids.indexOf(servicegroup.id) !== -1) {
                return servicegroup;
            } else {
                return;
            }
        });

        this.post.hosts = this.hosts.filter((host) => {
            if (this.post.selected_hosts._ids.indexOf(host.id) !== -1) {
                return host;
            } else {
                return;
            }
        });

        this.post.services = this.services.filter((service) => {
            if (this.post.selected_services._ids.indexOf(service.id) !== -1) {
                return service;
            } else {
                return;
            }
        });
    }

    private cleanUpForSubmit = () => {
        this.post.selected_hostgroups._ids = intersection(
            this.hostgroups.map(hostgroup => hostgroup.key),
            this.post.selected_hostgroups._ids
        );
        this.post.selected_servicegroups._ids = intersection(
            this.servicegroups.map(servicegroup => servicegroup.key),
            this.post.selected_servicegroups._ids
        );
        this.post.selected_hosts._ids = intersection(
            this.hosts.map(host => host.key),
            this.post.selected_hosts._ids
        );
        this.post.selected_services._ids = intersection(
            this.services.map(service => service.key),
            this.post.selected_services._ids
        );
    }

    protected readonly String = String;
    protected readonly Number = Number;
}
