import { ContextActionType, MapItemType } from './map-item-base.enum';
import { Map } from '../../pages/maps/maps.interface';

/********************************
 * Item Base
 ********************************/

export interface MapitemBase {
    id: number
    map_id: number
    x: number
    y: number
    z_index?: string
    display?: boolean
    startX?: number
    startY?: number
    endX?: number
    endY?: number
}

export interface ContextAction {
    type: ContextActionType
    data: MapitemBase
    itemType: MapItemType
    item?: any // to send the item for edit
}

export interface MapitemBaseActionObject {
    data: MapitemBase
    action: string
    type: MapItemType
}

export interface ResizedEvent {
    id: number
    mapId: number
    itemType: MapItemType
    width: number
    height: number
}


/********************************
 * Items
 ********************************/


export interface MapItemRootParams {
    angular: true,
    disableGlobalLoader: true,
    objectId: number,
    mapId: number,
    type: string,
    includeServiceOutput?: true
}

export interface MapItemRoot {
    type?: string
    allowView?: boolean
    data: DataForMapItem
    _csrfToken?: string
}

export interface MapItemRootForMapItem {
    data: {
        type?: string
        allowView?: boolean
        data: DataForMapItem
        _csrfToken?: string
    }
}

export interface DataForMapItem {
    BitMaskHostState?: number
    BitMaskServiceState?: number
    icon?: string
    icon_property?: string
    isAcknowledged?: boolean
    isInDowntime?: boolean
    color?: string
    background?: string
    Host: HostForMapItem
    Hoststatus?: HoststatusForMapItem
    Service: ServiceForMapItem
    Perfdata: Perfdata
    Servicestatus: ServicestatusForMapItem
    Hostgroup?: HostgroupForMapItem
    Servicegroup?: ServicegroupForMapItem
    Map?: Map
}

export interface HostForMapItem {
    id: number
    uuid: string
    hostname: string
    address: string
    description: string
    hosttemplate_id: number
    active_checks_enabled: boolean
    satelliteId: number
    containerId: number
    containerIds: number[]
    tags: string
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    priority: number
    notes: string
    is_satellite_host: boolean
    name: string
}

export interface HoststatusForMapItem {
    currentState: number
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: number
    lastHardState: any
    lastHardStateChange: string
    last_state_change: string
    output: any
    long_output: any
    perfdata?: string
    acknowledgement_type: any
    state_type: any
    flap_detection_enabled: number
    notifications_enabled: number
    current_check_attempt: any
    max_check_attempts: number
    latency: any
    last_time_up: string
    UserTime?: any
    lastHardStateChangeInWords?: string
    last_state_change_in_words?: string
    lastCheckInWords?: string
    nextCheckInWords?: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
}

export interface ServiceForMapItem {
    id: number
    uuid: string
    servicename: string
    hostname: string
    description: any
    active_checks_enabled: any
    tags: any
    host_id: number
    usageFlag?: number
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: any
}

export interface Perfdata {
    [key: string]: PerformanceData
}

export interface PerformanceData {
    current: string
    unit: string
    warning: string
    critical: string
    min: string
    max: string
    metric: string
    datasource?: Datasource
    prometheus?: Prometheus
}

export interface Prometheus {
    instance: string
    job: string
    service: string
    uuid: string
}

export interface Datasource {
    setup: Setup
}

export interface Setup {
    metric: Metric
    scale: Scale
    warn: Threshold
    crit: Threshold
}

export interface Metric {
    value: number
    unit: string
    name: string
}

export interface Scale {
    min: number
    max: number
    type: string
}

export interface Threshold {
    low: number | null
    high: any
}

export interface ServicestatusForMapItem {
    currentState: number
    lastHardState: any
    isFlapping: boolean
    problemHasBeenAcknowledged: boolean
    scheduledDowntimeDepth: number
    lastCheck: string
    nextCheck: string
    activeChecksEnabled: any
    lastHardStateChange: string
    last_state_change: string
    processPerformanceData: any
    state_type: any
    acknowledgement_type: any
    flap_detection_enabled: any
    notifications_enabled: any
    current_check_attempt: number
    output: string
    long_output: any
    perfdata: string
    latency: any
    max_check_attempts: number
    last_time_ok: string
    UserTime?: any
    lastHardStateChangeInWords?: string
    last_state_change_in_words?: string
    lastCheckInWords?: string
    nextCheckInWords?: string
    isHardstate: boolean
    isInMonitoring: boolean
    humanState: string
    cssClass: string
    textClass: string
    outputHtml: string
    longOutputHtml?: string
}

export interface HostgroupForMapItem {
    id: number
    name: string
    description: string
}

export interface ServicegroupForMapItem {
    id: number
    name: string
    description: string
}


