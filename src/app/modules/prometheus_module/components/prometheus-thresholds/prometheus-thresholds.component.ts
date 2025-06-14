import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-prometheus-thresholds',
    imports: [
        NgIf
    ],
    templateUrl: './prometheus-thresholds.component.html',
    styleUrl: './prometheus-thresholds.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrometheusThresholdsComponent {
    @Input({required: true}) min: number = 0;
    @Input({required: true}) max: number | null = 0;
    @Input({required: true}) type: string = 'warning';
    @Input({required: true}) inclusive: boolean = false;
}
