import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { Design, DesignsEditRoot, ResetLogoResponse } from './designs.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class DesignsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getMode(): Observable<DesignsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<DesignsEditRoot>(`${proxyPath}/design_module/designs/view.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getEdit(): Observable<DesignsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<DesignsEditRoot>(`${proxyPath}/design_module/designs/edit.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveDesign(design: Design): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/design_module/designs/edit.json?angular=true`, {
            Design: design
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.user as GenericIdResponse
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

    public resetColours(): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/design_module/designs/reset.json`, {
            params: {
                angular: 'true',
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.user as GenericIdResponse
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

    public resetLogo(type: number): Observable<ResetLogoResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResetLogoResponse>(`${proxyPath}/design_module/uploads/resetLogo.json`, {
            params: {
                angular: 'true',
                type: type
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
