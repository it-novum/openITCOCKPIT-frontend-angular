import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { ColorPicker } from 'primeng/colorpicker';
import { ButtonDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-colour-locator-picker',
    imports: [
        ColorPicker,
        FormsModule,
        TranslocoDirective,
        FaIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ButtonDirective,
    ],
    templateUrl: './colour-locator-picker.component.html',
    styleUrl: './colour-locator-picker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColourLocatorPickerComponent implements OnChanges, OnInit {
    private readonly document = inject(DOCUMENT);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    @Input() public selector: string = '';
    @Input() public attribute: string = '';
    @Input() public title: string = '';
    private _value = '';
    private changed: boolean = false;

    @Input()
    get value() {
        return this._value;
    }

    set value(val: string) {
        if (val !== this._value) {
            this._value = val;
            this.valueChange.emit(val);
            this.changed = true;
        }
    }

    @Output() valueChange = new EventEmitter<string>();

    public ngOnChanges(changes: SimpleChanges): void {
        this.cdr.markForCheck();
    }

    public ngOnInit() {
        this.changed = false;
    }

    private getTargetElements(): NodeListOf<HTMLElement> | null {
        if (!this.selector) {
            return null;
        }
        const targetElements = this.document.querySelectorAll(this.selector) as NodeListOf<HTMLElement>;
        if (!targetElements) {
            return null;
        }
        return targetElements;
    }

    private getHighlightColour(): string {
        // If colour hasn't changed, use pink to highlight.
        return this.changed ? this.value : '#FF00FF';
    }

    protected highlightElement(event: any): void {
        let targetElements = this.getTargetElements();
        if (!targetElements) {
            return;
        }
        targetElements.forEach(targetElement => {
            targetElement.style.removeProperty(this.attribute);
            // Always remove highlight, if mouseover add highlight back.
            if (event.type === 'mouseover') {
                targetElement.style.setProperty(this.attribute, this.getHighlightColour(), "important");
            }
        });
        this.cdr.markForCheck();
    }

    protected open(): void {
        this.value = '#FF00FF';
        this.cdr.markForCheck();
    }

    protected clear(): void {
        this.value = '';
        this.changed = false;
        this.cdr.markForCheck();
    }

}
