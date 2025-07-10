export interface DesignsEditRoot {
    design: Design
    maxUploadLimit: MaxUploadLimit
    new: boolean
    logoPdfForHtml: string,
    smallLogoPdfForHtml: string,
    logoForHtml: string,
    headerLogoForHtml: string,
    customLoginBackgroundHtml: string,
    customStatusPageHeaderHtml: string,
    isCustomStatusPageHeader: boolean,
    _csrfToken: string
}

export interface Design {
    pageHeader: string
    pageSidebar: string
    pageSidebarGradient: string
    navTitle: string
    navMenu: string
    navMenuHover: string
    navLink: string
    navLinkHover: string
    navTab: string
    pageContent: string
    pageContentWrapper: string
    panel: string
    panelHdr: string
    breadcrumbNonLinks: string
    breadcrumbLinks: string
    tableBase: string
    tableBaseFont: string
    tableBorder: string
    tableHover: string
    tableHoverFont: string
    btnDefault: string
    btnDefaultFont: string
    btnDefaultBorder: string
    cardBase: string
    cardBaseFont: string
    cardHeader: string
    cardHeaderFont: string
    logoInHeader: number
    customcsstext: string
}

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
}

export interface ResetLogoResponse {
    success: string
    _csrfToken: string
    message: string
}
