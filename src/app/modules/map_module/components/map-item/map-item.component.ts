import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgClass, NgIf } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { interval, Subscription } from 'rxjs';
import { Mapitem } from '../../pages/mapeditors/mapeditors.interface';
import { ContextActionType, LabelPosition, MapItemType } from '../map-item-base/map-item-base.enum';
import { MapItemReloadService } from '../../../../services/map-item-reload.service';
import { BlinkService } from '../../../../services/blink.service';
import { UUID } from '../../../../classes/UUID';
import {
    DataForMapItem,
    MapItemRoot,
    MapItemRootForMapItem,
    MapItemRootParams
} from '../map-item-base/map-item-base.interface';

@Component({
    selector: 'oitc-map-item',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgIf, NgClass],
    templateUrl: './map-item.component.html',
    styleUrl: './map-item.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapItemComponent extends MapItemBaseComponent<Mapitem> implements OnInit, OnDestroy {

    public override item: InputSignal<Mapitem | undefined> = input<Mapitem>();
    public refreshInterval = input<number>();

    private subscriptions: Subscription = new Subscription();
    private readonly MapItemReloadService = inject(MapItemReloadService);
    private readonly BlinkService = inject(BlinkService);
    private blinkSubscription: Subscription = new Subscription();

    private uuidForServices: string | null = null;
    private interval: number | null = null;
    protected icon: string = "";
    protected currentIcon: string = "";
    protected icon_property: string = "";
    protected allowView: boolean = false;
    protected label: string = "";
    private init: boolean = true;
    private uuid!: UUID;

    protected override type = MapItemType.ITEM;

    constructor(parent: MapCanvasComponent) {
        super(parent);
        this.blinkServiceCallback = this.blinkServiceCallback.bind(this);
        effect(() => {
            if (!this.isItemDeleted(this.type)) {
                this.onItemObjectIdChange();
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.stopBlink();
        this.stop();
    }

    public ngOnInit(): void {
        this.uuid = new UUID();
        if (!this.isItemDeleted(this.type)) {
            this.load();
        }
        if (this.refreshInterval()! > 0 && this.uuidForServices) {
            this.MapItemReloadService.setRefreshInterval(this.refreshInterval() as number);
            this.MapItemReloadService.registerNewItem(this.uuidForServices, this.item() as Mapitem, this.updateCallback);
        }
    }

    public updateCallback = (result: MapItemRootForMapItem) => {
        if (!result.data.allowView) {
            this.allowView = false;
            return;
        }

        this.icon = result.data.data.icon!;
        this.icon_property = result.data.data.icon_property!;
        this.allowView = result.data.allowView;
        this.init = false;

        this.getLabel(result.data.data);

        this.currentIcon = this.icon;

        if ((result.data.data.isAcknowledged === true || result.data.data.isInDowntime === true) && this.uuidForServices) {
            this.BlinkService.registerNewObject(this.uuidForServices, this.blinkServiceCallback);
        } else {
            if (this.uuidForServices) {
                this.BlinkService.unregisterObject(this.uuidForServices);
            }
        }
        this.cdr.markForCheck();
    };

    private load() {
        if (this.uuidForServices === null) {
            this.uuidForServices = this.uuid.v4();
        }

        const params: MapItemRootParams = {
            'angular': true,
            'disableGlobalLoader': true,
            'objectId': this.item()!.object_id as number,
            'mapId': this.item()!.map_id as number,
            'type': this.item()!.type as string
        };

        this.subscriptions.add(this.MapItemBaseService.getMapItem(params)
            .subscribe((result: MapItemRoot) => {
                this.updateCallback({data: result});
            }));
    };

    private getLabel = (data: DataForMapItem) => {
        this.label = '';
        switch (this.item()!.type) {
            case 'host':
                this.label = data.Host.hostname;
                break;

            case 'service':
                this.label = data.Host.hostname + '/' + data.Service.servicename;
                break;

            case 'hostgroup':
                this.label = data.Hostgroup!.name;
                break;

            case 'servicegroup':
                this.label = data.Servicegroup!.name;
                break;

            case 'map':
                this.label = data.Map!.name;
                break;
        }
        this.cdr.markForCheck();
    };

    private startBlink() {
        this.blinkSubscription = interval(5000).subscribe(() => {
            if (this.currentIcon === this.icon) {
                this.currentIcon = this.icon_property;
            } else {
                this.currentIcon = this.icon;
            }
            this.cdr.markForCheck();
        });
    };

    private stopBlink() {
        if (this.blinkSubscription) {
            this.blinkSubscription.unsubscribe();
            this.cdr.markForCheck();
        }
    };

    private blinkServiceCallback() {
        if (this.currentIcon === this.icon) {
            this.currentIcon = this.icon_property;
        } else {
            this.currentIcon = this.icon;
        }
        this.cdr.markForCheck();
    };

    private stop() {
        if (this.uuidForServices) {
            this.BlinkService.unregisterObject(this.uuidForServices);
            this.MapItemReloadService.unregisterItem(this.uuidForServices);
        }
    };

    private onItemObjectIdChange() {
        if (this.init || this.item()!.object_id === null) {
            //Avoid ajax error if user search a object in item config modal
            return;
        }

        this.load();
    };

    protected override getExtraContextMenuItems(): MenuItem[] {
        return [
            {
                label: this.TranslocoService.translate('Label position'),
                icon: 'fa fa-font',
                items: [
                    {
                        label: this.TranslocoService.translate('Top'),
                        icon: 'fa fa-up-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.TOP
                                } as Mapitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Right'),
                        icon: 'fa fa-right-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.RIGHT
                                } as Mapitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Bottom'),
                        icon: 'fa fa-down-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.BOTTOM
                                } as Mapitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    },
                    {
                        label: this.TranslocoService.translate('Left'),
                        icon: 'fa fa-left-long',
                        command: () => {
                            this.contextActionEvent.emit({
                                type: ContextActionType.LABEL_POSITION,
                                data: {
                                    id: this.id,
                                    x: this.x,
                                    y: this.y,
                                    map_id: this.mapId,
                                    label_possition: LabelPosition.LEFT
                                } as Mapitem,
                                itemType: this.type
                            });
                            this.cdr.markForCheck();
                        }
                    }
                ]
            }
        ]
    }

}
