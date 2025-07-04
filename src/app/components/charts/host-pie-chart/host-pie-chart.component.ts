import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {
    ApexChart,
    ApexGrid,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ChartComponent,
    NgApexchartsModule
} from 'ng-apexcharts';


import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../layouts/coreui/layout.service';


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    responsive: ApexResponsive | ApexResponsive[];
};

@Component({
    selector: 'oitc-host-pie-chart',
    imports: [
        NgApexchartsModule
    ],
    templateUrl: './host-pie-chart.component.html',
    styleUrl: './host-pie-chart.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostPieChartComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild("chart") chart!: ChartComponent;
    public chartOptions!: Partial<ChartOptions>;

    @Input() public statusDataPercentage: number[] = [0, 0, 0];

    public triggerUpdate = input<number>(0);

    private subscription: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private readonly LayoutService = inject(LayoutService);
    private cdr = inject(ChangeDetectorRef);

    public apexGridOptions: ApexGrid = {};

    constructor() {
        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(this.LayoutService.theme$.subscribe((theme) => {
            //console.log('Change in theme detected', theme);
            if (this.chart && this.chartOptions) {

                // Read the background color value from the CSS variable and update the chart
                let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();

                //this.chartOptions.plotOptions?.radialBar?.track?.background = cuiSecondaryBg;
                this.chart.updateOptions({
                    plotOptions: {
                        radialBar: {
                            track: {
                                background: cuiSecondaryBg
                            }
                        }
                    }
                });
            }
            this.cdr.markForCheck();
        }));

        effect(() => {
            if (this.triggerUpdate() > 0) {
                // External component has triggered an update
                if (this.chart) {
                    this.chart.updateOptions(this.chartOptions);
                }
            }
        });
    }

    public ngOnInit(): void {
        this.initializeChartOptions();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['statusDataPercentage'] && this.chart) {
            this.chartOptions.series = this.statusDataPercentage;
            this.chart.updateOptions({
                series: this.statusDataPercentage
            });
            this.cdr.markForCheck();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initializeChartOptions() {
        let labels = [
            this.TranslocoService.translate('Up'),
            this.TranslocoService.translate('Down'),
            this.TranslocoService.translate('Unreachable'),
        ];

        let cuiSecondaryBg = getComputedStyle(document.documentElement).getPropertyValue('--cui-secondary-bg').trim();
        this.chartOptions = {
            series: this.statusDataPercentage,
            chart: {
                height: 300,
                offsetY: -20,
                type: "radialBar",

                // The sparkline option remove all paddings
                // https://github.com/apexcharts/apexcharts.js/issues/1272#issuecomment-591388290
                sparkline: {
                    enabled: true
                },
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: -90,
                    endAngle: 90,
                    hollow: {
                        margin: 5,
                        size: "50%",
                        background: "transparent",
                        image: undefined
                    },
                    track: {
                        show: true,
                        background: cuiSecondaryBg,
                        opacity: 0.5,
                        dropShadow: {
                            enabled: false,
                            top: 2,
                            left: 0,
                            color: '#999999',
                            opacity: 0.2,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: true
                        },
                        value: {
                            show: true
                        }
                    }
                },
            },
            colors: ["#00bc4c", "#bf0000", "#6b737c"],
            labels: labels,
            legend: {
                show: false,
                /*    floating: true,
                    fontSize: "16px",
                    position: "left",
                    offsetX: 60,
                    offsetY: 10,
                    labels: {
                        useSeriesColors: true
                    },
                    formatter: function (seriesName: string, opts: any) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                    },
                    itemMargin: {
                        horizontal: 3
                    }*/
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }
            ]
        };
        this.cdr.markForCheck();
    }


}
