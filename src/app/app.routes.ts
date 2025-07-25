import { Component, inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { authGuard } from "./auth/auth.guard";
import { snmpTrapModuleRoutes } from './modules/snmp_trap_module/snmp_trap_module.routes';
import { distributeModuleRoutes } from './modules/distribute_module/distribute_module.routes';
import { msteamsModuleRoutes } from './modules/msteams_module/msteams_module.routes';
import { nagiosModuleRoutes } from './modules/nagios_module/nagios_module.routes';
import { pagerdutyModuleRoutes } from './modules/pagerduty_module/pagerduty_module.routes';
import { slaModuleRoutes } from './modules/sla_module/sla_module.routes';
import { importModuleRoutes } from './modules/import_module/import_module.routes';
import { customalertModuleRoutes } from './modules/customalert_module/customalert_module.routes';
import { checkmkModuleRoutes } from './modules/checkmk_module/checkmk_module.routes';
import { mapModuleRoutes } from './modules/map_module/map_module.routes';
import { eventcorrelationModuleRoutes } from './modules/eventcorrelation_module/eventcorrelation_module.routes';
import { printerModuleRoutes } from './modules/printer_module/printer_module.routes';
import { vmwaresnapshotModuleRoutes } from './modules/vmwaresnapshot_module/vmwaresnapshot_module.routes';
import { db2ModuleRoutes } from './modules/db2_module/db2_module.routes';
import { vmwarehorizonModuleRoutes } from './modules/vmwarehorizon_module/vmwarehorizon_module.routes';
import { mssqlModuleRoutes } from './modules/mssql_module/mssql_module.routes';
import { nwcModuleRoutes } from './modules/nwc_module/nwc_module.routes';
import { vmwareModuleRoutes } from './modules/vmware_module/vmware_module.routes';
import { hanaModuleRoutes } from './modules/hana_module/hana_module.routes';
import { hpserverhardwareModuleRoutes } from './modules/hpserverhardware_module/hpserverhardware_module.routes';
import { oracleModuleRoutes } from './modules/oracle_module/oracle_module.routes';
import { sapModuleRoutes } from './modules/sap_module/sap_module.routes';
import { upsModuleRoutes } from './modules/ups_module/ups_module.routes';
import { jiraModuleRoutes } from './modules/jira_module/jira_module.routes';
import { openstreetmapModuleRoutes } from './modules/openstreetmap_module/openstreetmap_modules.routes';
import { isarFlowModuleRoutes } from './modules/isarflow_module/isarflow_module.routes';
import { grafanaModuleRoutes } from './modules/grafana_module/grafana_module.routes';
import { autoreportModuleRoutes } from './modules/autoreport_module/autoreport_module.routes';
import { prometheusModuleRoutes } from './modules/prometheus_module/prometheus_module.routes';
import { changecalendarsModuleRoutes } from './modules/changecalendar_module/changecalendar_module.routes';
import { scmModuleRoutes } from './modules/scm_module/scm_module.routes';
import { slackModuleRoutes } from './modules/slack_module/slack_module.routes';
import { designModuleRoutes } from './modules/design_module/design_module.routes';
import { mattermostModuleRoutes } from './modules/mattermost_module/mattermost_module.routes';
import { servicenowModuleRoutes } from './modules/servicenow_module/servicenow_module.routes';

@Component({
    selector: 'legacy-redirect',
    template: `If you can read this, something has to be fixed ;)`,
    imports: [RouterModule]
})
class LegacyUrlComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly document = inject(DOCUMENT);

    public constructor() {

        const {legacyUrl} = this.route.snapshot.data;

        if (legacyUrl) {

            console.log('destination', legacyUrl)
            this.document.location.href = legacyUrl;
        }
    }
}

/***    Routes for modules   ***/
const moduleRoutes: Routes = [
    ...snmpTrapModuleRoutes,
    ...printerModuleRoutes,
    ...vmwaresnapshotModuleRoutes,
    ...db2ModuleRoutes,
    ...upsModuleRoutes,
    ...vmwarehorizonModuleRoutes,
    ...mssqlModuleRoutes,
    ...nwcModuleRoutes,
    ...oracleModuleRoutes,
    ...prometheusModuleRoutes,
    ...vmwareModuleRoutes,
    ...sapModuleRoutes,
    ...hanaModuleRoutes,
    ...customalertModuleRoutes,
    ...distributeModuleRoutes,
    ...msteamsModuleRoutes,
    ...nagiosModuleRoutes,
    ...pagerdutyModuleRoutes,
    ...slaModuleRoutes,
    ...importModuleRoutes,
    ...checkmkModuleRoutes,
    ...hpserverhardwareModuleRoutes,
    ...mapModuleRoutes,
    ...eventcorrelationModuleRoutes,
    ...jiraModuleRoutes,
    ...isarFlowModuleRoutes,
    ...grafanaModuleRoutes,
    ...openstreetmapModuleRoutes,
    ...autoreportModuleRoutes,
    ...changecalendarsModuleRoutes,
    ...scmModuleRoutes,
    ...slackModuleRoutes,
    ...designModuleRoutes,
    ...mattermostModuleRoutes,
    ...servicenowModuleRoutes
];
/***    Core routes   ***/
const coreRoutes: Routes = [{
    path: '',
    loadComponent: () => import('./pages/dashboards/dashboards-index/dashboards-index.component').then(m => m.DashboardsIndexComponent),
    canActivate: [authGuard]
}, {
    path: 'dashboards/index',
    loadComponent: () => import('./pages/dashboards/dashboards-index/dashboards-index.component').then(m => m.DashboardsIndexComponent)
}, {
    path: 'DashboardAllocations/index',
    loadComponent: () => import('./pages/dashboardallocations/dashboard-allocations-index/dashboard-allocations-index.component').then(m => m.DashboardAllocationsIndexComponent)
}, {
    path: 'DashboardAllocations/add',
    loadComponent: () => import('./pages/dashboardallocations/dashboard-allocations-add/dashboard-allocations-add.component').then(m => m.DashboardAllocationsAddComponent)
}, {
    path: 'DashboardAllocations/edit/:id',
    loadComponent: () => import('./pages/dashboardallocations/dashboard-allocations-edit/dashboard-allocations-edit.component').then(m => m.DashboardAllocationsEditComponent)
}, {
    path: 'macros/index',
    loadComponent: () => import('./pages/macros/macro-index/macro-index.component').then(m => m.MacroIndexComponent)
}, {
    path: 'commands/index',
    loadComponent: () => import('./pages/commands/commands-index/commands-index.component').then(m => m.CommandsIndexComponent)
}, {
    path: 'commands/add',
    loadComponent: () => import('./pages/commands/commands-add/commands-add.component').then(m => m.CommandsAddComponent)
}, {
    path: 'commands/edit/:id',
    loadComponent: () => import('./pages/commands/commands-edit/commands-edit.component').then(m => m.CommandsEditComponent)
}, {
    path: 'commands/copy/:ids',
    loadComponent: () => import('./pages/commands/commands-copy/commands-copy.component').then(m => m.CommandsCopyComponent)
}, {
    path: 'commands/usedBy/:id',
    loadComponent: () => import('./pages/commands/commands-used-by/commands-used-by.component').then(m => m.CommandsUsedByComponent)
}, {
    path: 'contactgroups/add',
    loadComponent: () => import('./pages/contactgroups/contactgroups-add/contactgroups-add.component').then(m => m.ContactgroupsAddComponent)
}, {
    path: 'contactgroups/copy/:ids',
    loadComponent: () => import('./pages/contactgroups/contactgroups-copy/contactgroups-copy.component').then(m => m.ContactgroupsCopyComponent)
}, {
    path: 'contactgroups/index',
    loadComponent: () => import('./pages/contactgroups/contactgroups-index/contactgroups-index.component').then(m => m.ContactgroupsIndexComponent)
}, {
    path: 'contactgroups/edit/:id',
    loadComponent: () => import('./pages/contactgroups/contactgroups-edit/contactgroups-edit.component').then(m => m.ContactgroupsEditComponent)
}, {
    path: 'contactgroups/usedBy/:id',
    loadComponent: () => import('./pages/contactgroups/contactgroups-used-by/contactgroups-used-by.component').then(m => m.ContactgroupsUsedByComponent)
}, {
    path: 'downtimereports/index',
    loadComponent: () => import('./pages/downtimereports/downtimereports-index/downtimereports-index.component').then(m => m.DowntimereportsIndexComponent)
}, {
    path: 'usercontainerroles/add',
    loadComponent: () => import('./pages/usercontainerroles/usercontainerroles-add/usercontainerroles-add.component').then(m => m.UsercontainerrolesAddComponent)
}, {
    path: 'usercontainerroles/copy/:ids',
    loadComponent: () => import('./pages/usercontainerroles/usercontainerroles-copy/usercontainerroles-copy.component').then(m => m.UserContainerRolesCopyComponent)
}, {
    path: 'usercontainerroles/edit/:id',
    loadComponent: () => import('./pages/usercontainerroles/usercontainerroles-edit/usercontainerroles-edit.component').then(m => m.UsercontainerrolesEditComponent)
}, {
    path: 'usercontainerroles/index',
    loadComponent: () => import('./pages/usercontainerroles/usercontainerroles-index/usercontainerroles-index.component').then(m => m.UsercontainerrolesIndexComponent)
}, {
    path: 'contacts/index',
    loadComponent: () => import('./pages/contacts/contacts-index/contacts-index.component').then(m => m.ContactsIndexComponent)
}, {
    path: 'contacts/add',
    loadComponent: () => import('./pages/contacts/contacts-add/contacts-add.component').then(m => m.ContactsAddComponent)
}, {
    path: 'contacts/copy/:ids',
    loadComponent: () => import('./pages/contacts/contacts-copy/contacts-copy.component').then(m => m.ContactsCopyComponent)
}, {
    path: 'contacts/edit/:id',
    loadComponent: () => import('./pages/contacts/contacts-edit/contacts-edit.component').then(m => m.ContactsEditComponent)
}, {
    path: 'contacts/ldap',
    loadComponent: () => import('./pages/contacts/contacts-ldap/contacts-ldap.component').then(m => m.ContactsLdapComponent)
}, {
    path: 'contacts/usedBy/:id',
    loadComponent: () => import('./pages/contacts/contacts-used-by/contacts-used-by.component').then(m => m.ContactsUsedByComponent)
}, {
    path: 'contacts/usedBy/:id/:containerIds',
    loadComponent: () => import('./pages/contacts/contacts-used-by/contacts-used-by.component').then(m => m.ContactsUsedByComponent)
}, {
    path: 'changelogs/index',
    loadComponent: () => import('./pages/changelogs/changelogs-index/changelogs-index.component').then(m => m.ChangelogsIndexComponent)
}, {
    path: 'eventlogs/index',
    loadComponent: () => import('./pages/eventlogs/eventlogs-index/eventlogs-index.component').then(m => m.EventlogsIndexComponent)
}, {
    path: 'changelogs/entity/:type/:id',
    loadComponent: () => import('./pages/changelogs/changelogs-entity/changelogs-entity.component').then(m => m.ChangelogsEntityComponent)
}, {
    path: 'hostgroups/add',
    loadComponent: () => import('./pages/hostgroups/hostgroups-add/hostgroups-add.component').then(m => m.HostgroupsAddComponent)
}, {
    path: 'hostgroups/add/:hostids',
    loadComponent: () => import('./pages/hostgroups/hostgroups-add/hostgroups-add.component').then(m => m.HostgroupsAddComponent)
}, {
    path: 'hostgroups/append/:hostids',
    loadComponent: () => import('./pages/hostgroups/hostgroups-append/hostgroups-append.component').then(m => m.HostgroupsAppendComponent)
}, {
    path: 'hostgroups/copy/:ids',
    loadComponent: () => import('./pages/hostgroups/hostgroups-copy/hostgroups-copy.component').then(m => m.HostgroupsCopyComponent)
}, {
    path: 'hostgroups/edit/:id',
    loadComponent: () => import('./pages/hostgroups/hostgroups-edit/hostgroups-edit.component').then(m => m.HostgroupsEditComponent)
}, {
    path: 'hostgroups/extended/:id',
    loadComponent: () => import('./pages/hostgroups/hostgroups-extended/hostgroups-extended.component').then(m => m.HostgroupsExtendedComponent)
}, {
    path: 'hostgroups/index',
    loadComponent: () => import('./pages/hostgroups/hostgroups-index/hostgroups-index.component').then(m => m.HostgroupsIndexComponent)
}, {
    path: 'metrics/info',
    loadComponent: () => import('./pages/metrics/metrics-info/metrics-info.component').then(m => m.MetricsInfoComponent)
}, {
    path: 'packetmanager/index',
    loadComponent: () => import('./pages/packetmanager/packetmanager-index/packetmanager-index.component').then(m => m.PacketmanagerIndexComponent)
}, {
    path: 'services/index',
    loadComponent: () => import('./pages/services/services-index/services-index.component').then(m => m.ServicesIndexComponent)
}, {
    path: 'servicegroups/add',
    loadComponent: () => import('./pages/servicegroups/servicegroups-add/servicegroups-add.component').then(m => m.ServicegroupsAddComponent)
}, {
    path: 'servicegroups/add/:serviceids',
    loadComponent: () => import('./pages/servicegroups/servicegroups-add/servicegroups-add.component').then(m => m.ServicegroupsAddComponent)
}, {
    path: 'servicegroups/append/:serviceids',
    loadComponent: () => import('./pages/servicegroups/servicegroups-append/servicegroups-append.component').then(m => m.ServicegroupsAppendComponent)
}, {
    path: 'servicegroups/copy/:ids',
    loadComponent: () => import('./pages/servicegroups/servicegroups-copy/servicegroups-copy.component').then(m => m.ServicegroupsCopyComponent)
}, {
    path: 'servicegroups/edit/:id',
    loadComponent: () => import('./pages/servicegroups/servicegroups-edit/servicegroups-edit.component').then(m => m.ServicegroupsEditComponent)
}, {
    path: 'servicegroups/extended/:id',
    loadComponent: () => import('./pages/servicegroups/servicegroups-extended/servicegroups-extended.component').then(m => m.ServicegroupsExtendedComponent)
}, {
    path: 'servicegroups/index',
    loadComponent: () => import('./pages/servicegroups/servicegroups-index/servicegroups-index.component').then(m => m.ServicegroupsIndexComponent)
}, {
    path: 'services/add',
    loadComponent: () => import('./pages/services/services-add/services-add.component').then(m => m.ServicesAddComponent)
}, {
    path: 'services/edit/:id',
    loadComponent: () => import('./pages/services/services-edit/services-edit.component').then(m => m.ServicesEditComponent)
}, {
    path: 'services/browser/:idOrUuid',
    loadComponent: () => import('./pages/services/services-browser/services-browser.component').then(m => m.ServicesBrowserComponent)
}, {
    path: 'services/copy/:ids',
    loadComponent: () => import('./pages/services/services-copy/services-copy.component').then(m => m.ServicesCopyComponent)
}, {
    path: 'services/usedBy/:id',
    loadComponent: () => import('./pages/services/services-used-by/services-used-by.component').then(m => m.ServicesUsedByComponent)
}, {
    path: 'services/notMonitored',
    loadComponent: () => import('./pages/services/services-not-monitored/services-not-monitored.component').then(m => m.ServicesNotMonitoredComponent)
}, {
    path: 'services/disabled',
    loadComponent: () => import('./pages/services/services-disabled/services-disabled.component').then(m => m.ServicesDisabledComponent)
}, {
    path: 'services/serviceList/:id',
    loadComponent: () => import('./pages/services/services-service-list/services-service-list.component').then(m => m.ServicesServiceListComponent)
}, {
    path: 'servicetemplategroups/add',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-add/servicetemplategroups-add.component').then(m => m.ServicetemplategroupsAddComponent)
}, {
    path: 'servicetemplategroups/add/:ids',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-add/servicetemplategroups-add.component').then(m => m.ServicetemplategroupsAddComponent)
}, {
    path: 'servicetemplategroups/append/:ids',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-append/servicetemplategroups-append.component').then(m => m.ServicetemplategroupsAppendComponent)
}, {
    path: 'servicetemplategroups/allocateToHost/:id',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-allocate-to-host/servicetemplategroups-allocate-to-host.component').then(m => m.ServicetemplategroupsAllocateToHostComponent)
}, {
    path: 'servicetemplategroups/allocateToHost/:id/:hostId',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-allocate-to-host/servicetemplategroups-allocate-to-host.component').then(m => m.ServicetemplategroupsAllocateToHostComponent)
}, {
    path: 'servicetemplategroups/allocateToHostgroup/:id',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-allocate-to-hostgroup/servicetemplategroups-allocate-to-hostgroup.component').then(m => m.ServicetemplategroupsAllocateToHostgroupComponent)
}, {
    path: 'servicetemplategroups/copy/:ids',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-copy/servicetemplategroups-copy.component').then(m => m.ServicetemplategroupsCopyComponent)
}, {
    path: 'servicetemplategroups/edit/:id',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-edit/servicetemplategroups-edit.component').then(m => m.ServicetemplategroupsEditComponent)
}, {
    path: 'servicetemplategroups/index',
    loadComponent: () => import('./pages/servicetemplategroups/servicetemplategroups-index/servicetemplategroups-index.component').then(m => m.ServicetemplategroupsIndexComponent)
}, {
    path: 'systemsettings/index',
    loadComponent: () => import('./pages/systemsettings/systemsettings-index/systemsettings-index.component').then(m => m.SystemsettingsIndexComponent)
}, {
    path: 'statistics/index',
    loadComponent: () => import('./pages/statistics/statistics-index/statistics-index.component').then(m => m.StatisticsIndexComponent)
}, {
    path: 'supports/issue',
    loadComponent: () => import('./pages/supports/supports-issue/supports-issue.component').then(m => m.SupportsIssueComponent)
}, {
    path: 'proxy/index',
    loadComponent: () => import('./pages/proxy/proxy-index/proxy-index.component').then(m => m.ProxyIndexComponent)
}, {
    path: 'registers/index',
    loadComponent: () => import('./pages/registers/registers-index/registers-index.component').then(m => m.RegistersIndexComponent)
}, {
    path: 'cronjobs/index',
    loadComponent: () => import('./pages/cronjobs/cronjobs-index/cronjobs-index.component').then(m => m.CronjobsIndexComponent)
}, {
    path: 'profile/edit',
    loadComponent: () => import('./pages/profile/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent)
}, {
    path: 'nagiostats/index',
    loadComponent: () => import('./pages/nagiostats/nagiostats-index/nagiostats-index.component').then(m => m.NagiostatsIndexComponent)
}, {
    path: 'hosttemplates/index',
    loadComponent: () => import('./pages/hosttemplates/hosttemplates-index/hosttemplates-index.component').then(m => m.HosttemplatesIndexComponent)
}, {
    path: 'hosttemplates/add',
    loadComponent: () => import('./pages/hosttemplates/hosttemplates-add/hosttemplates-add.component').then(m => m.HosttemplatesAddComponent)
}, {
    path: 'hosttemplates/edit/:id',
    loadComponent: () => import('./pages/hosttemplates/hosttemplates-edit/hosttemplates-edit.component').then(m => m.HosttemplatesEditComponent)
}, {
    path: 'hosttemplates/copy/:ids',
    loadComponent: () => import('./pages/hosttemplates/hosttemplates-copy/hosttemplates-copy.component').then(m => m.HosttemplatesCopyComponent)
}, {
    path: 'hosttemplates/usedBy/:id',
    loadComponent: () => import('./pages/hosttemplates/hosttemplates-used-by/hosttemplates-used-by.component').then(m => m.HosttemplatesUsedByComponent)
}, {
    path: 'servicetemplates/index',
    loadComponent: () => import('./pages/servicetemplates/servicetemplates-index/servicetemplates-index.component').then(m => m.ServicetemplatesIndexComponent)
}, {
    path: 'servicetemplates/add',
    loadComponent: () => import('./pages/servicetemplates/servicetemplates-add/servicetemplates-add.component').then(m => m.ServicetemplatesAddComponent)
}, {
    path: 'servicetemplates/edit/:id',
    loadComponent: () => import('./pages/servicetemplates/servicetemplates-edit/servicetemplates-edit.component').then(m => m.ServicetemplatesEditComponent)
}, {
    path: 'servicetemplates/copy/:ids',
    loadComponent: () => import('./pages/servicetemplates/servicetemplates-copy/servicetemplates-copy.component').then(m => m.ServicetemplatesCopyComponent)
}, {
    path: 'servicetemplates/usedBy/:id',
    loadComponent: () => import('./pages/servicetemplates/servicetemplates-used-by/servicetemplates-used-by.component').then(m => m.ServicetemplatesUsedByComponent)
}, {
    path: 'browsers/index',
    loadComponent: () => import('./pages/browsers/browsers-index/browsers-index.component').then(m => m.BrowsersIndexComponent)
}, {
    path: 'hosts/index',
    loadComponent: () => import('./pages/hosts/hosts-index/hosts-index.component').then(m => m.HostsIndexComponent)
}, {
    path: 'hosts/sharing/:id',
    loadComponent: () => import('./pages/hosts/hosts-sharing/hosts-sharing.component').then(m => m.HostsSharingComponent)
}, {
    path: 'hosts/add',
    loadComponent: () => import('./pages/hosts/hosts-add/hosts-add.component').then(m => m.HostsAddComponent)
}, {
    path: 'hosts/edit/:id',
    loadComponent: () => import('./pages/hosts/hosts-edit/hosts-edit.component').then(m => m.HostsEditComponent)
}, {
    path: 'hosts/edit_details/:ids',
    loadComponent: () => import('./pages/hosts/hosts-edit-details/hosts-edit-details.component').then(m => m.HostsEditDetailsComponent)
}, {
    path: 'hosts/copy/:ids',
    loadComponent: () => import('./pages/hosts/hosts-copy/hosts-copy.component').then(m => m.HostsCopyComponent)
}, {
    path: 'hosts/usedBy/:id',
    loadComponent: () => import('./pages/hosts/hosts-used-by/hosts-used-by.component').then(m => m.HostsUsedByComponent)
}, {
    path: 'hosts/notMonitored',
    loadComponent: () => import('./pages/hosts/hosts-not-monitored/hosts-not-monitored.component').then(m => m.HostsNotMonitoredComponent)
}, {
    path: 'hosts/disabled',
    loadComponent: () => import('./pages/hosts/hosts-disabled/hosts-disabled.component').then(m => m.HostsDisabledComponent)
}, {
    path: 'deletedHosts/index',
    loadComponent: () => import('./pages/deletedHosts/deleted-hosts-index/deleted-hosts-index.component').then(m => m.DeletedHostsIndexComponent)
}, {
    path: 'hosts/browser/:idOrUuid',
    loadComponent: () => import('./pages/hosts/hosts-browser/hosts-browser.component').then(m => m.HostsBrowserComponent)
}, {
    path: 'calendars/index',
    loadComponent: () => import('./pages/calendars/calendars-index/calendars-index.component').then(m => m.CalendarsIndexComponent)
}, {
    path: 'calendars/add',
    loadComponent: () => import('./pages/calendars/calendars-add/calendars-add.component').then(m => m.CalendarsAddComponent)
}, {
    path: 'calendars/edit/:id',
    loadComponent: () => import('./pages/calendars/calendars-edit/calendars-edit.component').then(m => m.CalendarsEditComponent)
}, {
    path: 'documentations/view/:uuid/:type',
    loadComponent: () => import('./pages/documentations/documentations-view/documentations-view.component').then(m => m.DocumentationsViewComponent)
}, {
    path: 'documentations/edit/:uuid/:type',
    loadComponent: () => import('./pages/documentations/documentations-edit/documentations-edit.component').then(m => m.DocumentationsEditComponent)
}, {
    path: 'documentations/wiki',
    loadComponent: () => import('./pages/documentations/documentations-wiki/documentations-wiki.component').then(m => m.DocumentationsWikiComponent)
}, {
    path: 'messagesOtd/add',
    loadComponent: () => import('./pages/messagesotd/messagesotd-add/messagesotd-add.component').then(m => m.MessagesotdAddComponent)
}, {
    path: 'messagesOtd/edit/:id',
    loadComponent: () => import('./pages/messagesotd/messagesotd-edit/messagesotd-edit.component').then(m => m.MessagesotdEditComponent)
}, {
    path: 'messagesOtd/index',
    loadComponent: () => import('./pages/messagesotd/messagesotd-index/messagesotd-index.component').then(m => m.MessagesotdIndexComponent)
}, {
    path: 'timeperiods/index',
    loadComponent: () => import('./pages/timeperiods/timeperiods-index/timeperiods-index.component').then(m => m.TimeperiodsIndexComponent)
}, {
    path: 'timeperiods/add',
    loadComponent: () => import('./pages/timeperiods/timeperiods-add/timeperiods-add.component').then(m => m.TimeperiodsAddComponent)
}, {
    path: 'timeperiods/edit/:id',
    loadComponent: () => import('./pages/timeperiods/timeperiods-edit/timeperiods-edit.component').then(m => m.TimeperiodsEditComponent)
}, {
    path: 'timeperiods/copy/:ids',
    loadComponent: () => import('./pages/timeperiods/timeperiods-copy/timeperiods-copy.component').then(m => m.TimeperiodsCopyComponent)
}, {
    path: 'timeperiods/usedBy/:id',
    loadComponent: () => import('./pages/timeperiods/timeperiods-used-by/timeperiods-used-by.component').then(m => m.TimeperiodsUsedByComponent)
}, {
    path: 'timeperiods/viewDetails/:id',
    loadComponent: () => import('./pages/timeperiods/timeperiods-view-details/timeperiods-view-details.component').then(m => m.TimeperiodsViewDetailsComponent)
}, {
    path: 'hostescalations/index',
    loadComponent: () => import('./pages/hostescalations/hostescalations-index/hostescalations-index.component').then(m => m.HostescalationsIndexComponent)
}, {
    path: 'hostescalations/add',
    loadComponent: () => import('./pages/hostescalations/hostescalations-add/hostescalations-add.component').then(m => m.HostescalationsAddComponent)
}, {
    path: 'hostescalations/edit/:id',
    loadComponent: () => import('./pages/hostescalations/hostescalations-edit/hostescalations-edit.component').then(m => m.HostescalationsEditComponent)
}, {
    path: 'serviceescalations/index',
    loadComponent: () => import('./pages/serviceescalations/serviceescalations-index/serviceescalations-index.component').then(m => m.ServiceescalationsIndexComponent)
}, {
    path: 'serviceescalations/add',
    loadComponent: () => import('./pages/serviceescalations/serviceescalations-add/serviceescalations-add.component').then(m => m.ServiceescalationsAddComponent)
}, {
    path: 'serviceescalations/edit/:id',
    loadComponent: () => import('./pages/serviceescalations/serviceescalations-edit/serviceescalations-edit.component').then(m => m.ServiceescalationsEditComponent)
}, {
    path: 'hostdependencies/index',
    loadComponent: () => import('./pages/hostdependencies/hostdependencies-index/hostdependencies-index.component').then(m => m.HostdependenciesIndexComponent)
}, {
    path: 'hostdependencies/add',
    loadComponent: () => import('./pages/hostdependencies/hostdependencies-add/hostdependencies-add.component').then(m => m.HostdependenciesAddComponent)
}, {
    path: 'hostdependencies/edit/:id',
    loadComponent: () => import('./pages/hostdependencies/hostdependencies-edit/hostdependencies-edit.component').then(m => m.HostdependenciesEditComponent)
}, {
    path: 'servicedependencies/index',
    loadComponent: () => import('./pages/servicedependencies/servicedependencies-index/servicedependencies-index.component').then(m => m.ServicedependenciesIndexComponent)
}, {
    path: 'servicedependencies/add',
    loadComponent: () => import('./pages/servicedependencies/servicedependencies-add/servicedependencies-add.component').then(m => m.ServicedependenciesAddComponent)
}, {
    path: 'servicedependencies/edit/:id',
    loadComponent: () => import('./pages/servicedependencies/servicedependencies-edit/servicedependencies-edit.component').then(m => m.ServicedependenciesEditComponent)
}, {
    path: 'notifications/index',
    loadComponent: () => import('./pages/notifications/notifications-index/notifications-index.component').then(m => m.NotificationsIndexComponent)
}, {
    path: 'notifications/services',
    loadComponent: () => import('./pages/notifications/notifications-services/notifications-services.component').then(m => m.NotificationsServicesComponent)
}, {
    path: 'notifications/hostNotification/:id',
    loadComponent: () => import('./pages/notifications/host-notification/host-notification.component').then(m => m.HostNotificationComponent)
}, {
    path: 'notifications/serviceNotification/:id',
    loadComponent: () => import('./pages/notifications/service-notification/service-notification.component').then(m => m.ServiceNotificationComponent)
}, {
    path: 'logentries/index',
    loadComponent: () => import('./pages/logentries/logentries-index/logentries-index.component').then(m => m.LogentriesIndexComponent)
}, {
    path: 'downtimes/host',
    loadComponent: () => import('./pages/downtimes/downtimes-host/downtimes-host.component').then(m => m.DowntimesHostComponent)
}, {
    path: 'systemdowntimes/addHostdowntime',
    loadComponent: () => import('./pages/systemdowntimes/add-hostdowntime/add-hostdowntime.component').then(m => m.AddHostdowntimeComponent)
}, {
    path: 'systemdowntimes/addHostgroupdowntime',
    loadComponent: () => import('./pages/systemdowntimes/add-hostgroupdowntime/add-hostgroupdowntime.component').then(m => m.AddHostgroupdowntimeComponent)
}, {
    path: 'systemdowntimes/addContainerdowntime',
    loadComponent: () => import('./pages/systemdowntimes/add-containerdowntime/add-containerdowntime.component').then(m => m.AddContainerdowntimeComponent)
}, {
    path: 'downtimes/service',
    loadComponent: () => import('./pages/downtimes/downtimes-service/downtimes-service.component').then(m => m.DowntimesServiceComponent)
}, {
    path: 'systemdowntimes/addServicedowntime',
    loadComponent: () => import('./pages/systemdowntimes/add-servicedowntime/add-servicedowntime.component').then(m => m.AddServicedowntimeComponent)
}, {
    path: 'systemdowntimes/host',
    loadComponent: () => import('./pages/systemdowntimes/systemdowntimes-host/systemdowntimes-host.component').then(m => m.SystemdowntimesHostComponent)
}, {
    path: 'systemdowntimes/service',
    loadComponent: () => import('./pages/systemdowntimes/systemdowntimes-service/systemdowntimes-service.component').then(m => m.SystemdowntimesServiceComponent)
}, {
    path: 'systemdowntimes/hostgroup',
    loadComponent: () => import('./pages/systemdowntimes/systemdowntimes-hostgroup/systemdowntimes-hostgroup.component').then(m => m.SystemdowntimesHostgroupComponent)
}, {
    path: 'systemdowntimes/node',
    loadComponent: () => import('./pages/systemdowntimes/systemdowntimes-node/systemdowntimes-node.component').then(m => m.SystemdowntimesNodeComponent)
}, {
    path: 'systemfailures/index',
    loadComponent: () => import('./pages/systemfailures/systemfailures-index/systemfailures-index.component').then(m => m.SystemfailuresIndexComponent)
}, {
    path: 'systemfailures/add',
    loadComponent: () => import('./pages/systemfailures/systemfailures-add/systemfailures-add.component').then(m => m.SystemfailuresAddComponent)
}, {
    path: 'systemHealthUsers/add',
    loadComponent: () => import('./pages/systemhealthusers/system-health-users-add/system-health-users-add.component').then(m => m.SystemHealthUsersAddComponent)
}, {
    path: 'systemHealthUsers/edit/:id',
    loadComponent: () => import('./pages/systemhealthusers/system-health-users-edit/system-health-users-edit.component').then(m => m.SystemHealthUsersEditComponent)
}, {
    path: 'systemHealthUsers/index',
    loadComponent: () => import('./pages/systemhealthusers/system-health-users-index/system-health-users-index.component').then(m => m.SystemHealthUsersIndexComponent)
}, {
    path: 'hostchecks/index/:id',
    loadComponent: () => import('./pages/hostchecks/hostchecks-index/hostchecks-index.component').then(m => m.HostchecksIndexComponent)
}, {
    path: 'servicechecks/index/:id',
    loadComponent: () => import('./pages/servicechecks/servicechecks-index/servicechecks-index.component').then(m => m.ServicechecksIndexComponent)
}, {
    path: 'statehistories/host/:id',
    loadComponent: () => import('./pages/statehistories/statehistories-host/statehistories-host.component').then(m => m.StatehistoriesHostComponent)
}, {
    path: 'statehistories/service/:id',
    loadComponent: () => import('./pages/statehistories/statehistories-service/statehistories-service.component').then(m => m.StatehistoriesServiceComponent)
}, {
    path: 'usergroups/add',
    loadComponent: () => import('./pages/usergroups/usergroups-add/usergroups-add.component').then(m => m.UsergroupsAddComponent)
}, {
    path: 'usergroups/edit/:id',
    loadComponent: () => import('./pages/usergroups/usergroups-edit/usergroups-edit.component').then(m => m.UsergroupsEditComponent)
}, {
    path: 'usergroups/copy/:ids',
    loadComponent: () => import('./pages/usergroups/usergroups-copy/usergroups-copy.component').then(m => m.UsergroupsCopyComponent)
}, {
    path: 'usergroups/index',
    loadComponent: () => import('./pages/usergroups/usergroups-index/usergroups-index.component').then(m => m.UsergroupsIndexComponent)
}, {
    path: 'users/login',
    loadComponent: () => import('./pages/users/users-login/users-login.component').then(m => m.UsersLoginComponent)
}, {
    path: 'users/index',
    loadComponent: () => import('./pages/users/users-index/users-index.component').then(m => m.UsersIndexComponent)
}, {
    path: 'users/add',
    loadComponent: () => import('./pages/users/users-add/users-add.component').then(m => m.UsersAddComponent)
}, {
    path: 'users/ldap',
    loadComponent: () => import('./pages/users/users-ldap/users-ldap.component').then(m => m.UsersLdapComponent)
}, {
    path: 'users/edit/:id',
    loadComponent: () => import('./pages/users/users-edit/users-edit.component').then(m => m.UsersEditComponent)
}, {
    path: 'acknowledgements/host/:id',
    loadComponent: () => import('./pages/acknowledgements/acknowledgements-host/acknowledgements-host.component').then(m => m.AcknowledgementsHostComponent)
}, {
    path: 'acknowledgements/service/:id',
    loadComponent: () => import('./pages/acknowledgements/acknowledgements-service/acknowledgements-service.component').then(m => m.AcknowledgementsServiceComponent)
}, {
    path: 'locations/index',
    loadComponent: () => import('./pages/locations/locations-index/locations-index.component').then(m => m.LocationsIndexComponent)
}, {
    path: 'locations/add',
    loadComponent: () => import('./pages/locations/locations-add/locations-add.component').then(m => m.LocationsAddComponent)
}, {
    path: 'locations/edit/:id',
    loadComponent: () => import('./pages/locations/locations-edit/locations-edit.component').then(m => m.LocationsEditComponent)
}, {
    path: 'tenants/index',
    loadComponent: () => import('./pages/tenants/tenants-index/tenants-index.component').then(m => m.TenantsIndexComponent)
}, {
    path: 'tenants/add',
    loadComponent: () => import('./pages/tenants/tenants-add/tenants-add.component').then(m => m.TenantsAddComponent)
}, {
    path: 'tenants/edit/:id',
    loadComponent: () => import('./pages/tenants/tenants-edit/tenants-edit.component').then(m => m.TenantsEditComponent)
}, {
    path: 'containers/index',
    loadComponent: () => import('./pages/containers/containers-index/containers-index.component').then(m => m.ContainersIndexComponent)
}, {
    path: 'containers/index/:id',
    loadComponent: () => import('./pages/containers/containers-index/containers-index.component').then(m => m.ContainersIndexComponent)
}, {
    path: 'containers/showDetails/:id',
    loadComponent: () => import('./pages/containers/containers-show-details/containers-show-details.component').then(m => m.ContainersShowDetailsComponent)
}, {
    path: 'containers/map/:id',
    loadComponent: () => import('./pages/containers/containers-map/containers-map.component').then(m => m.ContainersMapComponent)
}, {
    path: 'statusmaps/index',
    loadComponent: () => import('./pages/statusmaps/statusmaps-index/statusmaps-index.component').then(m => m.StatusmapsIndexComponent)
}, {
    path: 'automaps/index',
    loadComponent: () => import('./pages/automaps/automaps-index/automaps-index.component').then(m => m.AutomapsIndexComponent)
}, {
    path: 'automaps/add',
    loadComponent: () => import('./pages/automaps/automaps-add/automaps-add.component').then(m => m.AutomapsAddComponent)
}, {
    path: 'automaps/edit/:id',
    loadComponent: () => import('./pages/automaps/automaps-edit/automaps-edit.component').then(m => m.AutomapsEditComponent)
}, {
    path: 'automaps/view/:id',
    loadComponent: () => import('./pages/automaps/automaps-view/automaps-view.component').then(m => m.AutomapsViewComponent)
}, {
    path: 'automaps/copy/:ids',
    loadComponent: () => import('./pages/automaps/automaps-copy/automaps-copy.component').then(m => m.AutomapsCopyComponent)
}, {
    path: 'currentstatereports/index',
    loadComponent: () => import('./pages/currentstatereports/currentstatereports-index/currentstatereports-index.component').then(m => m.CurrentstatereportsIndexComponent)
}, {
    path: 'instantreports/index',
    loadComponent: () => import('./pages/instantreports/instantreports-index/instantreports-index.component').then(m => m.InstantreportsIndexComponent)
}, {
    path: 'instantreports/add',
    loadComponent: () => import('./pages/instantreports/instantreports-add/instantreports-add.component').then(m => m.InstantreportsAddComponent)
}, {
    path: 'instantreports/edit/:id',
    loadComponent: () => import('./pages/instantreports/instantreports-edit/instantreports-edit.component').then(m => m.InstantreportsEditComponent)
}, {
    path: 'instantreports/generate/:id',
    loadComponent: () => import('./pages/instantreports/instantreports-generate/instantreports-generate.component').then(m => m.InstantreportsGenerateComponent)
}, {
    path: 'agentchecks/index',
    loadComponent: () => import('./pages/agentchecks/agentchecks-index/agentchecks-index.component').then(m => m.AgentchecksIndexComponent)
}, {
    path: 'agentchecks/add',
    loadComponent: () => import('./pages/agentchecks/agentchecks-add/agentchecks-add.component').then(m => m.AgentchecksAddComponent)
}, {
    path: 'agentchecks/edit/:id',
    loadComponent: () => import('./pages/agentchecks/agentchecks-edit/agentchecks-edit.component').then(m => m.AgentchecksEditComponent)
}, {
    path: 'agentconnector/pull',
    loadComponent: () => import('./pages/agentconnector/agentconnector-pull/agentconnector-pull.component').then(m => m.AgentconnectorPullComponent)
}, {
    path: 'agentconnector/push',
    loadComponent: () => import('./pages/agentconnector/agentconnector-push/agentconnector-push.component').then(m => m.AgentconnectorPushComponent)
}, {
    path: 'agentconnector/push_satellite',
    loadComponent: () => import('./pages/agentconnector/agentconnector-push-satellite/agentconnector-push-satellite.component').then(m => m.AgentconnectorPushSatelliteComponent)
}, {
    path: 'agentconnector/showOutput/:id/:mode',
    loadComponent: () => import('./pages/agentconnector/agentconnector-show-output/agentconnector-show-output.component').then(m => m.AgentconnectorShowOutputComponent)
}, {
    path: 'agentconnector/wizard',
    loadComponent: () => import('./pages/agentconnector/agentconnector-wizard/agentconnector-wizard.component').then(m => m.AgentconnectorWizardComponent)
}, {
    path: 'agentconnector/config/:hostId',
    loadComponent: () => import('./pages/agentconnector/agentconnector-config/agentconnector-config.component').then(m => m.AgentconnectorConfigComponent)
}, {
    path: 'agentconnector/install/:hostId',
    loadComponent: () => import('./pages/agentconnector/agentconnector-install/agentconnector-install.component').then(m => m.AgentconnectorInstallComponent)
}, {
    path: 'agentconnector/autotls/:hostId',
    loadComponent: () => import('./pages/agentconnector/agentconnector-auto-tls/agentconnector-auto-tls.component').then(m => m.AgentconnectorAutoTlsComponent)
}, {
    path: 'agentconnector/select_agent/:hostId',
    loadComponent: () => import('./pages/agentconnector/agentconnector-select-agent/agentconnector-select-agent.component').then(m => m.AgentconnectorSelectAgentComponent)
}, {
    path: 'agentconnector/create_services/:hostId',
    loadComponent: () => import('./pages/agentconnector/agentconnector-create-services/agentconnector-create-services.component').then(m => m.AgentconnectorCreateServicesComponent)
}, {
    path: 'exports/index',
    loadComponent: () => import('./pages/exports/exports-index/exports-index.component').then(m => m.ExportsIndexComponent)
}, {
    path: 'statuspages/index',
    loadComponent: () => import('./pages/statuspages/statuspages-index/statuspages-index.component').then(m => m.StatuspagesIndexComponent)
}, {
    path: 'statuspages/view/:id',
    loadComponent: () => import('./pages/statuspages/statuspages-view/statuspages-view.component').then(m => m.StatuspagesViewComponent)
}, {
    path: 'statuspages/add',
    loadComponent: () => import('./pages/statuspages/statuspages-add/statuspages-add.component').then(m => m.StatuspagesAddComponent)
}, {
    path: 'statuspages/edit/:id',
    loadComponent: () => import('./pages/statuspages/statuspages-edit/statuspages-edit.component').then(m => m.StatuspagesEditComponent)
}, {
    path: 'wizards/assignments',
    loadComponent: () => import('./pages/wizards/wizards-assignments/wizard-assignments.component').then(m => m.WizardAssignmentsComponent)
}, {
    path: 'wizards/edit/:uuid/:title',
    loadComponent: () => import('./pages/wizards/wizards-edit/wizards-edit.component').then(m => m.WizardsEditComponent)
}, {
    path: 'wizards/index',
    loadComponent: () => import('./pages/wizards/wizards-index/wizards-index.component').then(m => m.WizardsIndexComponent)
}, {
    path: 'wizards/wizardHostConfiguration/:typeId/:title/:hostId/:state/:selectedOs',
    loadComponent: () => import('./pages/wizards/wizards-wizard-host-configuration/wizards-wizard-host-configuration.component').then(m => m.WizardsWizardHostConfigurationComponent)
}, {
    path: 'wizards/mysqlserver/:hostId',
    loadComponent: () => import('./pages/wizards/mysqlserver/mysqlserver.component').then(m => m.MysqlserverComponent)
}, {
    path: 'ConfigurationFiles/index',
    loadComponent: () => import('./pages/configurationfiles/configuration-files-index/configuration-files-index.component').then(m => m.ConfigurationFilesIndexComponent)
}, {
    path: 'ConfigurationFiles/edit/:dbKey',
    loadComponent: () => import('./pages/configurationfiles/configuration-files-edit/configuration-files-edit.component').then(m => m.ConfigurationFilesEditComponent)
}, {
    path: 'backups/index',
    loadComponent: () => import('./pages/backups/backups-index/backups-index.component').then(m => m.BackupsIndexComponent)
}, {
    path: 'backups/restore',
    loadComponent: () => import('./pages/backups/backups-restore/backups-restore.component').then(m => m.BackupsRestoreComponent)
}, {
    path: 'administrators/debug',
    loadComponent: () => import('./pages/administrators/administrators-debug/administrators-debug.component').then(m => m.AdministratorsDebugComponent)
}, {
    path: 'organizationalcharts/index',
    loadComponent: () => import('./pages/organizationalcharts/organizational-charts-index/organizational-charts-index.component').then(m => m.OrganizationalChartsIndexComponent)
}, {
    path: 'organizationalcharts/add',
    loadComponent: () => import('./pages/organizationalcharts/organizational-charts-add/organizational-charts-add.component').then(m => m.OrganizationalChartsAddComponent)
}, {
    path: 'organizationalcharts/edit/:id',
    loadComponent: () => import('./pages/organizationalcharts/organizational-charts-edit/organizational-charts-edit.component').then(m => m.OrganizationalChartsEditComponent)
}, {
    path: 'organizationalcharts/view/:id',
    loadComponent: () => import('./pages/organizationalcharts/organizational-charts-view/organizational-charts-view.component').then(m => m.OrganizationalChartsViewComponent)
}, {
    path: 'organizationalcharts/browserView',
    loadComponent: () => import('./pages/organizationalcharts/organizational-charts-browser-view/organizational-charts-browser-view.component').then(m => m.OrganizationalChartsBrowserViewComponent)
}, {
    path: 'error/403',
    loadComponent: () => import('./layouts/coreui/errors/error403/error403.component').then(m => m.Error403Component)
}, {
    path: 'error/404',
    loadComponent: () => import('./layouts/coreui/errors/error404/error404.component').then(m => m.Error404Component)
}, {
    path: '**',
    loadComponent: () => import('./layouts/coreui/errors/error404/error404.component').then(m => m.Error404Component)
}
];
export const routes: Routes = [
    ...moduleRoutes,
    ...coreRoutes
];
//}, {
//    path: '**', // TBD: wild card, of custom route matcher for angularjs legacy routes.
//    resolve: {
//        legacyUrl: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//            const legacyBaseUrl: string = inject(LEGACY_BASE_URL);
//            const legacyPath: string = state.url;
//            return `${legacyBaseUrl}${legacyPath}`;
//        }
//    },
//    component: LegacyUrlComponent,
//}];
