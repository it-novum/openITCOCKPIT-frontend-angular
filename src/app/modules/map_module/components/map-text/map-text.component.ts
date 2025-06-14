import { ChangeDetectionStrategy, Component, effect, inject, input, InputSignal } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MapCanvasComponent } from '../map-canvas/map-canvas.component';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MapItemBaseComponent } from '../map-item-base/map-item-base.component';
import { Maptext } from '../../pages/mapeditors/mapeditors.interface';
import { TrustAsHtmlPipe } from '../../../../pipes/trust-as-html.pipe';
import { BbCodeParserService } from '../../../../services/bb-code-parser.service';
import { MapItemType } from '../map-item-base/map-item-base.enum';

@Component({
    selector: 'oitc-map-text',
    standalone: true,
    imports: [CdkDrag, ContextMenuModule, NgStyle, TrustAsHtmlPipe, NgIf, NgClass],
    templateUrl: './map-text.component.html',
    styleUrl: './map-text.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapTextComponent extends MapItemBaseComponent<Maptext> {

    public override item: InputSignal<Maptext | undefined> = input<Maptext>();

    protected override type = MapItemType.TEXT;

    private readonly BBParserService = inject(BbCodeParserService);

    protected bbhtml: string = '';

    constructor(parent: MapCanvasComponent) {
        super(parent);
        effect(() => {
            if (!this.isItemDeleted(this.type)) {
                this.onItemTextChange();
            }
        });
    }

    private onItemTextChange() {
        if (this.item()?.text !== null && typeof this.item()?.text !== 'undefined') {
            this.bbhtml = this.BBParserService.parse(this.item()!.text);
            this.cdr.markForCheck();
        }
    }

}
