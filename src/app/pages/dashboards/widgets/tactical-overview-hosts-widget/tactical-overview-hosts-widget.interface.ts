import { SummaryStateHosts } from '../../../hosts/summary_state.interface';

export interface TacticalOverviewHostsResponse {
    config: TacticalOverviewHostsConfig
    hoststatusSummary: SummaryStateHosts
    servicestatusSummary: any[]
    _csrfToken: string
}

export interface TacticalOverviewHostsConfig {
    Host: TacticalOverviewHostConfig
    Service: TacticalOverviewServiceConfig
    Hostgroup: {
        _ids: number[]
    }
    Servicegroup: {
        _ids: number[]
    }
}

export interface TacticalOverviewHostConfig {
    name: string
    name_regex: boolean
    address: string
    address_regex: boolean
    keywords: string
    not_keywords: string
}

export interface TacticalOverviewServiceConfig {
    servicename: string
    servicename_regex: boolean
    keywords: string
    not_keywords: string
}
