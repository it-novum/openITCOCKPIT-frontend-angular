/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
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

import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { MapeditorsService } from '../modules/map_module/pages/mapeditors/mapeditors.service';
import { Mapitem } from '../modules/map_module/pages/mapeditors/mapeditors.interface';
import { MapItemRootForMapItem } from '../modules/map_module/components/map-item-base/map-item-base.interface';

interface Item {
    item: Mapitem;
    callback: (result: MapItemRootForMapItem) => void;
}

@Injectable({
    providedIn: 'root'
})
export class MapItemReloadService implements OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private MapeditorsService: MapeditorsService = inject(MapeditorsService);

    private items: { [key: string]: Item } = {};
    private interval: any | null = null;

    private refreshInterval = 0;

    constructor() {
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    private loadData() {

        let postData = [];

        for (let uuid in this.items) {
            postData.push({
                'objectId': this.items[uuid].item.object_id as number,
                'mapId': this.items[uuid].item.map_id as number,
                'type': this.items[uuid].item.type as string,
                'uuid': uuid
            });
        }

        this.subscriptions.add(this.MapeditorsService.saveMapitemMulti({
            items: postData,
            disableGlobalLoader: true
        }).pipe(take(1)).subscribe((result) => {
            if (result.success) {
                let data = result.data.mapitems;

                for (let uuid in this.items) {
                    if (data.hasOwnProperty(uuid)) {
                        this.items[uuid].callback({
                            data: data[uuid]
                        });
                    }
                }
            }
        }));
    };

    private startInterval() {
        if (this.refreshInterval > 0) {
            this.interval = setInterval(() => {
                this.loadData();
            }, this.refreshInterval);
        }
    };

    public registerNewItem(uuid: string, item: Mapitem, callback: (result: MapItemRootForMapItem) => void) {
        if (!this.items.hasOwnProperty(uuid)) {
            this.items[uuid] = {
                item: item,
                callback: callback
            };
        }

        if (this.interval === null) {
            this.startInterval();
        }
    }

    public unregisterItem(uuid: string) {
        if (this.items.hasOwnProperty(uuid)) {
            delete this.items[uuid];
        }

        if (Object.keys(this.items).length === 0) {
            if (this.interval !== null) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

    }

    public setRefreshInterval(value: number) {
        if (value > 0 && value != this.refreshInterval) {
            this.refreshInterval = value;

            if (this.interval !== null) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.startInterval();
        }
    }
}
