import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
  ButtonCloseDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalService,
  ModalTitleDirective,
  RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { EnableOrDisableFlapDetectionItem, ExternalCommandsService } from '../../../services/external-commands.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'oitc-hosts-enable-flapdetection-modal',
    imports: [
    ButtonCloseDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    FaIconComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ReactiveFormsModule,
    RowComponent,
    TranslocoDirective,
    XsButtonDirective
],
    templateUrl: './hosts-enable-flapdetection-modal.component.html',
    styleUrl: './hosts-enable-flapdetection-modal.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostsEnableFlapdetectionModalComponent implements OnInit, OnDestroy {
    @Input({required: true}) public items: EnableOrDisableFlapDetectionItem[] = [];
    @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
    public hasErrors: boolean = false;
    public isSend: boolean = false;

    private readonly ExternalCommandsService: ExternalCommandsService = inject(ExternalCommandsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal() {
        this.isSend = false;
        this.hasErrors = false;

        this.cdr.markForCheck();

        this.modalService.toggle({
            show: false,
            id: 'hostEnableFlapdetectionModal'
        });
    }

    public setExternalCommands() {
        this.isSend = true;
        this.sendCommands();
    }


    public ngOnInit() {
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public sendCommands() {
        this.subscriptions.add(this.ExternalCommandsService.setExternalCommands(this.items).subscribe((result: {
            message: any;
        }) => {
            //result.message: /nagios_module//cmdController line 256
            if (result.message) {
                const title = this.TranslocoService.translate('Flap detection enabled');
                const msg = this.TranslocoService.translate('Commands added successfully to queue');

                this.notyService.genericSuccess(msg, title);
                this.hideModal();
                setTimeout(() => {
                    this.completed.emit(true);
                }, 5000);
            } else {
                this.notyService.genericError();
                this.hideModal();
            }
        }));
    }
}
