import { Routes } from '@angular/router';

export const mapModuleRoutes: Routes = [
    {
        path: 'map_module/maps/index',
        loadComponent: () => import('./pages/maps/maps-index/maps-index.component').then(m => m.MapsIndexComponent)
    },
    {
        path: 'map_module/maps/add',
        loadComponent: () => import('./pages/maps/maps-add/maps-add.component').then(m => m.MapsAddComponent)
    },
    {
        path: 'map_module/maps/edit/:id',
        loadComponent: () => import('./pages/maps/maps-edit/maps-edit.component').then(m => m.MapsEditComponent)
    },
    {
        path: 'map_module/maps/copy/:ids',
        loadComponent: () => import('./pages/maps/maps-copy/maps-copy.component').then(m => m.MapsCopyComponent)
    },
    {
        path: 'map_module/mapeditors/edit/:id',
        loadComponent: () => import('./pages/mapeditors/mapeditors-edit/mapeditors-edit.component').then(m => m.MapeditorsEditComponent)
    },
    {
        path: 'map_module/mapeditors/view/:id/:fullscreen/:rotation/:interval',
        loadComponent: () => import('./pages/mapeditors/mapeditors-view/mapeditors-view.component').then(m => m.MapeditorsViewComponent),
    },
    {
        path: 'map_module/mapeditors/view/:id/:fullscreen/:rotation',
        loadComponent: () => import('./pages/mapeditors/mapeditors-view/mapeditors-view.component').then(m => m.MapeditorsViewComponent),
    },
    {
        path: 'map_module/mapeditors/view/:id/:fullscreen',
        loadComponent: () => import('./pages/mapeditors/mapeditors-view/mapeditors-view.component').then(m => m.MapeditorsViewComponent),
    },
    {
        path: 'map_module/mapeditors/view/:id',
        loadComponent: () => import('./pages/mapeditors/mapeditors-view/mapeditors-view.component').then(m => m.MapeditorsViewComponent),
    },
    {
        path: 'map_module/rotations/index',
        loadComponent: () => import('./pages/rotations/rotations-index/rotations-index.component').then(m => m.RotationsIndexComponent)
    },
    {
        path: 'map_module/rotations/add',
        loadComponent: () => import('./pages/rotations/rotations-add/rotations-add.component').then(m => m.RotationsAddComponent)
    },
    {
        path: 'map_module/rotations/edit/:id',
        loadComponent: () => import('./pages/rotations/rotations-edit/rotations-edit.component').then(m => m.RotationsEditComponent)
    },
    {
        path: 'map_module/mapgenerators/index',
        loadComponent: () => import('./pages/mapgenerators/mapgenerators-index/mapgenerators-index.component').then(m => m.MapgeneratorsIndexComponent)
    },
    {
        path: 'map_module/mapgenerators/add',
        loadComponent: () => import('./pages/mapgenerators/mapgenerators-add/mapgenerators-add.component').then(m => m.MapgeneratorsAddComponent)
    },
    {
        path: 'map_module/mapgenerators/edit/:id',
        loadComponent: () => import('./pages/mapgenerators/mapgenerators-edit/mapgenerators-edit.component').then(m => m.MapgeneratorsEditComponent)
    },
    {
        path: 'map_module/mapgenerators/generate/:id',
        loadComponent: () => import('./pages/mapgenerators/mapgenerators-generate/mapgenerators-generate.component').then(m => m.MapgeneratorsGenerateComponent)
    },
];
