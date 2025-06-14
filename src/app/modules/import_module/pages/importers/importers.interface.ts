import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ExternalMonitoringsAsList } from '../externalmonitorings/external-monitorings.interface';
import { ExternalSystemsAsList } from '../externalsystems/external-systems.interface';
import { DynamicalFormFields } from '../../../../components/dynamical-form-fields/dynamical-form-fields.interface';
import { ImportedHostRawData } from '../importedhosts/importedhosts.interface';

export interface ImportersIndexRoot extends PaginateOrScroll {
    importers: Importer[]
    _csrfToken: string
}

export interface Importer {
    id: number
    name: string
    container_id: number
    data_source?: string
    connected?: boolean | null
    description: string
    hostdefault_id: number
    container: string
    allowEdit: boolean
    config?: {
        mapping: {
            [key: string]: {
                key: string
                value: string
            }
        }
    }
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}

export function getDefaultImportersIndexParams(): ImportersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Importers.name',
        page: 1,
        direction: 'asc',
        'filter[Importers.id][]': [],
        'filter[Importers.name]': '',
        'filter[Importers.description]': ''
    }
}

export interface ImportersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Importers.id][]': [],
    'filter[Importers.name]': string
    'filter[Importers.description]': string
}


export interface ImportersGet {
    importer: ImportersPost
}


export interface ImportersPost {
    id?: number
    container_id: number | null
    name: string
    description: string
    data_source: string
    hostname_regex: string
    allow_empty_hosts: number
    disable_updates: number // only create new hosts
    force_disable_hosts: number // hosts
    re_enable_hosts: number // hosts
    force_delete: number // services
    keep_container_settings: number
    keep_satellite_settings: number
    config: {}
    hostdefault_id: number
    external_system_id: number | null
    external_monitorings: {
        _ids: number[]
    }

    [key: string]: any //dynamic fields
    importers_to_hostdefaults: ImportersToHostdefaults[]
}

export interface ImportersToHostdefaults {
    id?: number
    hostdefault_id?: number | null
    field: string
    regex: string
    order?: number // Only relevant to store the order in the database
}


export interface LoadElementsByContainerIdResponse {
    hostdefaults: {
        [key: string]: ImporterHostDefaultsResponse
    }
}

export interface ImporterHostDefaultsResponse {
    id: number
    name: string
    description: string
    container_id: number
    host_container_id: number
    hosttemplate_id: number
    satellite_id: number
    created: string
    modified: string
    hostdefaults_to_servicetemplates_external_monitoring: HostdefaultsToServicetemplatesExternalMonitoring[]
    hostdefaults_to_containers_sharing: HostdefaultsToContainersSharing[]
    hostdefaults_to_agentchecks: HostdefaultsToAgentcheck[]
    hostdefaults_to_servicetemplategroups: HostdefaultsToServicetemplategroup[]
    hostdefaults_to_servicetemplates: HostdefaultsToServicetemplate[]
    hosttemplate: HostdefaultHosttemplate
    container: HostdefaultContainer
}


export interface HostdefaultsToServicetemplate {
    id: number
    hostdefault_id: number
    field: string
    regex: string
    servicetemplate: HostdefaultServicetemplate
}


export interface HostdefaultsToServicetemplategroup {
    hostdefault_id: number
    field: string
    regex: string
    servicetemplategroup: HostdefaultsServicetemplategroup
}

export interface HostdefaultsServicetemplategroup {
    id: number
    container: HostdefaultContainer
}

export interface HostdefaultsToServicetemplatesExternalMonitoring {
    id: number
    hostdefault_id: number
    regex: string
    servicetemplate: HostdefaultServicetemplate
}

export interface HostdefaultServicetemplate {
    id: number
    template_name: string
}

export interface HostdefaultsToAgentcheck {
    id: number
    hostdefault_id: number
    regex: string
    agentcheck: HostdefaultAgentcheck
}

export interface HostdefaultAgentcheck {
    id: number
    name: string
}


export interface HostdefaultHosttemplate {
    id: number
    name: string
}


export interface HostdefaultContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
}


export interface HostdefaultsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

export interface ImporterElements {
    hostdefaults: {
        [key: string]: ImporterHostDefaultsResponse
    }
    externalsystems: ExternalSystemsAsList
    externalMonitorings: ExternalMonitoringsAsList
}

export interface ImporterConfig {
    config: {
        config: {
            mapping: {
                [key: string]: {
                    key: string
                    value: string
                }
            }
        }
        formFields: DynamicalFormFields
    }
}

export interface ImportersErrorMessageResponse {
    message: string
    errors: {
        notValidRawData: {
            error: string
            description: string
            invalidData: ImportedHostRawData[]
        }
    }
}

export interface ImportCsvDataResponse {
    response: {
        success: boolean
        message: string
        filename: string
        filenameOrigin: string
        previewData: CsvPreviewData
    }
    _csrfToken: any
}

export interface CsvPreviewData {
    headers: CsvHeaders
    rawData: ImportedHostRawData[]
    errors: CsvErrors
}

export interface CsvHeaders {
    mapping_identifier: CsvHeadersMappingFields
    mapping_hostname: CsvHeadersMappingFields
    mapping_address: CsvHeadersMappingFields
    mapping_description: CsvHeadersMappingFields
    mapping_software: CsvHeadersMappingFields
}

export interface CsvHeadersMappingFields {
    name: string
    exists: boolean
}

export interface CsvErrors {
    missingHeaderFields: MissingCsvHeaderFields
    notValidRawData: NotValidCsvRawData
}

export interface MissingCsvHeaderFields {
    error: string
    description: string
    invalidData: InvalidCsvData
}

export interface NotValidCsvRawData {
    error: string
    description: string
    invalidData: ImportedHostRawData[]
}

export interface InvalidCsvData {
    mapping_identifier: string
    mapping_hostname: string
    mapping_address: string
    mapping_description: string
    mapping_software: string
}

export interface CsvPreviewHeadersAsArray {
    key: string
    name: string
    exists: boolean
}

export interface GenericKeyValueFieldType {
    label: any
    value: any
    type: string
}
