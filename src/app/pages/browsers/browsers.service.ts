import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { BrowsersIndexResponse, StatuscountResponse, StatuscountResponseExtended } from './browsers.interface';
import { ROOT_CONTAINER } from '../changelogs/object-types.enum';

@Injectable({
    providedIn: 'root'
})
export class BrowsersService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(containerId: number = ROOT_CONTAINER): Observable<BrowsersIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<BrowsersIndexResponse>(`${proxyPath}/browsers/index/${containerId}.json`).pipe(
            map(data => {
                return data
            })
        );
    }

    public getStatusCountsByContainer(containerIds: number[], recursive?: boolean): Observable<StatuscountResponse> {
        const proxyPath = this.proxyPath;

        let params: any = {
            angular: true,
            'containerIds[]': containerIds
        };

        if (recursive !== undefined) {
            params['recursive'] = recursive;
        }

        return this.http.get<StatuscountResponse>(`${proxyPath}/angular/statuscount.json`, {
            params: params
        }).pipe(
            map(data => {
                return data
            })
        );
    }

    public getExtendedStatusCountsByContainer(containerIds: number[], recursive?: boolean): Observable<StatuscountResponseExtended> {
        const proxyPath = this.proxyPath;

        let params: any = {
            angular: true,
            'containerIds[]': containerIds
        };

        if (recursive !== undefined) {
            params['recursive'] = recursive;
        }

        params['extended'] = true;

        return this.http.get<StatuscountResponseExtended>(`${proxyPath}/angular/statuscount.json`, {
            params: params
        }).pipe(
            map(data => {
                return data
            })
        );
    }

}
