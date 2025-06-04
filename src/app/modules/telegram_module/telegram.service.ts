import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericActionErrorResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import {
    ContactAccessKeyResponse,
    GetTelegramSettings,
    TelegramChatResponse,
    TelegramSettings,
    TelegramSettingsPostResponse,
    TestMessageResponse
} from './telegram.interface';

@Injectable({
    providedIn: 'root'
})
export class TelegramService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    getTelegramSettings(): Observable<GetTelegramSettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<GetTelegramSettings>(`${proxyPath}/telegram_module/TelegramSettings/index.json`, {
            params: {
                angular: true
            }
        });
    }

    setTelegramSettings(settings: TelegramSettings): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<TelegramSettingsPostResponse>(`${proxyPath}/telegram_module/TelegramSettings/index.json?angular=true`,
            settings
        ).pipe(
            map((data: TelegramSettingsPostResponse): any => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.telegramSettings
                };
            }),
            catchError((error: any) => {
                let err = error.error as GenericActionErrorResponse;
                if (error.error.hasOwnProperty('error')) {
                    err = error.error.error as GenericActionErrorResponse;
                }
                return of({
                    success: false,
                    data: err
                });
            })
        );
    }

    generateAccessKeyForContact(contactUuid: string): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<ContactAccessKeyResponse>(`${proxyPath}/telegram_module/TelegramSettings/genKey.json?angular=true`, {
            contact_uuid: contactUuid
        }).pipe(
            map((data: ContactAccessKeyResponse): any => {
                return {
                    success: true,
                    data: data.contactsAccessKeys
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

    removeAccessKeyForContact(contactUuid: string): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<ContactAccessKeyResponse>(`${proxyPath}/telegram_module/TelegramSettings/rmKey.json?angular=true`, {
            contact_uuid: contactUuid
        }).pipe(
            map((data: ContactAccessKeyResponse): any => {
                return {
                    success: true,
                    data: data.contactsAccessKeys
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

    deleteChat(chatId: number): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<TelegramChatResponse>(`${proxyPath}/telegram_module/TelegramSettings/rmChat.json?angular=true`, {
            id: chatId
        }).pipe(
            map((data: TelegramChatResponse): any => {
                return {
                    success: true,
                    data: data.chats
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

    sendTestChatMessage(chatId: number): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;

        return this.http.post<TestMessageResponse>(`${proxyPath}/telegram_module/TelegramSettings/sendTestChatMessage.json?angular=true`, {
            id: chatId
        }).pipe(
            map((data: TestMessageResponse): any => {
                return {
                    success: data.success,
                    data: data.responseMessage
                };
            }),
            catchError((error: any) => {
                return of({
                    success: false,
                    data: 'Error sending test message'
                });
            })
        );
    }

}
