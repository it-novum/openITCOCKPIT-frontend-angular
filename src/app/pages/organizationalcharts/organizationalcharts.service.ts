import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    LoadContainersRoot,
    LoadContainersRootWithCsrf,
    LoadOrganizationalChartByIdRootResponse,
    OrganizationalChartsIndexParams,
    OrganizationalChartsIndexRoot,
    OrganizationalChartsPost
} from './organizationalcharts.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class OrganizationalChartsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: OrganizationalChartsIndexParams): Observable<OrganizationalChartsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<OrganizationalChartsIndexRoot>(`${proxyPath}/organizationalCharts/index.json`, {
            params: params as {} // cast LocationsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    public getOrganizationalChartsByContainerId(id: number): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            organizationalCharts: SelectKeyValue[]
        }>(`${proxyPath}/organizationalCharts/loadOrganizationalChartsByContainerId/${id}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return data.organizationalCharts;
            })
        );
    }

    public getOrganizationalChartById(id: number): Observable<LoadOrganizationalChartByIdRootResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadOrganizationalChartByIdRootResponse>(`${proxyPath}${proxyPath}/organizationalCharts/loadOrganizationalChartById/${id}.json`, {
            params: {
                angular: true,
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return data;
            })
        );
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/organizationalCharts/delete/${item.id}.json`, {});
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadContainersRootWithCsrf>(`${proxyPath}/organizationalCharts/loadContainers.json`).pipe(
            map(data => {
                // We need to remove the _csrfToken from the response so we can do for loops on the keys
                return {
                    tenants: data.tenants,
                    locations: data.locations,
                    nodes: data.nodes
                };
            })
        )
    }

    public add(body: OrganizationalChartsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/organizationalCharts/add.json`, body)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.oc as OrganizationalChartsPost
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

    public getOrganizationalChartEdit(id: number): Observable<OrganizationalChartsPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            organizational_chart: OrganizationalChartsPost
        }>(`${proxyPath}/organizationalCharts/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.organizational_chart;
            })
        );
    }

    public saveOrganizationalChartEdit(oc: OrganizationalChartsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/organizationalCharts/edit/${oc.id}.json`, oc)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.oc as GenericIdResponse
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

}
