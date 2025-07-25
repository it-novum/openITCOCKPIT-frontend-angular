import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {
  ColComponent,
  ProgressBarComponent,
  ProgressComponent,
  RowComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToastHeaderComponent
} from '@coreui/angular';
import { OnlineOfflineComponent } from '../additional-host-information/online-offline/online-offline.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DecimalPipe, DOCUMENT, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ExternalSystemsService } from '../../pages/externalsystems/external-systems.service';
import {
    DependencyTreeApiResult,
    VisHiststatus,
    VisObject,
    VisRelation
} from '../../pages/externalsystems/external-systems.interface';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Edge, Network, Node, Options } from 'vis-network';
import { DataSet } from 'vis-data/peer';
import { StatusSummaryState, SummaryState } from '../../../../pages/hosts/summary_state.interface';
import { HostSummaryComponent } from './host-summary/host-summary.component';
import { NotInMonitoringComponent } from './not-in-monitoring/not-in-monitoring.component';
import { HostGroupSummaryComponent } from './host-group-summary/host-group-summary.component';

// We extend the default node interface with hostgroup and host fields to have the data available
// is a user clicks on a node
export interface NodeExtended extends Node {
    host?: {
        id: number
        uuid: string
        name: string
        disabled: number,
        hoststatus: VisHiststatus
    }
    hostgroup?: {
        identifier: string
        Hostgroups: {
            id: number
            uuid: string
        }
        Containers: {
            name: string
        }
        hoststatus: VisHiststatus
    }
    external_link?: string
    id?: string,
    key?: string
}

@Component({
    selector: 'oitc-dependency-tree',
    imports: [
    ColComponent,
    OnlineOfflineComponent,
    RowComponent,
    TranslocoDirective,
    NgIf,
    XsButtonDirective,
    FaIconComponent,
    TranslocoPipe,
    ProgressComponent,
    DecimalPipe,
    ToastComponent,
    ToastBodyComponent,
    ToasterComponent,
    ToastHeaderComponent,
    ProgressBarComponent,
    HostSummaryComponent,
    NotInMonitoringComponent,
    HostGroupSummaryComponent
],
    templateUrl: './dependency-tree.component.html',
    styleUrl: './dependency-tree.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DependencyTreeComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public objectId: number = 0;
    @Input() public type: 'host' | 'hostgroup' = 'host';
    @Input() public name: string = '';
    @Input() public showOnlineOffline: boolean = false;
    @Output() public externalSystemConnected = new EventEmitter<boolean>();

    selectedNode!: NodeExtended;

    @HostListener('fullscreenchange', ['$event'])
    handleFullscreenchangeEvent(Event: Event) {
        if (document.fullscreenElement === null) {
            this.isFullscreen = false;
        }
    }

    public isOnline: boolean = false;
    public dependencyTree?: DependencyTreeApiResult;

    // Progress is only necessary if physics is enabled
    public showProgressbar: boolean = false;
    public progress: number = 0;

    public toastVisible: boolean = false;
    public toastPercentage: number = 0;

    public hostSummaryState?: SummaryState;
    public hostgroupSummeryState?: StatusSummaryState;

    private isFullscreen: boolean = false;
    private subscriptions: Subscription = new Subscription();

    private readonly document = inject(DOCUMENT);
    private readonly ExternalSystemsService = inject(ExternalSystemsService);

    public readonly imageDirectoryPath: string = '/import_module/img/dependency_map_icons/';
    public readonly statusColors = {
        'text-primary': '#5856d6',
        'bg-up': '#00C851',
        'ok': '#00C851',
        'bg-ok': '#00C851',
        'warning': '#ffbb33',
        'bg-warning': '#ffbb33',
        'bg-down': '#CC0000',
        'critical': '#CC0000',
        'bg-critical': '#CC0000',
        'bg-unreachable': '#727b84',
        'unknown': '#727b84',
        'bg-unknown': '#727b84',
        'disabled': '#9999994D',
        'info': '#17a2b8'
    };
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['objectId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        //if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
        //    //this.load();
        //    return;
        //}

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.isOnline = false;
        this.ExternalSystemsService.getDependencyTree(this.objectId, this.type).subscribe(data => {
            this.cdr.markForCheck();
            this.dependencyTree = data;
            this.isOnline = data.connected.status;
            this.externalSystemConnected.emit(this.isOnline);
            if (this.dependencyTree.treeData.objects) {
                this.renderVisNetwork(
                    this.dependencyTree.treeData.source,
                    this.dependencyTree.treeData.objects,
                    this.dependencyTree.treeData.relations
                );
            }
        });
    }

    public renderVisNetwork(sourceId: number | string | null | undefined, resultNodes: VisObject[], resultEdges: VisRelation[]): void {

        const elem = this.document.getElementById('dependencyTreeOverview');
        if (!elem) {
            // Just to make TS happy
            return;
        }

        let nodes: DataSet<NodeExtended> = new DataSet<NodeExtended>();
        let edges: DataSet<Edge> = new DataSet<Edge>();

        nodes.clear();
        edges.clear();

        const rect = elem.getBoundingClientRect();
        const offset = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
        if (offset.top < 0) {
            offset.top = 0;
        }

        let options: Options = {
            autoResize: true,
            height: String(window.innerHeight - offset.top) + 'px', // I can't stress enough how important the height parameter is!
            width: "100%",
            clickToUse: false,
            groups: {
                useDefaultGroups: false,
                DefaultGroup: {
                    shape: 'image',
                    image: this.imageDirectoryPath + 'qelectrotech.svg',
                    color: this.statusColors['text-primary'],
                    size: 25
                },
                Person: {
                    shape: 'image',
                    image: this.getIconImageByClassName('Person'),
                    size: 25
                },
                SANSwitch: {
                    shape: 'image',
                    image: this.getIconImageByClassName('SANSwitch'),
                    size: 22,
                    shapeProperties: {
                        useImageSize: false,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                Server: {
                    shape: 'image',
                    image: this.getIconImageByClassName('Server'),
                    shapeProperties: {
                        useImageSize: true,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                Hypervisor: {
                    shape: 'image',
                    image: this.getIconImageByClassName('Hypervisor'),
                    size: 22,
                    shapeProperties: {
                        useImageSize: false,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                Farm: {
                    shape: 'image',
                    image: this.getIconImageByClassName('Farm'),
                    size: 22,
                    shapeProperties: {
                        useImageSize: false,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                VirtualMachine: {
                    shape: 'image',
                    image: this.getIconImageByClassName('VirtualMachine'),
                    shapeProperties: {
                        useImageSize: true,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                ApplicationSolution: {
                    shape: 'image',
                    image: this.getIconImageByClassName('ApplicationSolution'),
                    shapeProperties: {
                        useImageSize: true,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                    }
                },
                DBServer: {
                    shape: 'image',
                    image: this.getIconImageByClassName('DBServer'),
                    size: 25
                },
                DatabaseSchema: {
                    shape: 'image',
                    image: this.getIconImageByClassName('DatabaseSchema'),
                    size: 25
                },
                WebApplication: {
                    shape: 'image',
                    image: this.getIconImageByClassName('WebApplication'),
                    size: 25
                },
                WANLine: {
                    shape: 'image',
                    image: this.getIconImageByClassName('WANLine'),
                    size: 25
                }
            },
            nodes: {
                // margin: 10,
                shadow: {
                    enabled: true,
                    size: 1,
                    color: 'rgba(0,0,0,0.1)'
                },
                font: {
                    size: 12,
                    background: 'rgba(255,255,255,0.7)'
                },
                // heightConstraint: {
                //    minimum: 20
                // }
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: this.dependencyTree?.treeData.direction || 'UD',  // UD, DU, LR, RL
                    sortMethod: 'directed'
                }
            },
            edges: {
                width: 0.2,
                // smooth: {
                //     enabled: false
                // },
                color: {
                    inherit: false
                }
            },
            physics: false,
            interaction: {
                hover: true,
                dragNodes: false,
                keyboard: {
                    enabled: false
                },
                hideEdgesOnDrag: true
            }
        };

        resultNodes.forEach(node => {
            let visNode: NodeExtended = {
                //class: node.class,
                id: node.id,
                title: node.title,
                group: node.group,
                label: node.label,
                external_link: node.external_link,
                key: node.key,
            };

            if (sourceId == node.id) {
                visNode.borderWidth = 5;
                visNode.borderWidthSelected = 5;
                visNode.imagePadding = 15;
                visNode.size = 30;
                visNode.shapeProperties = {
                    borderDashes: [20, 5],
                    interpolation: true,
                    useBorderWithImage: true,
                    useImageSize: false
                };
                visNode.shape = 'circularImage';
            }

            if (node.host) {
                visNode.host = node.host;

                if (node.host.disabled == 0) {
                    visNode.image = this.getIconImageByClassName(node.class);
                    // @ts-ignore
                    visNode.color = this.statusColors[node.host.hoststatus.summary_state] || 'unknown'
                } else {
                    visNode.image = this.imageDirectoryPath + 'disabled.png';
                    visNode.color = {
                        border: this.statusColors['info'],
                        background: this.statusColors['disabled']
                    };
                    visNode.shapeProperties = {
                        useImageSize: false,
                        useBorderWithImage: false,
                        interpolation: false,
                        coordinateOrigin: "center",
                        borderDashes: [5, 5]
                    };
                }

                visNode.shape = 'circularImage';
                visNode.imagePadding = 10;
                visNode.size = 30;

                if (node.host.id === this.objectId) {
                    visNode.borderWidth = 5;
                    visNode.borderWidthSelected = 5;
                }
            }

            if (node.hostgroup) {
                visNode.hostgroup = node.hostgroup;

                visNode.image = this.getIconImageByClassName(node.class);
                // @ts-ignore
                visNode.color = this.statusColors[node.hostgroup.hoststatus.summary_state];

                visNode.shape = 'circularImage';
                visNode.imagePadding = 10;
                visNode.size = 30;

                if (node.hostgroup.Hostgroups.id === this.objectId) {
                    visNode.borderWidth = 5;
                    visNode.borderWidthSelected = 5;
                }
            }

            nodes.add(visNode);

        });

        resultEdges.forEach(edge => {

            let visEdge: Edge = {
                from: edge.from,
                to: edge.to,
                color: edge.color,
                arrows: edge.arrows,
            };

            edges.add(visEdge);
        });

        if (options.physics) {
            this.showProgressbar = true;
            this.progress = 0;
            this.cdr.markForCheck();
        }
        const network = new Network(elem, {nodes: nodes, edges: edges}, options);
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });

        if (options.physics) {
            network.on('stabilizationProgress', (params) => {
                let currentPercentage = Math.round(params.iterations / params.total * 100);
                this.progress = currentPercentage;
                this.cdr.markForCheck();
            });
            network.once('stabilizationIterationsDone', () => {
                this.showProgressbar = false;
                this.cdr.markForCheck();
                network.setOptions({physics: false});
            });
        }

        network.on('click', (properties) => {
            if (properties.nodes.length === 0) {
                network.fit({
                    animation: {
                        duration: 500,
                        easingFunction: 'linear'
                    }
                });
                return;
            }

            const nodeId = properties.nodes[0];
            if (nodeId === 0) {
                return;
            }

            let selectedNode: NodeExtended = nodes.get(nodeId) as NodeExtended;
            this.toggleToast(selectedNode);
            // shared $scope with HostSummaryDirective
        });

    }

    public toggleFullscreenMode() {
        const elem = this.document.getElementById('fullscreenDependencyTree');

        if (this.isFullscreen) {
            if (document.exitFullscreen) {
                this.isFullscreen = false;
                this.cdr.markForCheck();
                document.exitFullscreen();
            }
        } else {
            this.isFullscreen = true;
            this.cdr.markForCheck();
            if (elem && elem.requestFullscreen) {
                elem.requestFullscreen();
            }
        }
    }

    private getIconImageByClassName(className: string): string {
        let image = 'server-database.png';
        switch (className) {
            case 'Person':
                image = 'kuser.svg';
                break;
            case 'SANSwitch':
                image = 'switch.png';
                break;
            case 'Server':
                image = 'system-network-server.svg';
                break;
            case 'Hypervisor':
                image = 'network-server.png';
                break;
            case 'Farm':
                image = 'network-workgroup.png';
                break;
            case 'VirtualMachine':
                image = 'virtualization-vm.svg';
                break;
            case 'ApplicationSolution':
                image = 'application.svg';
                break;
            case 'DBServer':
                image = 'database.png';
                break;
            case 'DatabaseSchema':
                image = 'database_schema.png';
                break;
            case 'WebApplication':
                image = 'web_application.png';
                break;
            case 'WANLine':
                image = 'wan_line.png';
                break;
            default:
                return this.imageDirectoryPath + image;
        }
        return this.imageDirectoryPath + image;
    }

    public toggleToast(node: NodeExtended) {
        this.selectedNode = node;
        if (this.toastVisible) {
            // Close any open toast
            this.toastVisible = false;
            this.cdr.markForCheck();
        }

        this.hostSummaryState = undefined;
        this.hostgroupSummeryState = undefined;
        this.cdr.markForCheck();

        if (node.host) {
            this.ExternalSystemsService.getHostSummary(node.host.id).subscribe(data => {
                this.hostSummaryState = data;
                this.toastVisible = true; // Show toast
                this.cdr.markForCheck();
            });
        } else if (node.hostgroup) {
            this.ExternalSystemsService.getHostgroupSummary(node.hostgroup.Hostgroups.id).subscribe(data => {
                this.hostgroupSummeryState = data;
                this.toastVisible = true; // Show toast
                this.cdr.markForCheck();
            });
        } else {
            // Not in monitoring
            this.toastVisible = true; // Show toast
            this.cdr.markForCheck();
        }

    }

    public onToastTimerChange($event: number) {
        this.toastPercentage = $event * 25;
        this.cdr.markForCheck();
    }

    public onToastVisibleChange($event: boolean) {
        this.toastVisible = $event;
        if (!this.toastVisible) {
            this.toastPercentage = 0;
            this.cdr.markForCheck();
        }
    }

}
