import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
} from '@coreui/angular';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { OpenstreetmapService } from '../openstreetmap.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../permissions/permission.directive';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OpenstreetmapToasterService } from './openstreetmap-toaster/openstreetmap-toaster.service';
import { OpenstreetmapToasterComponent } from './openstreetmap-toaster/openstreetmap-toaster.component';
import {
    FilterTemplate,
    OpenstreetmapAcls,
    OpenstreetmapIndexParams,
    OpenstreetmapIndexRoot,
    OpenstreetmapSettings,
    OpenstreetmapSettingsFilter
} from '../openstreetmap.interface';
import * as L from 'leaflet';
import './Hexbinlayer.interface';
import { chain } from 'lodash';
// @ts-ignore
import { leafletFullscreen } from './js/Leaflet.fullscreen.js';
// @ts-ignore
import { hexbinLayer } from './js/HexbinLayer.js';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';


@Component({
    selector: 'oitc-openstreetmap-index',
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        NavComponent,
        NavItemComponent,
        RowComponent,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        XsButtonDirective,
        ContainerComponent,
        FormDirective,
        FormsModule,
        TranslocoDirective,
        TrueFalseDirective,
        DebounceDirective,
        FormCheckComponent,
        OpenstreetmapToasterComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        NgxResizeObserverModule,
        AlertComponent,
        NgStyle,
        AsyncPipe
    ],
    templateUrl: './openstreetmap-index.component.html',
    styleUrl: './openstreetmap-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenstreetmapIndexComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor() {
    }

    //@ViewChild('map') lmap!: ElementRef<HTMLElement>

    private cdr = inject(ChangeDetectorRef);
    private readonly OpenstreetmapService = inject(OpenstreetmapService);
    public readonly PermissionsService = inject(PermissionsService);
    private readonly OpenstreetmapToasterService = inject(OpenstreetmapToasterService);
    private subscriptions: Subscription = new Subscription();
    public hideFilter: boolean = true;
    public hideMap: boolean = false;
    public stateFilter: number = 0;
    private includedLocations: number[] = [];
    public lmap: Signal<ElementRef<any>| undefined> = viewChild<ElementRef>("map");
    public map!: L.Map;
    public hexlayer!: L.HexbinLayer;
    private intervalId: any = null;
    private intervalSecs: number = 0;
    public initSettings: boolean = false;
    public initLocations: boolean = false;

    public indexParams: OpenstreetmapIndexParams = {
        'angular': true,
        'includedLocationId[]': this.includedLocations,
        'OpenstreetmapSetting[hide_empty_locations]': 0,
        'OpenstreetmapSetting[hide_not_monitored_locations]': 0,
        'OpenstreetmapSetting[state_filter]': 0
    }

    private filterTemplate: FilterTemplate = {
        up_ok: 1,
        warning: 2,
        down_critical: 4,
        unreachable_unknown: 8
    }

    public settingsFilter: OpenstreetmapSettingsFilter = {
        state_filter: null,
        filter: {
            up_ok: 1,
            warning: 2,
            down_critical: 4,
            unreachable_unknown: 8
        },
        hide_empty_locations: null,
        hide_not_monitored_locations: null
    }

    private acls!: OpenstreetmapAcls;
    public settings!: OpenstreetmapSettings;
    public mapData!: OpenstreetmapIndexRoot;
    public server_url: string | null = null;

    public leafletOptions: L.MapOptions = {
        zoom: 0,
        //center: L.latLng(0, 0),
        center: {
            lat: 0,
            lng: 0
        },
    };

    //  public layers: L.Layer[] = [];

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.clearRequestloop();
        this.subscriptions.unsubscribe();
    }

    public ngAfterViewInit(): void {

        this.map = L.map(this.lmap()?.nativeElement, this.leafletOptions);
        let self = this;
        const fullscreenControl = leafletFullscreen();
        const newCustomControl = L.Control.extend({
            options: {
                position: "topleft"
            },
            onAdd: () => {
                var container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
                container.title = 'Reset Map';
                container.onclick = function () {
                    self.resetMap();
                };
                return container;
            }
        });
        this.map.addControl(fullscreenControl);
        this.map.addControl(new newCustomControl());

        this.loadAclsAndSettings();
    }

    public loadAclsAndSettings(): void {
        this.subscriptions.add(
            this.OpenstreetmapService.getAclAndSettings().subscribe((aclAndSettings) => {
                this.acls = aclAndSettings.acl;
                this.settings = aclAndSettings.settings;
                this.intervalSecs = this.settings.reload_interval;
                this.server_url = this.settings.server_url;
                this.settingsFilter.state_filter = Number(this.settings.state_filter);
                this.settingsFilter.hide_empty_locations = Number(this.settings.hide_empty_locations);
                this.settingsFilter.hide_not_monitored_locations = Number(this.settings.hide_not_monitored_locations);
                this.settingsFilter.filter.up_ok = this.settingsFilter.state_filter & this.filterTemplate.up_ok;
                this.settingsFilter.filter.warning = this.settingsFilter.state_filter & this.filterTemplate.warning;
                this.settingsFilter.filter.down_critical = this.settingsFilter.state_filter & this.filterTemplate.down_critical;
                this.settingsFilter.filter.unreachable_unknown = this.settingsFilter.state_filter & this.filterTemplate.unreachable_unknown;
                this.initSettings = true;
                this.loadMapData();
                this.cdr.markForCheck();
            })
        );
    }

    public loadMapData(): void {
        this.indexParams['OpenstreetmapSetting[hide_empty_locations]'] = this.settingsFilter.hide_empty_locations;
        this.indexParams['OpenstreetmapSetting[hide_not_monitored_locations]'] = this.settings.hide_not_monitored_locations;
        this.indexParams['OpenstreetmapSetting[state_filter]'] = this.settingsFilter.state_filter;
        this.subscriptions.add(
            this.OpenstreetmapService.getIndex(this.indexParams).subscribe((mapData) => {
                this.mapData = mapData;
                this.initLocations = true;
                if(this.mapData.locations.length === 0  && this.mapData.locationPoints.length === 0){
                    this.hideMap = true;
                } else {
                    this.hideMap = false;
                }
                this.cdr.markForCheck();
                this.buildLayers();

                if (this.intervalId === null && this.intervalSecs >= 15) {
                    this.intervalId = setInterval(() => {
                        this.loadMapData();
                    }, this.intervalSecs * 1000);
                }
            })
        );
    }

    public buildLayers(): void {
        if (!this.server_url) {
            return;
        }
        if (!this.hasChanges(this.leafletOptions) && this.mapData.locationPoints.length > 0) {
            this.leafletOptions.zoom = this.map.getZoom();
            this.leafletOptions.center = this.map.getCenter();
            if (this.mapData.locationPoints.length > 0) {

                this.map.fitBounds(new L.LatLngBounds(this.mapData.locationPoints));
            }
        }

        L.tileLayer(this.settings.server_url, {
            maxNativeZoom: 18,
            maxZoom: 18,
            attribution: "&copy; <a target='_blank' href='http://openstreetmap.org/copyright'>OpenStreetMap</a> contributors | <a target='_blank' href='https://openitcockpit.io/'>openITCOCKPIT</a>",
            noWrap: false
        }).addTo(this.map);

        let cells = chain(this.mapData.locations).groupBy(function (location) {
            return location.container.id;
        }).map(function (values) {
            return {
                latitude: Number(values[0].latitude),
                longitude: Number(values[0].longitude),
                id: values[0].container.id,
                name: values[0].container.name,
                colorcode: values[0].colorcode
            };
        }).value();
        if (this.hexlayer) {
            this.hexlayer.removeFrom(this.map);
            //this.hexlayer.remove();
        }
        this.hexlayer = hexbinLayer({click: (pointData: any) => this.hexClick(pointData)}).addTo(this.map).data(cells);
    }

    public hexClick(pointData: any) {
        let containderIds: number[] = [];
        pointData.map((point: any) => {
            containderIds.push(point.o.id);
        });
        this.OpenstreetmapToasterService.setContainerIdsToaster(containderIds);
    }

    public resetMap(): void {
        if (this.mapData.locationPoints.length > 0) {
            this.map.fitBounds(new L.LatLngBounds(this.mapData.locationPoints));
        }
    }

    public refresh() {
        this.loadMapData();
    }

    private hasChanges(mapOptions: L.MapOptions) {
        if (mapOptions.zoom === 0) {
            return false;
        }
        if (mapOptions.zoom !== this.map.getZoom()) {
            return true;
        }
        // @ts-ignore
        if (mapOptions.center.lat !== this.map.getCenter()['lat'] && mapOptions.center.lng !== this.map.getCenter()['lng']) {
            return true;
        }
        return false;

    }

    public onFilterChange(event: Event) {
        this.clearRequestloop();
        this.settingsFilter.state_filter = this.settingsFilter.filter.up_ok |
            this.settingsFilter.filter.warning |
            this.settingsFilter.filter.down_critical |
            this.settingsFilter.filter.unreachable_unknown;
        this.loadMapData();
        setTimeout(() => {
            this.resetMap()
        }, 700);

    }

    public resetFilter(): void {
        this.clearRequestloop();
        this.initFilter();
        this.loadAclsAndSettings();
        this.cdr.markForCheck();
    }


    private initFilter() {
        this.settingsFilter = {
            state_filter: null,
            filter: {
                up_ok: 1,
                warning: 2,
                down_critical: 4,
                unreachable_unknown: 8
            },
            hide_empty_locations: null,
            hide_not_monitored_locations: null
        };
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    public problemsOnly() {
        this.clearRequestloop();
        this.settingsFilter.state_filter = this.settingsFilter.filter.warning |
            this.settingsFilter.filter.down_critical |
            this.settingsFilter.filter.unreachable_unknown;
        this.settingsFilter.filter.up_ok = this.settingsFilter.state_filter & this.filterTemplate.up_ok;
        this.settingsFilter.filter.warning = this.settingsFilter.state_filter & this.filterTemplate.warning;
        this.settingsFilter.filter.down_critical = this.settingsFilter.state_filter & this.filterTemplate.down_critical;
        this.settingsFilter.filter.unreachable_unknown = this.settingsFilter.state_filter & this.filterTemplate.unreachable_unknown;
        this.loadMapData();
    }

    protected clearRequestloop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

}
