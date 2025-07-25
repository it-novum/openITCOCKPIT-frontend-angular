import { ContainerTypesEnum } from '../changelogs/object-types.enum';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Edge, Node } from 'vis-network';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface Container {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}

export interface ContainerParentCanBeNull {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number | null
    rght: number
}

// Just an alias for the Container interface
export interface ContainerEntity extends Container {
}

export interface ContainerWithPath extends Container {
    path?: string
}

export interface ContainerWithHostJoinData extends Container {
    id: number
    host_id: number
    container_id: number
}

export interface ContainerWithContactJoinData extends Container {
    id: number
    contact_id: number
    container_id: number
}

/**********************
 *     Global action    *
 **********************/

export interface ContainersLoadContainersByStringParams {
    'angular': true,
    'filter[Containers.name]': string,
    onlyWritePermissions?: true
}

/**********************
 *    Index action    *
 **********************/
export interface ContainersIndexRoot {
    nest: ContainersIndexNested[],
    _csrfToken: string
}

export interface ContainersIndexNested {
    Container: ContainersIndexContainer
    children: ContainersIndexNested[]
}

export interface ContainersIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    linkedId: number
    allowEdit: boolean
    elements?: number
    hosts?: number
    hosttemplates?: number
    services?: number
    servicetemplates?: number
    contacts?: number
}


export interface DataForCreateContainerModal {
    parentContainerId: number
    parentContainerTypeId: ContainerTypesEnum
}

/**********************
 *     Add action     *
 **********************/
export interface NodePost {
    id?: number
    containertype_id: ContainerTypesEnum
    parent_id?: number
    name: string
}

/**********************
 * ShowDetails action *
 **********************/

export enum ContainerShowDetailsObjectTypesEnum {
    hosts = 'hosts',
    hosttemplates = 'hosttemplates',
    hostgroups = 'hostgroups',
    servicetemplates = 'servicetemplates',
    servicetemplategroups = 'servicetemplategroups',
    servicegroups = 'servicegroups',
    timeperiods = 'timeperiods',
    contacts = 'contacts',
    contactgroups = 'contactgroups',
    users = 'users',
    usercontainerroles = 'usercontainerroles',
    hostdependencies = 'hostdependencies',
    hostescalations = 'hostescalations',
    servicedependencies = 'servicedependencies',
    serviceescalations = 'serviceescalations',
    instantreports = 'instantreports',
    autoreports = 'autoreports',
    satellites = 'satellites',
    maps = 'maps',
    grafana_userdashboards = 'grafana_userdashboards',
}

export interface ContainerShowDetailsObjectDetails {
    objectType: ContainerShowDetailsObjectTypesEnum,
    label: string,
    icon: IconProp,
    rights: string[],
    baseRoute: string
}

export interface ContainerShowDetailsRootResult {
    containersWithChilds: ContainerDetailsWithChilds[]
    _csrfToken: string
}

export interface ContainerDetailsWithChilds {
    id: number
    parent_id: number,
    name: string,
    containertype_id: ContainerTypesEnum,
    lft: number,
    rght: number,
    childsElements?: ContainerChildElements
}

export type  ContainerChildElements = {
    [key in ContainerShowDetailsObjectTypesEnum]: {  // 'hosts' or 'hostgroups' etc
        [key: string]: string                        // object id "5" => object name "default host"
    }
}

/**************************
 * ShowDetails Map action *
 **************************/
export interface ContainerShowDetailsTreeRootResult {
    containerMap: {
        nodes: Node[]
        edges: Edge[]
        cluster: any[]
    }
    _csrfToken: string
}

/**************************
 * Load Containers        *
 **************************/

export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}
