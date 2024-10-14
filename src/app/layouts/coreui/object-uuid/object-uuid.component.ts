import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PopoverDirective, TooltipDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-object-uuid',
    standalone: true,
    imports: [
        XsButtonDirective,
        TranslocoDirective,
        TooltipDirective,
        TranslocoPipe,
        PopoverDirective
    ],
    templateUrl: './object-uuid.component.html',
    styleUrl: './object-uuid.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectUuidComponent implements OnInit {

    @Input() uuid: string | undefined;
    private readonly TranslocoService = inject(TranslocoService);

    public tooltipText: string = '';
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.tooltipText = this.TranslocoService.translate('Copy');
    }

    public async copyToClipboard(): Promise<void> {
        if (this.uuid) {
            await navigator.clipboard.writeText(this.uuid);
            this.tooltipText = this.TranslocoService.translate('Copied');
            this.cdr.markForCheck();

            setTimeout(() => {
                // Switch tooltip text back to copy
                this.tooltipText = this.TranslocoService.translate('Copy');
                this.cdr.markForCheck();
            }, 1000);
        }
    }

}
