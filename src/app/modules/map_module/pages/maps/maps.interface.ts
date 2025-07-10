import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../../generic-responses';
import { Container } from '../../../../pages/containers/containers.interface';

export interface MapsIndexRoot extends PaginateOrScroll {
    all_maps: Map[]
    _csrfToken: string
}

/*******************************
 *    Definition of Map        *
 ******************************/

export interface Map {
    id: number
    name: string
    title: string
    object_id?: number
    background?: string | null
    background_x?: number | null
    background_y?: number | null
    background_size_x?: number | null
    background_size_y?: number | null
    refresh_interval?: number
    json_data?: string
    created?: string
    modified?: string
    containers?: MapContainer[]
    allowEdit?: boolean
    allowCopy?: boolean
    _joinData?: MapRotationJoinData
}

export interface MapRotationJoinData {
    id: number
    map_id: number
    rotation_id: number
}

export interface MapContainer extends Container {
    _joinData: MapContainerJoinData
}

export interface MapContainerJoinData {
    id: number
    container_id: number
    map_id: number
}


export interface MapsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Maps.name]': string,
    'filter[Maps.title]': string,
    'filter[Maps.id][]': number[],
}

export function getDefaultMapsIndexParams(): MapsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Maps.name',
        page: 1,
        direction: 'asc',
        'filter[Maps.name]': "",
        'filter[Maps.title]': "",
        'filter[Maps.id][]': [],
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface MapPost {
    Map: MapEdit
}

export interface MapEdit {
    name: string
    title: string
    refresh_interval: number
    containers: {
        _ids: number[]
    },
    satellites: {
        _ids: number[]
    }
    id?: number
    background?: any
    json_data?: any
    created?: string
    modified?: string
}

export interface LoadSatellitesRoot {
    satellites: SelectKeyValue[]
    _csrfToken: string
}

export interface MapsEditRoot {
    map: MapPost
    areContainersChangeable: boolean;
    requiredContainers: number[];
    _csrfToken: any
}

export interface MapCopyGet {
    id: number
    name: string
    title: string
    refresh_interval: number
    containers: MapContainer[]
}

export interface MapCopyPost {
    Source: Source
    Map: MapCopyPostMap
    Error: GenericValidationError | null
}

export interface Source {
    id: number
    name: string
    title: string
    refresh_interval: number
}

export interface MapCopyPostMap {
    name: string
    title: string
    refresh_interval: number
}




