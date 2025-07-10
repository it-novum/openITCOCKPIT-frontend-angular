import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../../../../pages/containers/containers.interface';
import { Map } from '../maps/maps.interface';

export interface MapgeneratorsIndexRoot extends PaginateOrScroll {
    all_mapgenerators: Mapgenerator[]
    _csrfToken: string
}

/*********************************
 *    Definition of Mapgenerator *
 ********************************/

export interface Mapgenerator {
    id: number
    name: string
    description: string
    interval: number
    type: number
    items_per_line: number
    created: string
    modified: string
    containers: MapgeneratorContainer[]
    maps?: Map[] | number[]
    allowEdit?: boolean
}

export interface MapgeneratorContainer extends Container {
    _joinData: MapgeneratorContainerJoinData
}

export interface MapgeneratorContainerJoinData {
    id: number
    container_id: number
    mapgenerator_id: number
}

export interface MapgeneratorsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Mapgenerators.name]': string,
    'filter[has_generated_maps]': string
    'filter[Mapgenerators.description]': string,
}

export function getDefaultMapgeneratorsIndexParams(): MapgeneratorsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Mapgenerators.name',
        page: 1,
        direction: 'asc',
        'filter[Mapgenerators.name]': "",
        'filter[has_generated_maps]': "",
        'filter[Mapgenerators.description]': ""
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface MapgeneratorPost {
    Mapgenerator: MapgeneratorEdit
}

export interface MapgeneratorEdit {
    name: string
    description: string
    interval: number
    items_per_line: number
    type: number
    containers: {
        _ids: number[]
    }
}

export interface MapgeneratorsEditRoot {
    mapgenerator: Mapgenerator
    _csrfToken: string
}

export interface MapgeneratorGenerateRoot {
    generatedMapsAndItems: GeneratedMapsAndItems
    _csrfToken: string
}

export interface GeneratedMapsAndItems {
    amountOfTotalMaps: number
    amountOfNewGeneratedMaps: number
    amountOfNewGeneratedItems: number
    maps: number[]
    newMaps: number[]
}



