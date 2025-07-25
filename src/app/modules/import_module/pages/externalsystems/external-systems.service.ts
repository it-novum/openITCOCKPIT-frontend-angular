import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AdditionalHostInformationResult,
    Applications,
    DependencyTreeApiResult,
    ExternalSystemConnect,
    ExternalSystemEntity,
    ExternalSystemGet,
    ExternalSystemPost,
    ExternalSystemsIndexParams,
    ExternalSystemsIndexRoot,
    IdoitObjectTypeResult
} from './external-systems.interface';
import { StatusSummaryState, SummaryState } from '../../../../pages/hosts/summary_state.interface';
import { ModalService } from '@coreui/angular';
import {
    GenericIdResponse,
    GenericMessageResponse,
    GenericResponseWrapper,
    GenericValidationError
} from '../../../../generic-responses';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectItemOptionGroup, SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class ExternalSystemsService {
    constructor() {
    }

    public modalExternalSystem$$: Subject<ExternalSystemEntity> = new Subject();
    public modalExternalSystem$ = this.modalExternalSystem$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly modalService = inject(ModalService);


    /**********************
     *    Hosts browser    *
     **********************/
    public getAdditionalHostInformation(hostId: number): Observable<AdditionalHostInformationResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<AdditionalHostInformationResult>(`${proxyPath}/import_module/ExternalSystems/additionalHostInformation/${hostId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getDependencyTree(objectId: number, type: 'host' | 'hostgroup' = 'host'): Observable<DependencyTreeApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<DependencyTreeApiResult>(`${proxyPath}/import_module/ExternalSystems/dependencyTree/${objectId}.json`, {
            params: {
                angular: true,
                type: type
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getHostSummary(hostId: number): Observable<SummaryState> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            summaryState: SummaryState
        }>(`${proxyPath}/import_module/ExternalSystems/hostsummary/${hostId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.summaryState;
            })
        );
    }

    public getHostgroupSummary(hostgroupId: number): Observable<StatusSummaryState> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            summaryState: StatusSummaryState
        }>(`${proxyPath}/import_module/ExternalSystems/hostgroupsummary/${hostgroupId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.summaryState;
            })
        );
    }

    public loadDataFromITop(externalSystem: ExternalSystemEntity): Observable<{
        success: boolean;
        data: Applications | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            applications: Applications
            hasRootPrivileges: boolean
        }>(`${proxyPath}/import_module/imported_hostgroups/loadDataFromITop/${externalSystem.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.applications,
                    hashRootPrivileges: data.hasRootPrivileges
                };
            }),
            catchError((error: any) => {
                let errorMessage: GenericMessageResponse = {message: error.error.response.error};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public openImportedHostGroupDataModal(externalSystem: ExternalSystemEntity) {
        this.modalExternalSystem$$.next(externalSystem);

        this.modalService.toggle({
            show: true,
            id: 'importITopData',
        });
    }

    public startDataImport(externalSystem: ExternalSystemEntity, ignoreExternalSystem: boolean = false): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/imported_hostgroups/importHostgroups/.json?angular=true`, {
            externalSystemId: externalSystem.id,
            ignoreExternalSystem: ignoreExternalSystem
        }).pipe(map(data => {
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

    public getIndex(params: ExternalSystemsIndexParams): Observable<ExternalSystemsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExternalSystemsIndexRoot>(`${proxyPath}/import_module/external_systems/index.json`, {
            params: params as {} // cast ExternalSystemsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    public testConnection(params: ExternalSystemPost): Observable<ExternalSystemConnect> {
        const proxyPath = this.proxyPath;
        return this.http.post<ExternalSystemConnect>(`${proxyPath}/import_module/external_systems/testConnection.json?angular=true`,
            params // cast ExternalSystemPost into object
        ).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadHostgroupContainers(container_id: number): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/import_module/external_systems/loadHostgroupContainers/${container_id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public getEdit(id: number): Observable<ExternalSystemGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExternalSystemGet>(`${proxyPath}/import_module/external_systems/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public parseElementsForOptionGroup(objectTypes: IdoitObjectTypeResult[]): SelectItemOptionGroup[] {
        let newFormat: any = {};
        objectTypes.forEach(function (objectType) {
            if (!newFormat[objectType.value.type_group_title]) {
                newFormat[objectType.value.type_group_title] = {
                    value: objectType.value.type_group,
                    label: objectType.value.type_group_title,
                    items: []
                };
            }
            newFormat[objectType.value.type_group_title].items.push({
                value: objectType.value.id,
                label: objectType.value.title
            });
        });
        return Object.values(newFormat);
    }

    /**********************
     *    Add action    *
     **********************/
    public createExternalSystem(externalSystem: ExternalSystemPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/external_systems/add.json?angular=true`, externalSystem)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.externalSystem as GenericIdResponse
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

    /**********************
     *    Edit action    *
     **********************/
    public edit(externalSystem: ExternalSystemPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/import_module/external_systems/edit/${externalSystem.id}.json?angular=true`, externalSystem)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.externalSystem as GenericIdResponse
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

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/external_systems/delete/${item.id}.json?angular=true`, {});
    }
}
