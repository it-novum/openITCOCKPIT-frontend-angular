/**********************
 *    Entity / Index action    *
 **********************/

import { ImportObjectTypesEnum } from './import-object-types.enum';


export interface ImportChangelogsEntityParams {
    angular: true,
    scroll: boolean,
    page: number,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
    'filter[Changelogs.object_id]': any,
    'filter[Changelogs.objecttype_id]': ImportObjectTypesEnum[]
    'filter[Changelogs.action][]': string[],
    'filter[ShowServices]': number
}


export function getDefaultImportChangelogsEntityParams(): ImportChangelogsEntityParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        page: 1,
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 1000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
        'filter[Changelogs.object_id]': null,
        'filter[Changelogs.objecttype_id]': [],
        'filter[ShowServices]': 0,
        'filter[Changelogs.action][]': [],
    }
}
