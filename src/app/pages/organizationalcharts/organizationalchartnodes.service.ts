import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class OrganizationalChartNodesService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public loadUsers(containerId: number): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            users: SelectKeyValue[]
        }>(`${proxyPath}/OrganizationalChartNodes/loadUsers/${containerId}.json`).pipe(
            map(data => {
                return data.users;
            })
        )
    }
}
