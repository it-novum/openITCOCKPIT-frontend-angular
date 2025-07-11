import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
    GenericResponse,
    GenericResponseWrapper,
    GenericSuccessAndMessageResponse,
    GenericValidationError
} from '../../../../generic-responses';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

import {
    ImportedHostElements,
    ImportedHostPost,
    ImportedhostsIndexParams,
    ImportedhostsIndexRoot
} from './importedhosts.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { Importer } from '../importers/importers.interface';


@Injectable({
    providedIn: 'root'
})
export class ImportedhostsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public getIndex(params: ImportedhostsIndexParams): Observable<ImportedhostsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ImportedhostsIndexRoot>(`${proxyPath}/import_module/imported_hosts/index.json`, {
            params: params as {} // cast ImportedhostsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getImporters(): Observable<{ importers: Importer[] }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            importers: Importer[]
        }>(`${proxyPath}/import_module/imported_hosts/getImporters.json`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public synchronizeWithMonitoring(): Observable<GenericSuccessAndMessageResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessAndMessageResponse>(`${proxyPath}/import_module/imported_hosts/synchronizeWithMonitoring/.json?angular=true.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Delete action    *
     **********************/
// Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/imported_hosts/delete/${item.id}.json?angular=true`, {});
    }

    public getEdit(id: number): Observable<ImportedHostPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            importedhost: ImportedHostPost,
            _csrfToken: null | string
        }>(`${proxyPath}/import_module/imported_hosts/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.importedhost;
            })
        )
    }

    public loadElements(containerId: number): Observable<ImportedHostElements> {
        const proxyPath = this.proxyPath;

        return this.http.get<ImportedHostElements>(`${proxyPath}/import_module/host_defaults/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/import_module/host_defaults/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        )
    }

    public saveImportedHostEdit(importedHost: ImportedHostPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/imported_hosts/edit/${importedHost.id}.json?angular=true`, {
            Importedhost: importedHost
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericResponse // Containers a ImportedHostPost
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
