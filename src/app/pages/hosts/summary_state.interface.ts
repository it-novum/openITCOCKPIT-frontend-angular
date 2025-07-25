export interface SummaryState {
    state: number[]
    acknowledged: number[]
    in_downtime: number[]
    not_handled: number[]
    passive: number[]
    total: number
}

export interface StatusSummaryState {
    hosts: SummaryStateHosts
    services: SummaryStateServices
}

export interface SummaryStatesHosts {
    "0": number
    "1": number
    "2": number
    hostIds: number[][]
}

export interface SummaryUnhandledHosts {
    "0": number
    "1": number
    "2": number
    hostIds: number[][]
    totalHostIds: number[]
}


export interface SummaryStateHosts {
    state: SummaryStatesHosts
    acknowledged: SummaryStatesHosts
    in_downtime: SummaryStatesHosts
    not_handled: SummaryStatesHosts
    passive: SummaryStatesHosts
    total: number
}

export interface ServiceSummaryStatesServices {
    "0": number
    "1": number
    "2": number
    "3": number
    serviceIds: number[][]
}

export interface SummaryUnhandledServices {
    "0": number
    "1": number
    "2": number
    "3": number
    serviceIds: number[][]
    totalServiceIds: number[]
}

export interface SummaryStateServices {
    state: ServiceSummaryStatesServices
    acknowledged: ServiceSummaryStatesServices
    in_downtime: ServiceSummaryStatesServices
    not_handled: ServiceSummaryStatesServices
    passive: ServiceSummaryStatesServices
    total: number
}
