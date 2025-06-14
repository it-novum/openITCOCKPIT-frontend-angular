import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AdditionalHostInformationResult } from '../../../../pages/externalsystems/external-systems.interface';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TableDirective } from '@coreui/angular';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  FaIconComponent,
  FaLayersComponent
} from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'oitc-default',
    imports: [
    TranslocoDirective,
    TableDirective,
    NgIf,
    NgSwitch,
    FaIconComponent,
    NgSwitchCase,
    FaLayersComponent,
    TranslocoPipe
],
    templateUrl: './default.component.html',
    styleUrl: './default.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultComponent {
    @Input() result!: AdditionalHostInformationResult;

}
