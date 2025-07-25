import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    OnDestroy,
    output,
    ViewChild
} from '@angular/core';
import {
    EvcDeleteNode,
    EvcService,
    EvcToggleModal,
    EvcTree,
    EvcTreeItem,
    EvcVServiceModalMode
} from '../../eventcorrelations.interface';
import { ConnectionOperator, EvcTreeValidationErrors } from '../../eventcorrelations-view/evc-tree/evc-tree.interface';
import { EFConnectableSide, FCanvasComponent, FFlowComponent, FFlowModule } from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { IPoint, PointExtensions } from '@foblex/2d';
import { NgClass, NgIf } from '@angular/common';
import { ButtonGroupComponent, ColComponent, RowComponent, TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';


import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../../../permissions/permissions.service';
import { EventcorrelationOperators } from '../../eventcorrelations.enum';
import { ServiceTypesEnum } from '../../../../../../pages/services/services.enum';
import { ISize } from '@foblex/2d/size/i-size';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../../eventcorrelations.service';

interface LayerDetails {
    [key: string]: {
        count: number
        startY: null | number
        endY: null | number
    }
}

// Holds an array of all Y positions for each layer
interface CollisionCheck {
    [key: number]: number[]
}

interface EvcGraphNode {
    id: string
    parentId: string | null
    service?: EvcService
    operator?: EventcorrelationOperators | string | null,
    type: 'service' | 'operator',
    totalHeight?: number, // only for operators
    fNodeParentId?: string,
    position: IPoint,
    layerIndex: number,
    usedBy?: string[]
    evcTreeItem?: EvcTreeItem // Holds the EvcTreeItem for the service for edit
}

interface EvcGraphGroup {
    id: string
    layerIndex: number
    fGroupSize: ISize
    fGroupPosition: IPoint
}

interface INodeViewModel {
    id: string
    connectorId: string
    position: IPoint,
    evcNode: EvcGraphNode
    highlight?: boolean
}

const SERVICE_WIDTH = 150;
const SERVICE_HEIGHT = 40; // actually 38, but 2px border

// NODE_SEP is the vertical distance between the nodes
// +--------------+
// |    Node 1    |
// +--------------+
// ↑
// | <- nodesep
// ↓
// +--------------+
// |    Node 2    |
// +--------------+
const NODE_SEP = 7; // vertical distance between nodes


// RANK_SEP is the distance between the different layers of the graph
// --------------------------
// ↑                        |
// +--------------+         ↓  <- RANK_SEP
// |    Layer 1   |         +--------------+
// +--------------+         |    Layer 2   |
//                          +--------------+
//
const RANK_SEP = 50;

const OPERATOR_WIDTH = 100;
const OPERATOR_HEIGHT = 38;

const GROUP_WIDTH = SERVICE_WIDTH + 20; // 20 px padding
const GROUP_HEIGHT = 50;

/******************************
 * ⚠️ If you make changes to this file, make sure to update the EvcTreeComponent in the eventcorrelations-view folder as well
 ******************************/
@Component({
    selector: 'oitc-evc-tree-edit',
    imports: [
        FFlowModule,
        NgClass,
        RowComponent,
        ColComponent,
        NgIf,
        TooltipDirective,
        FaIconComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        ButtonGroupComponent
    ],
    templateUrl: './evc-tree-edit.component.html',
    styleUrl: './evc-tree-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvcTreeEditComponent implements OnDestroy {
    public evcId = input<number>(0);
    public evcTree = input<EvcTree[]>([]);
    public stateForDisabledService = input<number>(3);
    public animated = input<number>(0); // not animated
    public connectionLine = input<string>('bezier'); // bezier, straight, segment

    public layerWithErrorsInput = input<EvcTreeValidationErrors>({});
    public evcNodeWithErrorsInput = input<EvcTreeValidationErrors>({});

    public highlightHostId = input<number>(0);
    public highlightServiceId = input<number>(0);

    // !! For template usage only
    public layerWithErrors: EvcTreeValidationErrors = {};
    public evcNodeWithErrors: EvcTreeValidationErrors = {};

    public toggleVServiceModal = output<EvcToggleModal>();
    public toggleDeleteEvcNode = output<EvcDeleteNode>();

    public disabledStateTitle: string = '';

    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly EventcorrelationsService = inject(EventcorrelationsService);

    public nodes: INodeViewModel[] = [];
    public groups: EvcGraphGroup[] = [];
    public connections: ConnectionOperator[] = [];

    @ViewChild(FFlowComponent, {static: true})
    public fFlowComponent!: FFlowComponent;
    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    public isAutoLayout: boolean = false;

    private cdr = inject(ChangeDetectorRef);

    private isInitialized = false;

    private subscriptions: Subscription = new Subscription();

    constructor() {
        this.disabledStateTitle = this.TranslocoService.translate('Disabled, considered unknown');

        effect(() => {
            if (this.isInitialized) {
                this.updateGraph();
            }

            // We move all errors into a class variable so we can use it in the template more easily
            // using signals is a bit cumbersome
            this.layerWithErrors = this.layerWithErrorsInput();
            this.evcNodeWithErrors = this.evcNodeWithErrorsInput();

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
            this.updateGraph();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onLoaded(): void {
        this.fitToScreen();
    }


    private updateGraph(): void {
        if (this.isAutoLayout) {
            if (this.fFlowComponent) {
                this.fFlowComponent.reset();
                // if auto layout is disabled, onLoaded will be called only after the first rendering of the flow
            }
        }

        this.nodes = [];
        this.groups = [];
        this.connections = [];

        this.cdr.markForCheck();

        const nodes = this.getEvcTreeNodes(this.evcTree());
        this.nodes = this.getNodes(nodes);

        this.cdr.markForCheck();
    }

    private getNodes(nodes: EvcGraphNode[]): INodeViewModel[] {
        const result: INodeViewModel[] = [];

        nodes.forEach((node: EvcGraphNode) => {
            let highlight = false;

            if (node.type === 'service') {
                if (node.service?.host.id == this.highlightHostId() || node.service?.id == this.highlightServiceId()) {
                    highlight = true;
                }
            }


            result.push({
                id: generateGuid(),
                connectorId: node.id,
                position: node.position,
                evcNode: node,
                highlight: highlight
            });
        });

        return result;
    }

    private getEvcTreeNodes(evcTree: EvcTree[]) {
        const nodes: EvcGraphNode[] = [];
        //evcTree = getTestTreeForCollisionDevelopment();

        this.nodes = [];
        this.groups = [];
        this.connections = [];

        let Y = GROUP_HEIGHT + 15; // Start at top of the canvas
        let X = 15; // Start at left of the canvas (15 as padding)

        const totalLayersCount: LayerDetails = {};
        const collisionCheck: CollisionCheck = {};

        if (evcTree.length === 0) {
            // Empty EVC - probably a new one
            // Add the first layer group hardcoded so the user can add new services to the EVC
            this.groups.push({
                id: generateGuid(), // uuid to trigger the change detection of ngfor track by group.id
                layerIndex: 0,
                fGroupSize: {
                    width: GROUP_WIDTH,
                    height: GROUP_HEIGHT,
                },
                fGroupPosition: {
                    x: X,
                    y: 0
                }
            });

            // Return empty nodes
            return [];
        }

        let firstLayerServicesCount = 0;
        evcTree.forEach((evcLayer: EvcTree, layerIndex: number) => {
            collisionCheck[layerIndex] = [];

            for (const vServiceId in evcLayer) {
                if (!totalLayersCount.hasOwnProperty(vServiceId)) {
                    totalLayersCount[vServiceId] = {
                        count: evcLayer[vServiceId].length,
                        startY: null,
                        endY: null
                    };
                }

                evcLayer[vServiceId].forEach((evcTreeItem: EvcTreeItem, serviceIndex: number) => {
                    if (layerIndex === 0) {
                        // First layer services can be placed top to bottom
                        // Also the first layer only contain "real" services and no operators
                        nodes.push({
                            id: evcTreeItem.id.toString(),
                            //parentId: vService.parent_id === null ? null : vService.parent_id.toString(),
                            parentId: evcTreeItem.parent_id === null ? null : `${evcTreeItem.parent_id}_operator`,
                            service: evcTreeItem.service,
                            layerIndex: layerIndex,
                            type: 'service',
                            position: {
                                x: X, // First layer services are always on the left side of the canvas
                                y: Y
                            },
                            evcTreeItem: evcTreeItem
                        });

                        // If we are the first service in this "group of services", we save the Y position
                        // so we can calculate the operator position later
                        if (totalLayersCount[vServiceId].startY === null) {
                            totalLayersCount[vServiceId].startY = Y;
                        }

                        // Calculate the Y position for the next first layer service
                        Y = Y + (SERVICE_HEIGHT + NODE_SEP);

                        totalLayersCount[vServiceId].endY = Y;
                        if (totalLayersCount[vServiceId].count % 2 !== 0) {
                            // If we have an odd number of services, we need to remove one NODE_SEP
                            // Otherwise we would have a wrong value for centering the operator
                            totalLayersCount[vServiceId].endY = totalLayersCount[vServiceId].endY - NODE_SEP;
                        }

                        // Keep track of the total number of services in the first layer
                        // to calculate the total height of the group for errors;
                        firstLayerServicesCount++;
                    }

                    if (layerIndex > 0) {
                        // Our Y position is the middle of the total height of all services in the previous layer
                        // ┌----- offsetY
                        // ↓
                        // +--------------+                       ←---------------------┐
                        // |    Node 1    |----------+                                  |
                        // +--------------+          |    +--------------+              |
                        //                           +--- |      AND     |          totalHeight
                        // +--------------+          |    +--------------+              |
                        // |    Node 2    |----------+                                  |
                        // +--------------+                       ←---------------------┘

                        const offsetY = Number(totalLayersCount[evcTreeItem.id.toString()].startY);
                        // Total height if all previous services
                        const totalHeight = Number(totalLayersCount[evcTreeItem.id.toString()].endY) - Number(totalLayersCount[evcTreeItem.id.toString()].startY);

                        let vServiceY = (totalHeight / 2) - (SERVICE_HEIGHT / 2) + offsetY;
                        let operatorY = (totalHeight / 2) - (OPERATOR_HEIGHT / 2) + offsetY - ((SERVICE_HEIGHT - OPERATOR_HEIGHT) / 2);
                        //                        ↑ Center the operator vertically in the total height of all services in the previous layer
                        //                                                                                    ↑ Center the operator vertically to the vService
                        //                                                                                      because vService is 2px higher than the operator


                        // Calculate the position of the next vService, then go back one step to place the operator
                        const vServiceX = layerIndex * (SERVICE_WIDTH + RANK_SEP + OPERATOR_WIDTH + RANK_SEP);
                        const operatorX = vServiceX - RANK_SEP - OPERATOR_WIDTH;

                        // Check for collision/overlapping of operators
                        if (collisionCheck[layerIndex].length > 0) {
                            // The current layer has already some operators / vServices
                            // Check the Y position does not overlap with the previous Y positions

                            let hasCollision = false;
                            do {
                                hasCollision = false;
                                collisionCheck[layerIndex].forEach((usedYStart: number) => {
                                    const usedYEnd = usedYStart + SERVICE_HEIGHT + NODE_SEP;
                                    if ((
                                        vServiceY >= usedYStart
                                        && vServiceY <= usedYEnd
                                    ) || (
                                        (vServiceY + SERVICE_HEIGHT + 3) >= usedYStart &&
                                        (vServiceY + SERVICE_HEIGHT + 3) <= usedYEnd
                                    )
                                    ) {
                                        hasCollision = true;
                                    }
                                });

                                vServiceY++;
                                operatorY++;
                            } while (hasCollision);
                        }

                        // Store Y position for collision check
                        collisionCheck[layerIndex].push(vServiceY);

                        // Add the operator
                        if (evcTreeItem.operator !== null) {
                            nodes.push({
                                id: `${evcTreeItem.id}_operator`,
                                parentId: evcTreeItem.id.toString(),
                                operator: evcTreeItem.operator,
                                type: 'operator',
                                layerIndex: layerIndex,
                                totalHeight: totalHeight,
                                position: {
                                    x: X + operatorX,
                                    y: operatorY
                                }
                            });
                        }

                        // Add the vService
                        nodes.push({
                            id: evcTreeItem.id.toString(),
                            parentId: evcTreeItem.parent_id === null ? null : `${evcTreeItem.parent_id}_operator`,
                            service: evcTreeItem.service,
                            usedBy: evcTreeItem.usedBy,
                            layerIndex: layerIndex,
                            type: 'service',
                            position: {
                                x: X + vServiceX,
                                y: vServiceY
                            },
                            evcTreeItem: evcTreeItem
                        });

                        // Save the Y position for the next layer of operators / vServices
                        if (evcTreeItem.parent_id !== null) {
                            if (totalLayersCount[evcTreeItem.parent_id.toString()].startY === null) {
                                totalLayersCount[evcTreeItem.parent_id.toString()].startY = vServiceY;
                            }
                        }

                        if (evcTreeItem.parent_id !== null) {
                            // We do not need to add a NODE_SEP because vServices are always only one service (odd)
                            // vService = multiple releas services from layer 0 get combined to one vService
                            totalLayersCount[evcTreeItem.parent_id.toString()].endY = vServiceY + SERVICE_HEIGHT;
                        }

                    }
                });
            }

        });

        // Push connection between nodes
        nodes.forEach((node: EvcGraphNode) => {
            if (node.parentId !== null) {
                this.connections.push({
                    id: generateGuid(),
                    from: node.parentId.toString(),
                    to: node.id.toString()
                });
            }
        });

        // Add groups per layer
        let heightOfAllGroups = GROUP_HEIGHT;
        if (Object.keys(this.layerWithErrorsInput()).length > 0) {
            // At least one layer has errors
            heightOfAllGroups += (firstLayerServicesCount * (SERVICE_HEIGHT + NODE_SEP)) + RANK_SEP; // RANK_SEP is used as padding bottom
        }

        evcTree.forEach((evcLayer: EvcTree, layerIndex: number) => {
            this.groups.push({
                id: generateGuid(), // uuid to trigger the change detection of ngfor track by group.id
                layerIndex: layerIndex,
                fGroupSize: {
                    width: GROUP_WIDTH,
                    height: heightOfAllGroups,
                },
                fGroupPosition: {
                    x: X + layerIndex * (SERVICE_WIDTH + RANK_SEP + OPERATOR_WIDTH + RANK_SEP) - ((GROUP_WIDTH - SERVICE_WIDTH) / 2),
                    y: 0
                }
            });
        });

        return nodes;
    }

    public fitToScreen(): void {
        // Disabled for now, as it adds a scale factor to the canvas and "zooms in" on init.
        //return;

        // https://flow.foblex.com/docs/f-canvas-component
        if (this.fCanvasComponent) {
            this.fCanvasComponent.resetScaleAndCenter(false);
            this.fCanvasComponent.setPosition(PointExtensions.initialize(0, 0));

            //this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 50), false);
        }
    }

    public toggleVServiceModalFunc(layerIndex: number, mode: EvcVServiceModalMode, eventCorrelation?: EvcTreeItem) {
        this.toggleVServiceModal.emit({
            layerIndex: layerIndex,
            mode: mode,
            eventCorrelation: eventCorrelation
        });
    }

    public toggleDeleteEvcNodeFunc(layerIndex: number, node: EvcGraphNode) {
        this.toggleDeleteEvcNode.emit({
            layerIndex: layerIndex,
            evcNodeId: node.id
        });
    }

    protected readonly ServiceTypesEnum = ServiceTypesEnum;
    protected readonly Number = Number;
    protected readonly EFConnectableSide = EFConnectableSide;

}
