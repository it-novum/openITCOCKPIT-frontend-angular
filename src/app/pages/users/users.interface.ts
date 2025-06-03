import { SelectKeyValue, SelectKeyValueString } from '../../layouts/primeng/select.interface';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { PermissionLevel } from './permission-level';
import { GenericIdAndName } from '../../generic.interfaces';

/****************************
 *    Generic interfaces    *
 ****************************/

export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: SelectKeyValueString[]
    defaultDateFormat: string,
    timezones: UserTimezonesSelect[],
    serverTime: string,
    serverTimeZone: string
}

export interface LoadUsersByContainerIdRoot {
    users: SelectKeyValue[]
}

export interface UserTimezoneGroup {
    // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    [key: string]: UserTimezone
}

export interface UserTimezone {
    // Africa/Abidjan: Abidjan
    [key: string]: string
}

export interface UserTimezonesSelect {
    group: string // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    value: string // Africa/Abidjan
    name: string // Abidjan
}

export interface UserType {
    title: string
    color: ('primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark')
    class: string
}

/**********************
 *    Login action    *
 **********************/
export interface LoginGetRoot {
    _csrfToken: string
    images: {
        description: string
        particles: string
        images: LoginImage[]
    }
    hasValidSslCertificate: boolean
    logoUrl: string
    isLoggedIn: boolean
    isSsoEnabled: boolean
    forceRedirectSsousersToLoginScreen: boolean
    errorMessages: any[]
    successMessages: any[]
    customLoginBackgroundHtml: string
    isCustomLoginBackground: boolean,
    disableAnimation: boolean,
    disableSocialButtons: boolean,
    enableColumnLayout: boolean
    demoMode?: boolean
}

export interface LoginImage {
    image: string
    credit: string
}

export interface LoadContainersResponse {
    containers: SelectKeyValue[]
    containerIdsWithWritePermissions: number[]
}

export interface UserIdAndUsername {
    id: number;
    username: string;
}

/**********************
 *    Index action    *
 **********************/

export interface UsersIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[full_name]': string,
    'filter[Users.email]': string,
    'filter[Users.phone]': string,
    'filter[Users.usergroup_id][]': number[],
    'filter[Users.company]': string,
}

export function getDefaultUsersIndexParams(): UsersIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'full_name',
        page: 1,
        direction: 'asc',
        'filter[full_name]': '',
        'filter[Users.email]': '',
        'filter[Users.phone]': '',
        'filter[Users.usergroup_id][]': [],
        'filter[Users.company]': '',
    }
}

export interface UsersIndexRoot extends PaginateOrScroll {
    all_users: AllUser[]
    myUserId: number
    isLdapAuth: boolean
    _csrfToken: string
}

export interface AllUser {
    id: number
    email: string
    company?: string
    phone?: string
    is_active: boolean
    samaccountname?: string
    is_oauth: boolean
    last_login?: string
    full_name: string
    usercontainerroles: UsersIndexUsercontainerrole[]
    containers: UsersIndexUserContainer
    usergroup: {
        id: number
        name: string
    }
    allow_edit: boolean
    UserTypes: UserType[]
}

export interface UsersIndexUsercontainerrole {
    id: number
    name: string
    _joinData: {
        id: number
        user_id: number
        usercontainerrole_id: number
        through_ldap: boolean
    }
    containers: UsersIndexContainer[]
}

export interface UsersIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: {
        id: number
        usercontainerrole_id: number
        container_id: number
        permission_level: number
    }
}

export interface UsersIndexUserContainer {
    id: number
    containertype_id: number
    name: string
    parent_id?: number
    lft: number
    rght: number
    _joinData: {
        id: number
        user_id: number
        container_id: number
        permission_level: number
    }
}

/**********************
 *    Add action    *
 **********************/
export interface UserPost {
    id?: number
    firstname: string
    lastname: string
    email: string
    phone: string
    is_active: 0 | 1
    showstatsinmenu: 0 | 1
    paginatorlength: number
    dashboard_tab_rotation: number
    company?: string | null
    department?: string | null
    position?: string | null
    recursive_browser: 0 | 1
    dateformat: string
    timezone: string
    i18n: string
    password?: string
    confirm_password?: string
    is_oauth: boolean  // (number for add but boolean for edit)

    image?: null | string

    samaccountname?: string
    ldap_dn?: string

    containers?: { // Edit only
        _ids: number[]
    }

    usergroup_id: number
    usercontainerroles: {
        _ids: number[]
    },
    usercontainerroles_ldap?: {
        _ids: number[]
    },
    ContainersUsersMemberships: {
        [key: number]: PermissionLevel
    }
    apikeys: UserAddEditApiKey[]
}

export interface UserAddEditApiKey {
    id?: number // edit only
    user_id?: number // edit only
    //index?: number // edit only
    last_use?: string | null // edit only
    apikey: string
    description: string
}

// The server response is a list of containers with their permissions,
// but we have to convert this into an array to make Angular for happy
export interface UserAddUserContainerRoleContainerPermissionsResponse {
    [key: string]: UserAddContainerRolePermission
}

export interface UserAddContainerRolePermission {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: {
        id: number
        usercontainerrole_id: number
        container_id: number
        permission_level: PermissionLevel
    }
    path: string,

    // Server response this as hahmap
    user_roles: {
        [key: string]: GenericIdAndName
    }

    // we use the array version in the Frontend to make Angular happy
    user_roles_array?: GenericIdAndName[]
}

export interface UserContainerPermission {
    container_id: number,
    container_name: string,
    permission_level: PermissionLevel
}

export interface UsersLdapUser {
    givenname: string
    sn: string
    samaccountname: string
    email: string
    dn: string
    memberof: string[]
    display_name: string
}

export interface UsersLdapUserDetails {
    givenname: string
    sn: string
    samaccountname: string
    email: string
    company: string
    department: string
    dn: string
    memberof: string[]
    display_name: string
    ldapgroups: UsersLdapGroup[]
    userContainerRoleContainerPermissionsLdap: UserAddUserContainerRoleContainerPermissionsResponse // Response
    userContainerRoleContainerPermissionsLdapArray?: UserAddContainerRolePermission[] // For Angular
    usergroupLdap: {
        id: number
        name: string
        description: string
        created: string
        modified: string
    }
}

export interface UsersLdapGroup {
    id: number
    cn: string
    dn: string
    description: string
}

export interface UsersEditResponse {
    user: UserPost
    isLdapUser: boolean
    UserTypes: UserType[]
    notPermittedContainerIds: number[]
    userContainerRolesReadonly: boolean
}
