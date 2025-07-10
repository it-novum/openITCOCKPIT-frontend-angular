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

import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { LoadContainersRoot } from '../../../../pages/containers/containers.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import {
    MapgeneratorPost,
    MapgeneratorsEditRoot,
    MapgeneratorsIndexParams,
    MapgeneratorsIndexRoot
} from './mapgenerators.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class MapgeneratorsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: MapgeneratorsIndexParams): Observable<MapgeneratorsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapgeneratorsIndexRoot>(`${proxyPath}/map_module/mapgenerators/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/map_module/mapgenerators/loadContainers.json?angular=true`, {}).pipe(
            map((data: LoadContainersRoot) => {
                return data;
            })
        )
    }

    public add(post: MapgeneratorPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/mapgenerators/add.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public getEdit(id: number): Observable<MapgeneratorsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/map_module/mapgenerators/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateMapgenerator(post: MapgeneratorPost, id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/mapgenerators/edit/${id}.json?angular=true`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public getGenerator(id: number): Observable<MapgeneratorsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/map_module/mapgenerators/generate/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public generate(id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/map_module/mapgenerators/generate/${id}.json?angular=true`, {})
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/map_module/mapgenerators/delete/${item.id}.json?angular=true`, {});
    }

}
