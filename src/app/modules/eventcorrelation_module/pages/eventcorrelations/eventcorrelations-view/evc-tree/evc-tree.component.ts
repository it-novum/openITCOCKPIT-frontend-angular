import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    Output,
    ViewChild
} from '@angular/core';
import { EFConnectableSide, EFMarkerType, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import * as dagre from "@dagrejs/dagre"
import { IPoint, PointExtensions } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { EvcTreeDirection } from './evc-tree.enum';
import { EvcService, EvcTree } from '../../eventcorrelations.interface';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ButtonGroupComponent, ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { DowntimeIconComponent } from '../../../../../../pages/downtimes/downtime-icon/downtime-icon.component';
import { PermissionDirective } from '../../../../../../permissions/permission.directive';
import { PermissionsService } from '../../../../../../permissions/permissions.service';
import {
    AcknowledgementIconComponent
} from '../../../../../../pages/acknowledgements/acknowledgement-icon/acknowledgement-icon.component';
import { AcknowledgementTypes } from '../../../../../../pages/acknowledgements/acknowledgement-types.enum';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ConnectionOperator } from './evc-tree.interface'
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { EvcServicestatusToasterService } from './evc-servicestatus-toaster/evc-servicestatus-toaster.service';
import { EvcServicestatusToasterComponent } from './evc-servicestatus-toaster/evc-servicestatus-toaster.component';
import { FormsModule } from '@angular/forms';
//import { NgxResizeObserverModule } from 'ngx-resize-observer';

// Extend the interface of the dagre-Node to make TypeScript happy when we get the nodes back from getNodes()
interface EvcNode extends dagre.Node {
    evcNode: EvcGraphNode
}

interface EvcGraphNode {
    id: string
    parentId: string | null
    service?: EvcService
    operator?: EventcorrelationOperators | string | null,
    type: 'service' | 'operator'
}

interface INodeViewModel {
    id: string
    connectorId: string
    position: IPoint,
    evcNode: EvcGraphNode
}


const CONFIGURATION = {
    [EvcTreeDirection.LEFT_TO_RIGHT]: {
        outputSide: EFConnectableSide.RIGHT,
        inputSide: EFConnectableSide.LEFT,
        nodeSep: 10
    },
    [EvcTreeDirection.TOP_TO_BOTTOM]: {
        outputSide: EFConnectableSide.BOTTOM,
        inputSide: EFConnectableSide.TOP,
        nodeSep: 30
    },
    [EvcTreeDirection.RIGHT_TO_LEFT]: {
        outputSide: EFConnectableSide.LEFT,
        inputSide: EFConnectableSide.RIGHT,
        nodeSep: 10
    },
    [EvcTreeDirection.BOTTOM_TO_TOP]: {
        outputSide: EFConnectableSide.TOP,
        inputSide: EFConnectableSide.BOTTOM,
        nodeSep: 30
    }
};

const SERVICE_WIDTH = 150;
const OPERATOR_WIDTH = 100;

/******************************
 * ⚠️ If you make changes to this file, make sure to update the EvcTreeEditComponent in the eventcorrelations-edit-correlation folder as well
 ******************************/
@Component({
    selector: 'oitc-evc-tree',
    imports: [
        FFlowModule,
        // NgxResizeObserverModule,
        NgClass,
        RowComponent,
        ColComponent,
        NgIf,
        TooltipDirective,
        FaIconComponent,
        DowntimeIconComponent,
        PermissionDirective,
        AsyncPipe,
        AcknowledgementIconComponent,
        TranslocoPipe,
        RouterLink,
        XsButtonDirective,
        ButtonGroupComponent,
        EvcServicestatusToasterComponent,
        FormsModule,
    ],
    templateUrl: './evc-tree.component.html',
    styleUrl: './evc-tree.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTreeComponent {

    @Output() resetEvent = new EventEmitter<EvcTreeDirection>();
    public evcId = input<number>(0);
    public evcTree = input<EvcTree[]>([]);
    public downtimedServices = input<number>(0);
    public stateForDowntimedService = input<number>(3);
    public stateForDisabledService = input<number>(3);
    public connectionLine = input<string>('bezier');
    public animated = input<number>(0);
    public evcDirection = input<EvcTreeDirection>(EvcTreeDirection.RIGHT_TO_LEFT);
    public isWidget = input<boolean>(false);

    public downtimeStateTitle: string = '';
    public disabledStateTitle: string = '';

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly EvcServicestatusToasterService = inject(EvcServicestatusToasterService);

    public nodes: INodeViewModel[] = [];
    public connections: ConnectionOperator[] = [];
    public direction: EvcTreeDirection = EvcTreeDirection.RIGHT_TO_LEFT;
    public configuration = CONFIGURATION[this.direction];

    @ViewChild(FFlowComponent, {static: true})
    public fFlowComponent!: FFlowComponent;
    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;
    public isAutoLayout: boolean = false;


    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    private toasterTimeout: any = null;

    constructor() {
        this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
            this.direction = this.evcDirection();
            this.configuration = CONFIGURATION[this.direction];
            if (this.isInitialized) {
                this.direction = this.evcDirection();
                this.updateGraph(new dagre.graphlib.Graph(), this.direction);
            }

            switch (this.stateForDowntimedService()) {
                case 0:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered ok');
                    break;

                case 1:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered warning');
                    break;

                case 2:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered critical');
                    break;

                case 3:
                    this.downtimeStateTitle = this.TranslocoService.translate('In Downtime, considered unknown');
                    break;
            }

            switch (this.stateForDisabledService()) {
                case 0:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered ok');
                    break;

                case 1:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered warning');
                    break;

                case 2:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered critical');
                    break;

                case 3:
                    this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');
                    break;
            }
        });

        afterRenderEffect(() => {
            // DOM rendering completed for this component
            this.isInitialized = true;
            this.updateGraph(new dagre.graphlib.Graph(), this.direction);
            this.cdr.markForCheck();
        });
    }


    public onLoaded(): void {
        this.fitToScreen();
    }


    private updateGraph(graph: dagre.graphlib.Graph, direction: EvcTreeDirection): void {
        if (this.isAutoLayout) {
            if (this.fFlowComponent) {
                this.fFlowComponent.reset();
                // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
            }
        }
        this.setGraph(graph, direction);
        this.nodes = this.getNodes(graph);
        this.connections = this.getConnections(graph);
        this.cdr.markForCheck();
    }

    private setGraph(graph: dagre.graphlib.Graph, direction: EvcTreeDirection): void {
        this.configuration = CONFIGURATION[direction];

        const evcTree = this.evcTree();
        const nodes = this.getEvcTreeNodes(evcTree);

        // https://github.com/dagrejs/dagre/wiki#configuring-the-layout
        graph.setGraph({
            rankdir: direction,

            // nodesep is the vertical distance between the nodes
            // +--------------+
            // |    Node 1    |
            // +--------------+
            // ↑
            // | <- nodesep
            // ↓
            // +--------------+
            // |    Node 2    |
            // +--------------+
            //nodesep: 10, // vertical distance between nodes
            nodesep: this.configuration.nodeSep, // vertical distance between nodes - dynamic based on direction

            // ranksep is the distance between the different layers of the graph
            // --------------------------
            // ↑                        |
            // +--------------+         ↓  <- ranksep
            // |    Layer 1   |         +--------------+
            // +--------------+         |    Layer 2   |
            //                          +--------------+
            //
            ranksep: 50,
            edgesep: 10, // not entirely sure
            marginx: 0,
            marginy: 0,
        });


        nodes.forEach(node => {
            // Add service meta data into dagre.Node (EvcNode)
            graph.setNode(node.id, {
                width: (node.type === 'service') ? SERVICE_WIDTH : OPERATOR_WIDTH,
                height: 38,
                evcNode: node,
            });

            if (node.parentId != null) {
                graph.setEdge(node.parentId, node.id, {});
            }
        });


        dagre.layout(graph);
    }

    private getNodes(graph: dagre.graphlib.Graph): INodeViewModel[] {
        return graph.nodes().map((x: any) => {
            let node = graph.node(x);
            // x = node.id (15, 15_operator, 16, 16_operator etc)

            // Cast the dagre.Node to EvcNode
            const evcNode = node as EvcNode;

            let xpos = evcNode.x;
            if (evcNode.evcNode.type === 'operator') {
                // This centers the operator node between the service nodes
                xpos = xpos + (SERVICE_WIDTH - OPERATOR_WIDTH) / 2;
            }

            return {
                id: generateGuid(),
                connectorId: x,
                position: {
                    x: xpos,//evcNode.x,
                    y: evcNode.y
                },
                evcNode: evcNode.evcNode
            }
        });
    }


    private getEvcTreeNodes(evcTree: EvcTree[]): EvcGraphNode[] {
        const nodes: EvcGraphNode[] = [];

        // This method create an array for the EVC Tree (Flow Chart)
        // We reverse the array from the server, so we can connect the services to the operators more easily
        evcTree = evcTree.reverse();

        evcTree.forEach((layer: EvcTree, layerIndex: number) => {
            // EVC Layer in reverse order
            for (const vServiceKey in layer) {
                const vServices = layer[vServiceKey];
                vServices.forEach((vService, vServiceIndex: number) => {
                    nodes.push({
                        id: vService.id.toString(),
                        //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                        parentId: vService.parent_id === null ? null : `${vService.parent_id}_operator`,
                        service: vService.service,
                        type: 'service'
                    });

                    if (vService.operator !== null) {
                        nodes.push({
                            id: `${vService.id}_operator`,
                            parentId: vService.id.toString(),
                            operator: vService.operator,
                            type: 'operator'
                        });
                    }

                });
            }
        });

        return nodes;
    }


    private getConnections(graph: dagre.graphlib.Graph): ConnectionOperator[] {
        return graph.edges().map((x: dagre.Edge) => {
            return {
                id: generateGuid(),
                from: x.v,
                to: x.w
            }
        });
    }

    public horizontalLR(): void {
        this.direction = EvcTreeDirection.LEFT_TO_RIGHT;
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.LEFT_TO_RIGHT);
        this.fitToScreen();
    }

    public horizontalRL(): void {
        this.direction = EvcTreeDirection.RIGHT_TO_LEFT;
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.RIGHT_TO_LEFT);
        this.fitToScreen();
    }

    public verticalTB(): void {
        this.direction = EvcTreeDirection.TOP_TO_BOTTOM;
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.TOP_TO_BOTTOM);
        this.fitToScreen();
    }

    public verticalBT(): void {
        this.direction = EvcTreeDirection.BOTTOM_TO_TOP;
        this.updateGraph(new dagre.graphlib.Graph(), EvcTreeDirection.BOTTOM_TO_TOP);
        this.fitToScreen();
    }

    public fitToScreen(): void {
        // Disabled for now, as it adds a scale factor to the canvas and "zooms in" on init.
        return;

        // https://flow.foblex.com/docs/f-canvas-component
        /* if (this.fCanvasComponent) {
             this.fCanvasComponent.resetScaleAndCenter(true);
             //this.fCanvasComponent.setPosition(PointExtensions.initialize(0, 0));
              this.fCanvasComponent.fitToScreen(PointExtensions.initialize(0, 0), false);
             this.cdr.markForCheck();
         }*/
    }

    public fit2screen(): void {
        if (this.fCanvasComponent) {
            this.fCanvasComponent.fitToScreen(PointExtensions.initialize(0, 0), true);
            this.cdr.markForCheck();
        }
    }

    public toggleToaster(serviceId: number | undefined): void {
        this.cancelToaster();
        if (serviceId) {
            this.toasterTimeout = setTimeout(() => {
                this.EvcServicestatusToasterService.setServiceIdToaster(serviceId);
            }, 500);
        }
    }

    public cancelToaster() {
        if (this.toasterTimeout) {
            clearTimeout(this.toasterTimeout);
        }

        this.toasterTimeout = null;
    }

    public reset() {
        this.resetEvent.emit(this.direction);
    }

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly Number = Number;
    protected readonly AcknowledgementTypes = AcknowledgementTypes;
    protected readonly EvcTreeDirection = EvcTreeDirection;
    protected readonly EFMarkerType = EFMarkerType;

}
