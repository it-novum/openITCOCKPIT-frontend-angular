import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    model,
    OnDestroy,
    output
} from '@angular/core';
import { OcTreeNode } from '../organizational-charts-editor.interface';
import { EFConnectableSide, FFlowModule } from '@foblex/flow';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LoadContainersRoot, OcConnection } from '../../organizationalcharts.interface';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { BrowsersService } from '../../../browsers/browsers.service';
import { Subscription } from 'rxjs';
import { StatuscountResponse } from '../../../browsers/browsers.interface';
import { BlockLoaderComponent } from '../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { CardTitleDirective, ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { ContainerTypesEnum } from '../../../changelogs/object-types.enum';
import { NgClass } from '@angular/common';
import { BadgeOutlineComponent } from '../../../../layouts/coreui/badge-outline/badge-outline.component';


@Component({
    selector: 'oitc-oc-node',
    imports: [
        FFlowModule,
        FaIconComponent,
        FormsModule,
        XsButtonDirective,
        TranslocoDirective,
        BlockLoaderComponent,
        RowComponent,
        CardTitleDirective,
        ColComponent,
        NgClass,
        BadgeOutlineComponent,
        TranslocoPipe,
        TooltipDirective
    ],
    templateUrl: './oc-node.component.html',
    styleUrl: './oc-node.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OcNodeComponent implements OnDestroy {

    public node = model<OcTreeNode | undefined>(undefined);
    public containers = input<LoadContainersRoot | undefined>(undefined);

    public containerType = input<ContainerTypesEnum>();

    public nodeObj: OcTreeNode | undefined = this.node();

    public connectionsInput = input<OcConnection[]>([]);
    public deleteConnection = output<number | string>();

    public editNode = output<number | string | undefined>();

    protected readonly EFConnectableSide = EFConnectableSide;
    protected readonly String = String;

    public containerName: string = '';
    public containerPath: string = '';

    public connections: OcConnection[] = [];
    public hasConnection: boolean = false;

    public isLoading: boolean = false;
    public statusCounts?: StatuscountResponse;

    private connectionIds: (string | number)[] = [];

    private readonly subscriptions: Subscription = new Subscription();

    private readonly TranslocoService = inject(TranslocoService);
    private readonly BrowsersService = inject(BrowsersService);
    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.containerName = this.TranslocoService.translate('Please select');

        effect(() => {
            this.connections = this.connectionsInput();

            this.nodeObj = this.node();

            if (this.nodeObj && this.nodeObj.node.container_id > 0) {
                // Find the tenant name based on the container_id
                const containers = this.containers();
                if (containers) {
                    // Combine all containers into a single array
                    const allContainers = Object.values(containers).flat();
                    const found = allContainers.find((c) => c.key === this.nodeObj?.node.container_id);
                    if (found) {
                        this.loadHostAndServiceStatus();
                        this.containerName = found.value;
                        this.containerPath = found.path;
                    } else {
                        this.containerName = this.TranslocoService.translate('Please select');
                        this.containerPath = '';
                    }
                }
            }

            // Check if the node has a connection
            this.hasConnection = false;
            this.connectionIds = [];
            const connections = this.connections.filter((c) => c.organizational_chart_output_node_id == this.node()?.node.id);
            this.hasConnection = connections.length > 0;
            if (connections) {
                connections.forEach((c) => {
                    this.connectionIds.push(c.id);
                })
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onDeleteConnection(): void {
        if (this.hasConnection && this.connectionIds.length > 0) {
            this.connectionIds.forEach((connectionId) => {
                this.deleteConnection.emit(connectionId);
            })
        }
    }

    private loadHostAndServiceStatus() {
        if (!this.nodeObj || !this.nodeObj.node || !this.nodeObj.node.container_id) {
            return;
        }

        this.isLoading = true;
        this.cdr.markForCheck();

        const containerId = this.nodeObj.node.container_id;
        const recursive = this.nodeObj.node.recursive;
        this.subscriptions.add(this.BrowsersService.getStatusCountsByContainer([containerId], recursive).subscribe(response => {
            this.statusCounts = response;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    protected readonly ContainerTypesEnum = ContainerTypesEnum;
}
