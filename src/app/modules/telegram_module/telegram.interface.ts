import { GenericValidationError } from  '../../generic-responses';

export interface GetTelegramSettings {
    telegramSettings: TelegramSettings,
    contacts: Contact[],
    contactsAccessKeys: ContactAccessKey[],
    chats: TelegramChat[],
    _csrfToken: any
}

export interface TelegramSettingsPostResponse {
    telegramSettings: TelegramSettings
    error: GenericValidationError | null
}

export interface TelegramSettings {
    token: string,
    access_key: string,
    two_way: boolean,
    use_proxy: boolean,
    external_webhook_domain: string,
    webhook_api_key: string,
}

export interface Contact {
    id: number,
    uuid: string,
    name: string
}

export interface ContactAccessKey {
    contact_uuid: string,
    access_key: string
}

export interface TelegramChat {
    id: number,
    contact_uuid: string,
    started_from_username: string
}

export interface ContactAccessKeyResponse {
    contactsAccessKeys: ContactAccessKey[]
}

export interface TelegramChatResponse {
    chats: TelegramChat[]
}

export interface TestMessageResponse {
    success: boolean,
    responseMessage: string
}
