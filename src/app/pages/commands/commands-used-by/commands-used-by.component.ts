import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent,
    TableDirective
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { CommandsService } from '../commands.service';
import { CommandUsedByCommand, CommandUsedByObjects } from '../commands.interface';
import { NgForOf, NgIf } from '@angular/common';

import { NotUsedByObjectComponent } from '../../../layouts/coreui/not-used-by-object/not-used-by-object.component';

import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';


@Component({
    selector: 'oitc-commands-used-by',
    imports: [
    FaIconComponent,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    BackButtonDirective,
    NavComponent,
    XsButtonDirective,
    NgIf,
    CardBodyComponent,
    ContainerComponent,
    TableDirective,
    NgForOf,
    NotUsedByObjectComponent,
    NavItemComponent,
    FormLoaderComponent
],
    templateUrl: './commands-used-by.component.html',
    styleUrl: './commands-used-by.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandsUsedByComponent implements OnInit, OnDestroy {
    public command: CommandUsedByCommand | undefined;
    public total: number = 0;
    public objects: CommandUsedByObjects | undefined;

    private CommandsService = inject(CommandsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private subscriptions: Subscription = new Subscription();
    private commandId: number = 0;
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.commandId = Number(this.route.snapshot.paramMap.get('id'));
            this.load();
            this.cdr.markForCheck();
        });
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.CommandsService.usedBy(this.commandId)
            .subscribe((result) => {
                this.command = result.command;
                this.objects = result.objects;
                this.total = result.total;
                this.cdr.markForCheck();
            }));
    }

}
