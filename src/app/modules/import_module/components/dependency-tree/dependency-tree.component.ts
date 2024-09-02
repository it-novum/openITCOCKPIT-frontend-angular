import { Component, HostListener, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ColComponent, RowComponent } from '@coreui/angular';
import { OnlineOfflineComponent } from '../additional-host-information/online-offline/online-offline.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DOCUMENT, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ExternalSystemsService } from '../../external-systems.service';
import { DependencyTreeApiResult, VisObject, VisRelation } from '../../ExternalSystems.interface';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { BackButtonDirective } from '../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Edge, Network, Node, NodeOptions, Options } from 'vis-network';

interface InOnit {
}

@Component({
    selector: 'oitc-dependency-tree',
    standalone: true,
    imports: [
        ColComponent,
        OnlineOfflineComponent,
        RowComponent,
        TranslocoDirective,
        NgIf,
        XsButtonDirective,
        BackButtonDirective,
        FaIconComponent,
        TranslocoPipe
    ],
    templateUrl: './dependency-tree.component.html',
    styleUrl: './dependency-tree.component.css'
})
export class DependencyTreeComponent implements InOnit, OnChanges, OnDestroy {
    @Input() public objectId: number = 0;

    @Input() public type: 'host' | 'hostgroup' = 'host';

    @Input() public name: string = '';

    @Input() public showOnlineOffline: boolean = false;

    @HostListener('fullscreenchange', ['$event'])
    handleFullscreenchangeEvent(Event: Event) {
        if (document.fullscreenElement === null) {
            this.isFullscreen = false;
        }
    }

    public isOnline: boolean = false;
    public dependencyTree?: DependencyTreeApiResult;

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
            this.dependencyTree = data;
            this.isOnline = data.connected.status;

            this.renderVisNetwork(
                this.dependencyTree.treeData.source,
                this.dependencyTree.treeData.objects,
                this.dependencyTree.treeData.relations
            );
        });
    }

    public renderVisNetwork(sourceId: number | string | null | undefined, resultNodes: VisObject[], resultEdges: VisRelation[]): void {

        const elem = this.document.getElementById('dependencyTreeOverview');
        if (!elem) {
            // Just to make TS happy
            return;
        }

        let nodes: Node[] = [];
        let edges: Edge[] = [];

        let options: Options = {
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
                    direction: this.dependencyTree?.treeData.direction || 'UD',
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
            let visNode: NodeOptions = node as NodeOptions;

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

            nodes.push(visNode);

        });

        resultEdges.forEach(edge => {
            edges.push(edge);
        });

        const network = new Network(elem, {nodes: nodes, edges: edges}, options);
        network.fit({
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });

        network.on('stabilizationProgress', (params) => {
            var currentPercentage = Math.round(params.iterations / params.total * 100);
            //$('#visProgressbarLoader .progress-bar:first').css('width', currentPercentage + '%');
        });
        network.once('stabilizationIterationsDone', () => {
            //$('#visProgressbarLoader').hide(); //AngularJS is too slow
            network.setOptions({physics: false});
        });


    }

    public toggleFullscreenMode() {
        const elem = this.document.getElementById('dependencyTreeOverview');

        if (this.isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
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

}
