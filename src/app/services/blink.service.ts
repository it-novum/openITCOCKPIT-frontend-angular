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

import { Injectable, OnDestroy } from '@angular/core';

interface CallbackObject {
    [key: string]: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class BlinkService implements OnDestroy {

    private objects: CallbackObject = {};
    private interval: any | null = null;
    private period = 5000;

    constructor() {
        this.startInterval();
    }

    public registerNewObject(uuid: string, callback: () => void) {
        if (!this.objects.hasOwnProperty(uuid)) {
            this.objects[uuid] = callback;
        }
        if (!this.interval) {
            this.startInterval();
        }
    }

    public unregisterObject(uuid: string) {
        if (this.objects.hasOwnProperty(uuid)) {
            delete this.objects[uuid];
        }
        if (Object.keys(this.objects).length === 0 && this.interval) {
            this.clearInterval();
        }
    }

    private startInterval() {
        this.clearInterval();
        this.interval = setInterval(() => {
            for (let uuid in this.objects) {
                //Call callback function
                this.objects[uuid]();
            }
        }, this.period);
    }

    public ngOnDestroy(): void {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

}
