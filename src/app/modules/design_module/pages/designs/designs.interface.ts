export interface DesignsEditRoot {
    design: Design
    manipulations: Manipulations
    maxUploadLimit: MaxUploadLimit
    new: boolean
    logoPdfForHtml: string,
    smallLogoPdfForHtml: string,
    logoForHtml: string,
    headerLogoForHtml: string,
    customLoginBackgroundHtml: string,
    _csrfToken: string
}

export interface Manipulations {
    [key: string]: Manipulation[]
}

export interface Manipulation {
    selector: string   // The CSS selector
    attribute: string   // The CSS property
    name: string // The db field
    title: string  // Human readable
}

export interface Design {
    [key: string]: any;

    logoInHeader: number
    customcsstext: string

    // Main Areas
    rightBackground: string
    leftBackground: string
    topBackground: string

    // Map
    mapBackground: string
    mapText: string

    // Mode
    mode: string
    modeLocked: number

    // Navigation Colours
    navigationCategoryColour: string
    groupTextColour: string
    navigationItemColour: string
    navigationIconColour: string
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
