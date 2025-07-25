import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    HostListener,
    inject,
    input,
    model,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { NodesPaletteComponent } from './nodes-palette/nodes-palette.component';
import {
    EFConnectableSide,
    EFConnectionBehavior,
    EFConnectionType,
    EFMarkerType,
    FCanvasComponent,
    FCreateConnectionEvent,
    FCreateNodeEvent,
    FFlowComponent,
    FFlowModule,
    FReassignConnectionEvent,
    FZoomDirective
} from '@foblex/flow';
import { IPoint, Point } from '@foblex/2d';
import { LoadContainersRoot, OcConnection, OrganizationalChartsTreeNode } from '../organizationalcharts.interface';
import { UUID } from '../../../classes/UUID';
import { OcNodeComponent } from './oc-node/oc-node.component';
import { OcTreeNode } from './organizational-charts-editor.interface';
import { NgClass } from '@angular/common';
import { GenericValidationError } from '../../../generic-responses';
import {
    ButtonCloseDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { SelectKeyValuePathWithDisabled, SelectKeyValueWithDisabled } from '../../../layouts/primeng/select.interface';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { OrganizationalChartNodesService } from '../organizationalchartnodes.service';
import { OrganizationalchartUserRoles } from '../organizationalcharts.enum';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';

@Component({
    selector: 'oitc-organizational-charts-editor',
    imports: [
        NodesPaletteComponent,
        FFlowComponent,
        FFlowModule,
        OcNodeComponent,
        NgClass,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ModalToggleDirective,
        ButtonCloseDirective,
        XsButtonDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        FormsModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        MultiSelectComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective
    ],
    templateUrl: './organizational-charts-editor.component.html',
    styleUrl: './organizational-charts-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalChartsEditorComponent implements OnInit, OnDestroy {

    // Two-way binding for the organizational charts tree from the add or edit component
    public nodeTree = model<OrganizationalChartsTreeNode[]>([]);

    // Two-way binding for the organizational chart connections from add or edit component
    public connections = model<OcConnection[]>([]);

    public nodeValidationErrorsInput = input<{ [key: number]: GenericValidationError }>({});
    public nodeValidationErrors: { [key: number]: GenericValidationError } = {};

    public nodes: OcTreeNode[] = [];

    @ViewChild(FFlowComponent, {static: false})
    public fFlowComponent!: FFlowComponent;

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

    @HostListener('window:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }


        switch (event.key) {
            case 'Backspace':
            case 'Delete':

                const selection = this.fFlowComponent.getSelection();
                //console.log(selection);

                // Are there any connections selected? If so, remove them
                selection.fConnectionIds.forEach((connectionId) => {
                    this.onRemoveConnection(connectionId);
                });

                // Are any nodes selected? If so, remove them
                selection.fNodeIds.forEach((nodeId) => {
                    this.onNodeRemoved(nodeId);
                });

                break;
        }
    }

    protected readonly eMarkerType = EFMarkerType;

    @ViewChild('ocNodeEditModal', {static: false}) ocNodeEditModal: ModalComponent | undefined;
    private readonly modalService = inject(ModalService);

    public currentNodeForModal: OcTreeNode | undefined;

    public errors: GenericValidationError | null = null;
    // A list of all tenants, locations and nodes to be used in the modal
    public modalContainer?: LoadContainersRoot;
    public modalTenants: SelectKeyValuePathWithDisabled[] = [];
    public modalLocations: SelectKeyValuePathWithDisabled[] = [];
    public modalNodes: SelectKeyValuePathWithDisabled[] = [];

    public modalRegionManagers: SelectKeyValueWithDisabled[] = [];
    public modalManagers: SelectKeyValueWithDisabled[] = [];
    public modalUsers: SelectKeyValueWithDisabled[] = [];

    public selectedRegionManagers: number[] = [];
    public selectedManagers: number[] = [];
    public selectedUsers: number[] = [];

    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    private readonly OrganizationalChartNodesService: OrganizationalChartNodesService = inject(OrganizationalChartNodesService);
    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef
    ) {


        effect(() => {
            this.nodeValidationErrors = this.nodeValidationErrorsInput();
        });
    }

    public ngOnInit(): void {

        // In edit - copy existing nodes into f-flow
        this.nodeTree().forEach((node) => {
            this.nodes.push({
                fNodeId: String(node.id),
                position: {
                    x: node.x_position,
                    y: node.y_position
                },
                node: node
            });
        });


        this.subscriptions.add(this.OrganizationalChartsService.loadContainers().subscribe((response) => {
            this.modalContainer = response;
            this.modalTenants = response.tenants;
            this.modalLocations = response.locations;
            this.modalNodes = response.nodes;

            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onInitialized(): void {
        //this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 200), false);
        //this.fCanvasComponent.resetScaleAndCenter(false);
        this.fCanvasComponent.fitToScreen(new Point(0, 0), false);
    }


    public onNodeAdded(event: FCreateNodeEvent): void {

        const x = Math.floor(event.rect.x);
        const y = Math.floor(event.rect.y);
        const containerTypeId = event.data as ContainerTypesEnum;

        // Create a new node for the database / two-way binding
        const uuid = new UUID();
        const newNodeUuid: string = uuid.v4();

        const newNode: OrganizationalChartsTreeNode = {
            id: newNodeUuid,
            uuid: newNodeUuid,
            container_id: 0,
            containertype_id: containerTypeId,
            recursive: false,
            users: [],
            //organizational_chart_id: 0,
            x_position: x,
            y_position: y
        };

        // Add new node to the f-flow canvas
        this.nodes.push({
            fNodeId: newNodeUuid,
            fNodeParentId: undefined,
            position: {
                x: x,
                y: y
            },
            node: newNode
        });

        // Update two-way binding
        this.addNodeToTree(newNode);
    }

    public onNodeRemoved(nodeId: string): void {
        // Find the node to remove
        const node = this.nodes.find((n) => String(n.node.id) === nodeId);

        // Remove the node from the two-way binding
        if (node?.node) {
            this.removeNodeInTree(node.node);
        }
    }

    public onConnectionAdded(event: FCreateConnectionEvent): void {
        if (!event.fInputId) {
            return;
        }

        // So we can track connections in @for loop
        const uuid = new UUID();
        const connectionUuid = uuid.v4();

        const newConnection: OcConnection = {
            id: connectionUuid, // uuidv4 for new connections - number id for existing connections
            uuid: connectionUuid,
            organizational_chart_input_node_id: event.fInputId,
            organizational_chart_output_node_id: event.fOutputId
        };

        // Update the two-way binding
        this.connections.update((connections) => {
            return [...connections, newConnection];
        });

        this.cdr.markForCheck();
    }

    public onReassignConnection(event: FReassignConnectionEvent): void {
        if (!event.newFInputId) {
            // newFInputId undefined means that the connection has been reassigned to the same input/node
            // nothing to do in this case
            return;
        }

        // Delete old connection from f-flow canvas and add new one
        const connections = this.connections().filter((c) => c.id != event.fConnectionId);

        // So we can track connections in @for loop
        const uuid = new UUID();
        const connectionUuid = uuid.v4();
        const newConnection: OcConnection = {
            id: connectionUuid,
            uuid: connectionUuid,
            organizational_chart_input_node_id: event.newFInputId,
            organizational_chart_output_node_id: event.fOutputId
        };


        // Update the two-way binding
        this.connections.update((oldConnections) => {
            return [...connections, newConnection];
        });
    }

    public onRemoveConnection(connectionId: string | number) {
        let connections = this.connections();

        const connection = connections.find((c) => c.id == connectionId);
        if (!connection) {
            console.log('Connection not found:', connectionId);
            return;
        }

        // Remove the connection from the f-flow canvas
        connections = connections.filter((c) => c.id != connectionId);

        // Update the two-way binding
        this.connections.update((oldConnections) => {
            return connections;
        });

        this.cdr.markForCheck();
    }

    public onNodePositionChanged(point: IPoint, node: OcTreeNode): void {
        node.position = point;

        const x = Math.floor(node.position.x);
        const y = Math.floor(node.position.y);

        node.node.x_position = x;
        node.node.y_position = y;

        this.updateNodeInTree(node.node);
    }

    private addNodeToTree(node: OrganizationalChartsTreeNode): void {
        this.nodeTree.update((nodes) => {
            return [...nodes, node];
        });

        this.cdr.markForCheck();
    }

    private updateNodeInTree(node: OrganizationalChartsTreeNode): void {
        this.nodeTree.update((nodes) => {
            return nodes.map((n) => n.id == node.id ? node : n);
        });

        this.cdr.markForCheck();
    }

    private removeNodeInTree(node: OrganizationalChartsTreeNode): void {
        // Remove any connections that reference this node
        this.connections().forEach((c) => {
            // Remove connections above (the node is the child of the connection)
            if (c.organizational_chart_input_node_id == node.id) {
                this.onRemoveConnection(c.id);
            }

            // Remove connections below (the node is the parent of the connection)
            // in this case we need to set the parent_id of the child node to null
            // the onRemoveConnection method will handle this
            if (c.organizational_chart_output_node_id == node.id) {
                this.onRemoveConnection(c.id);
            }
        });

        // Remove the node from the f-flow canvas
        this.nodes = this.nodes.filter((n) => n.node.id != node.id);

        // Remove the node from the two-way binding
        this.nodeTree.update((nodes) => {
            return nodes.filter((n) => n.id != node.id);
        });

        this.cdr.markForCheck();
    }

    /**
     * Gets called when the user clicks on the edit button of a node in the f-flow canvas.
     * Will open the modal to edit the node.
     * @param nodeId - The ID of the node to edit
     */
    public onEditNode(nodeId: string | number | undefined): void {
        if (!nodeId) {
            return;
        }

        if (!this.ocNodeEditModal) {
            return;
        }

        this.currentNodeForModal = this.nodes.find((n) => n.node.id == nodeId);
        this.modalService.toggle({
            show: true,
            id: this.ocNodeEditModal.id
        });

        // Reset selected users
        this.modalRegionManagers = [];
        this.modalManagers = [];
        this.modalUsers = [];
        this.selectedRegionManagers = [];
        this.selectedManagers = [];
        this.selectedUsers = [];
        this.disableUsedUsersModal();

        if (this.currentNodeForModal?.node.container_id) {
            this.loadUsersForModal(this.currentNodeForModal.node.container_id);
        }

        // Disable containers/tenants that are already used by other organizational chart nodes
        const usedContainerIds = this.nodeTree().map(n => n.container_id);

        this.modalTenants.forEach((tenant) => {
            tenant.disabled = usedContainerIds.includes(tenant.key);

            // Do not disable our own/current tenant
            if (tenant.key === this.currentNodeForModal?.node.container_id) {
                tenant.disabled = false;
            }
        });

        this.modalLocations.forEach((location) => {
            location.disabled = usedContainerIds.includes(location.key);

            // Do not disable our own/current location
            if (location.key === this.currentNodeForModal?.node.container_id) {
                location.disabled = false;
            }
        });

        this.modalNodes.forEach((node) => {
            node.disabled = usedContainerIds.includes(node.key);

            // Do not disable our own/current node
            if (node.key === this.currentNodeForModal?.node.container_id) {
                node.disabled = false;
            }
        });

        this.cdr.markForCheck();
    }

    public onUpdateNodeModal() {
        if (!this.currentNodeForModal) {
            return;
        }

        // Drop old users
        if (this.currentNodeForModal?.node) {
            this.currentNodeForModal.node.users = [];
        }

        this.selectedRegionManagers.forEach((userId) => {
            if (this.currentNodeForModal?.node) {
                this.currentNodeForModal.node.users.push({
                    id: userId,
                    _joinData: {
                        user_id: userId,
                        user_role: OrganizationalchartUserRoles.REGION_MANAGER
                    }
                });
            }
        });

        this.selectedManagers.forEach((userId) => {
            if (this.currentNodeForModal?.node) {
                this.currentNodeForModal.node.users.push({
                    id: userId,
                    _joinData: {
                        user_id: userId,
                        user_role: OrganizationalchartUserRoles.MANAGER
                    }
                });
            }
        });

        this.selectedUsers.forEach((userId) => {
            if (this.currentNodeForModal?.node) {
                this.currentNodeForModal.node.users.push({
                    id: userId,
                    _joinData: {
                        user_id: userId,
                        user_role: OrganizationalchartUserRoles.USER
                    }
                });
            }
        });

        // Update two-way binding
        this.updateNodeInTree(this.currentNodeForModal.node);

        // Update the node in the f-flow canvas
        const currentNode = this.currentNodeForModal; // this is only required to make TypeScript happy - otherwise it will complain that currentNode is possibly undefined
        this.nodes = this.nodes.map((n) => n.node.id == currentNode?.node.id ? currentNode : n);

        this.nodes = structuredClone(this.nodes); // Force change detection to update the nodes in the f-flow canvas

        this.cdr.markForCheck();
    }

    public onModalContainerChange() {
        if (!this.currentNodeForModal) {
            return;
        }

        this.loadUsersForModal(this.currentNodeForModal.node.container_id);
    }

    private loadUsersForModal(containerId: number): void {
        this.subscriptions.add(this.OrganizationalChartNodesService.loadUsers(containerId).subscribe((users) => {
            // we need to clone the array to avoid reference issues
            // otherwise the disabled property will not work correctly
            this.modalRegionManagers = structuredClone(users);
            this.modalManagers = structuredClone(users);
            this.modalUsers = structuredClone(users);

            this.disableUsedUsersModal();
            this.preselectUsersForModal();
            this.cdr.markForCheck();
        }));
    }

    private preselectUsersForModal() {
        if (!this.currentNodeForModal) {
            return;
        }

        this.selectedRegionManagers = this.currentNodeForModal.node.users
            .filter(u => u._joinData.user_role === OrganizationalchartUserRoles.REGION_MANAGER)
            .map(u => u.id);

        this.selectedManagers = this.currentNodeForModal.node.users
            .filter(u => u._joinData.user_role === OrganizationalchartUserRoles.MANAGER)
            .map(u => u.id);

        this.selectedUsers = this.currentNodeForModal.node.users
            .filter(u => u._joinData.user_role === OrganizationalchartUserRoles.USER)
            .map(u => u.id);

        this.disableUsedUsersModal();
    }

    public disableUsedUsersModal() {
        if (!this.currentNodeForModal) {
            return;
        }

        this.modalRegionManagers.forEach(u => {
            u.disabled = this.selectedUsers.includes(u.key) || this.selectedManagers.includes(u.key);
        });

        this.modalManagers.forEach(u => {
            u.disabled = this.selectedUsers.includes(u.key) || this.selectedRegionManagers.includes(u.key);
        });

        this.modalUsers.forEach(u => {
            u.disabled = this.selectedManagers.includes(u.key) || this.selectedRegionManagers.includes(u.key);
        });


        this.cdr.markForCheck();
    }


    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
    protected readonly String = String;
    protected readonly ContainerTypesEnum = ContainerTypesEnum;
    protected readonly EFConnectableSide = EFConnectableSide;
}
