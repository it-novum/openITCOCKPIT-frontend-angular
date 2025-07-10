import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../../../../pages/containers/containers.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { Map } from '../maps/maps.interface';

export interface RotationsIndexRoot extends PaginateOrScroll {
    all_rotations: Rotation[]
    _csrfToken: string
}

/*******************************
 *    Definition of Rotation  *
 ******************************/

export interface Rotation {
    id: number
    name: string
    interval: number
    created: string
    modified: string
    containers: RotationContainer[]
    maps: Map[]
    allowEdit?: boolean
    ids?: string
    first_id?: number
}

export interface RotationContainer extends Container {
    _joinData: RotationContainerJoinData
}

export interface RotationContainerJoinData {
    id: number
    container_id: number
    rotation_id: number
}

export interface RotationsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Rotations.name]': string,
    'filter[Rotations.interval]': string,
}

export function getDefaultRotationsIndexParams(): RotationsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Rotations.name',
        page: 1,
        direction: 'asc',
        'filter[Rotations.name]': "",
        'filter[Rotations.interval]': "",
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface RotationPost {
    Rotation: RotationEdit
}

export interface RotationEdit {
    name: string
    interval: number
    container_id: number[]
    Map: number[]
}

export interface LoadMapsRoot {
    maps: SelectKeyValue[]
    _csrfToken: any
}

export interface RotationsEditRoot {
    rotation: Rotation
    areContainersChangeable: boolean
    requiredContainers: number[]
    _csrfToken: string
}

export interface LoadMapsByContainerIdRequest {
    'containerIds[]': number[]
}



