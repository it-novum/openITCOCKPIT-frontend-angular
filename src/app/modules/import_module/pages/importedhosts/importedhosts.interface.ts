import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Importer } from '../importers/importers.interface';
import { HosttemplatePost } from '../../../../pages/hosttemplates/hosttemplates.interface';
import { SatelliteEntity } from '../../../distribute_module/pages/satellites/satellites.interface';
import { HostEntity } from '../../../../pages/hosts/hosts.interface';
import { AgentcheckPost } from '../../../../pages/agentchecks/agentchecks.interface';
import { ContainerEntity } from '../../../../pages/containers/containers.interface';
import { ServicetemplateEntity } from '../../../../pages/servicetemplates/servicetemplates.interface';
import { ServiceObject } from '../../../../pages/services/services.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface ImportedhostsIndexRoot extends PaginateOrScroll {
    importedhosts: Importedhost[]
    maxUploadLimit: MaxUploadLimit
    //importers: Importer[] Removed ITC-3512
    _csrfToken: string
}

export interface Importedhost {
    id: number
    host_id: number | null
    name: string
    address: string
    identifier: string
    container_id: number
    satellite_id: number
    description: string
    flags: number
    created: string
    modified: string
    full_name: string
    imported: number
    disabled: number
    ready_for_import: number
    imported_services: ImportedService[]
    host: HostEntity
    imported_hosts_to_agentchecks: ImportedHostsToAgentcheck[]
    imported_hosts_to_servicetemplategroups: ImportedHostsToServicetemplategroup[]
    imported_hosts_to_servicetemplates: ImportedHostsToServicetemplate[]
    imported_hosts_to_containers_sharing: ImportedHostsToContainersSharing[]
    user: {
        id: number
    } | null
    imported_file: any
    importer: Importer
    hosttemplate: HosttemplatePost
    container: string
    readonly: boolean
    satellite?: SatelliteEntity
    allowEdit: boolean
    services_overview: ServicesOverview
    external_services_overview: ServicesOverviewByType
    oitc_agent_services_overview: ServicesOverviewByType
    progress: ImportedhostProgress
}

export interface ServicesOverview {
    new: {
        [key: number]: string
    }
    to_delete: ServiceObject[]
    not_deletable: ServiceObject[]
}

export interface ServicesOverviewByType {
    new: SelectKeyValue[]
    to_delete: ServiceObject[]
    not_deletable: ServiceObject[]
}

export interface ImportedService {
    id: number
    importedhost_id: number
    service_id?: number
    servicetemplate_id: number
    external_monitoring_id: number
    identifier: string
    name: string
    description?: string
    check_interval: any
    freshness_threshold?: number
    servicetype_id: number
    json_data?: string
    created: string
    modified: string
}

export interface ImportedHostsToAgentcheck {
    id: number
    importedhost_id: number
    agentcheck_id: number
    regex: string
    agentcheck: AgentcheckPost
}

export interface ImportedHostsToServicetemplategroup {
    id: number
    uuid: string
    container_id: number
    description: string
    created: string
    modified: string
    _joinData: ImportedHostsToServicetemplategroupJoinData
    servicetemplates: ServicetemplateEntity[]
    container: ContainerEntity
}

export interface ImportedHostsToServicetemplategroupJoinData {
    id: number
    importedhost_id: number
    servicetemplategroup_id: number
}

export interface ImportedHostsToServicetemplate {
    id: number
    uuid: string
    template_name: string
    name: string
    container_id: number
    servicetemplatetype_id: number
    check_period_id: number
    notify_period_id: number
    description: string
    command_id: number
    check_command_args: string
    checkcommand_info: string
    eventhandler_command_id: number
    timeperiod_id: any
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_warning: number
    notify_on_unknown: number
    notify_on_critical: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number
    flap_detection_on_unknown: number
    flap_detection_on_critical: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_checks_enabled: number
    freshness_threshold: number
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    tags: string
    service_url?: string
    sla_relevant: number
    is_volatile: number
    check_freshness: number
    created: string
    modified: string
    _joinData: ImportedHostsToServicetemplateJoinData
}

export interface ImportedHostsToServicetemplateJoinData {
    id: number
    importedhost_id: number
    servicetemplate_id: number
}


export interface ImportedHostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: ImportedHostsToContainerJoinData
}


export interface ImportedHostsToContainerJoinData {
    id: number
    importedhost_id: number
    container_id: number
}

export interface ImportedhostProgress {
    state: number
    comments: string[]
}

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
}


export interface ImportedHostIndex {
    id: number
    name: string
    description: string
    container_id: number
    allowEdit: boolean
}


export interface ImportedhostsIndexParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc' | '' // asc or desc
    'filter[ImportedHosts.id][]': []
    'filter[ImportedHosts.name]': string
    'filter[ImportedHosts.address]': string
    'filter[ImportedHosts.description]': string
    'filter[ImportedHosts.importer_id][]': []
    'filter[ImportedHosts.flags]': number | string
    'filter[imported]': boolean | string
    'filter[ready_for_import]': boolean | string
    'filter[not_ready_for_import]': boolean | string
    'filter[disabled]': boolean | string
}

export function getDefaultImportedHostsIndexParams(): ImportedhostsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ImportedHosts.name',
        page: 1,
        direction: 'asc',
        'filter[ImportedHosts.id][]': [],
        'filter[ImportedHosts.name]': '',
        'filter[ImportedHosts.address]': '',
        'filter[ImportedHosts.description]': '',
        'filter[ImportedHosts.importer_id][]': [],
        'filter[ImportedHosts.flags]': '',
        'filter[imported]': true,
        'filter[disabled]': false,
        'filter[ready_for_import]': true,
        'filter[not_ready_for_import]': true
    }
}

export interface ImportDataResponse {
    response: {
        rawData: ImportedHostRawData[]
        success: boolean
        message: string
        errors: any[]
    }
    _csrfToken: any
}

export interface ImportedHostRawData {
    identifier: string
    hostname: string
    address: string
    description: string
    software: string
    external_services?: any[]
}

export interface NotValidRawData {
    error: string
    description: string
}


/**********************
 *    Edit action    *
 **********************/

export interface ImportedHostPost {
    id: number
    importer_id: number
    user_id: number
    host_id: number
    identifier: string
    name: string
    description: string
    address: string
    container_id: number
    hosttemplate_id: number
    satellite_id: number
    importedfile_id: number | null
    flags: number
    created: string
    modified: string
    host: {
        id: number
        disabled: number
    }
    imported_hosts_to_agentchecks: ImportedhostAgentcheck[]
    imported_hosts_to_servicetemplategroups: {
        _ids: number[]
    }
    imported_hosts_to_servicetemplates: {
        _ids: number[]
    }
    imported_hosts_to_containers_sharing: {
        _ids: number[]
    }
    readonly: boolean
}

export interface ImportedhostAgentcheck {
    id: number,
    importedhost_id: number
    agentcheck_id: number
    regex: string
}


export interface ImportedHostElements {
    sharingContainers: SelectKeyValue[]
    hosttemplates: SelectKeyValue[]
    servicetemplates: SelectKeyValue[]
    servicetemplategroups: SelectKeyValue[]
    satellites: SelectKeyValue[]
    agentchecks: SelectKeyValue[]

}

export interface ImportDataResponse {
    rawData: any[]
    errors: ImportDataErrors
    success: boolean
    message: string
}

export interface ImportDataErrors {
    notValidRawData: NotValidRawData
}

export interface NotValidRawData {
    error: string
    description: string
    invalidData: any[]
}
