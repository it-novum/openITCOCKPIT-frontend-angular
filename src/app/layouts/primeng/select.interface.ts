// Used for select boxes
import { SelectItem } from 'primeng/api/selectitem';

export interface SelectKeyValue {
    key: number,
    value: string
}

export interface SelectKeyValueWithDisabled {
    key: number,
    value: string,
    disabled?: boolean
}

export interface SelectItemOptionGroup {
    label: string;
    value?: any;
    disabled?: boolean
    items: SelectItem[];
}

export interface SelectKeyValueString {
    key: string,
    value: string
}

export interface SelectKeyValueOptGroup {
    value: string | number
    items: SelectKeyValueString[]
}

export interface SelectKeyValuePath {
    key: number,
    value: string
    path: string
}

export interface SelectKeyValuePathWithDisabled {
    key: number,
    value: string
    path: string
    disabled?: boolean
}
