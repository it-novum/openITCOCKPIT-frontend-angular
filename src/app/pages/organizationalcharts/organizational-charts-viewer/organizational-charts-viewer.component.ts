import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    model,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    ModalToggleDirective
} from '@coreui/angular';
import {
    EFConnectableSide,
    EFConnectionBehavior,
    EFConnectionType,
    EFMarkerType,
    FBackgroundComponent,
    FCanvasComponent,
    FCirclePatternComponent,
    FFlowComponent,
    FFlowModule,
    FZoomDirective
} from '@foblex/flow';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ContainerTypesEnum } from '../../changelogs/object-types.enum';
import {
    OcConnection,
    OrganizationalChartsTreeNode,
    OrganizationalChartsTreeNodeUser
} from '../organizationalcharts.interface';
import { OcTreeNode } from '../organizational-charts-editor/organizational-charts-editor.interface';
import { Subscription } from 'rxjs';
import { OrganizationalChartNodesService } from '../organizationalchartnodes.service';
import { OrganizationalChartsService } from '../organizationalcharts.service';
import { Point } from '@foblex/2d';
import { NgClass } from '@angular/common';
import { OcNodeViewerComponent } from './oc-node-viewer/oc-node-viewer.component';
import { OrganizationalchartUserRoles } from '../organizationalcharts.enum';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
    selector: 'oitc-organizational-charts-viewer',
    imports: [
        ButtonCloseDirective,
        FBackgroundComponent,
        FCanvasComponent,
        FCirclePatternComponent,
        FFlowComponent,
        FFlowModule,
        FZoomDirective,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ReactiveFormsModule,
        TranslocoDirective,
        XsButtonDirective,
        ModalToggleDirective,
        NgClass,
        OcNodeViewerComponent,
        LabelLinkComponent,
        FaIconComponent
    ],
    templateUrl: './organizational-charts-viewer.component.html',
    styleUrl: './organizational-charts-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationalChartsViewerComponent implements OnInit, OnDestroy {

    // Two-way binding for the organizational charts tree from the add or edit component
    public nodeTree = model<OrganizationalChartsTreeNode[]>([]);

    // Two-way binding for the organizational chart connections from add or edit component
    public connections = model<OcConnection[]>([]);

    public nodes: OcTreeNode[] = [];

    @ViewChild(FFlowComponent, {static: false})
    public fFlowComponent!: FFlowComponent;

    @ViewChild(FCanvasComponent, {static: true})
    public fCanvasComponent!: FCanvasComponent;

    @ViewChild(FZoomDirective, {static: true})
    public fZoomDirective!: FZoomDirective;

    @ViewChild('ocNodeDetailsModal', {static: false}) ocNodeDetailsModal: ModalComponent | undefined;
    private readonly modalService = inject(ModalService);

    public currentNodeForModal: OcTreeNode | undefined;

    public modalRegionManagers: OrganizationalChartsTreeNodeUser[] = [];
    public modalManagers: OrganizationalChartsTreeNodeUser[] = [];
    public modalUsers: OrganizationalChartsTreeNodeUser[] = [];

    private readonly OrganizationalChartsService: OrganizationalChartsService = inject(OrganizationalChartsService);
    private readonly OrganizationalChartNodesService: OrganizationalChartNodesService = inject(OrganizationalChartNodesService);
    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private cdr: ChangeDetectorRef
    ) {

    }

    public ngOnInit(): void {

        // In view - copy existing nodes into f-flow
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
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onInitialized(): void {
        this.fCanvasComponent.fitToScreen(new Point(0, 0), false);
        //this.fCanvasComponent.resetScaleAndCenter(false);
        //this.fCanvasComponent.fitToScreen(PointExtensions.initialize(50, 200), false);
    }

    public onViewNodeDetails(node: OcTreeNode) {
        this.currentNodeForModal = structuredClone(node);

        this.modalRegionManagers = [];
        this.modalManagers = [];
        this.modalUsers = [];
        this.modalRegionManagers = this.currentNodeForModal.node.users.filter(user =>
            user._joinData.user_role === OrganizationalchartUserRoles.REGION_MANAGER
        );
        this.modalManagers = this.currentNodeForModal.node.users.filter(user =>
            user._joinData.user_role == OrganizationalchartUserRoles.MANAGER
        );
        this.modalUsers = this.currentNodeForModal.node.users.filter(user =>
            user._joinData.user_role == OrganizationalchartUserRoles.USER
        );

        this.cdr.markForCheck();
        this.modalService.toggle({
            show: true,
            id: this.ocNodeDetailsModal?.id
        });

        this.cdr.detectChanges();

    }

    protected readonly eMarkerType = EFMarkerType;
    protected readonly EFConnectionBehavior = EFConnectionBehavior;
    protected readonly EFConnectionType = EFConnectionType;
    protected readonly String = String;
    protected readonly ContainerTypesEnum = ContainerTypesEnum;

    protected readonly OrganizationalchartUserRoles = OrganizationalchartUserRoles;
    protected readonly EFConnectableSide = EFConnectableSide;
}
