import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Service, WizardGet, WizardPost } from '../wizards.interface';
import { WizardsService } from '../wizards.service';
import {
    WizardsDynamicfieldsComponent
} from '../../../components/wizards/wizards-dynamicfields/wizards-dynamicfields.component';

@Component({
    selector: 'oitc-wizards-abstract',
    imports: [],
    templateUrl: './wizards-abstract.component.html',
    styleUrl: './wizards-abstract.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class WizardsAbstractComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild(WizardsDynamicfieldsComponent) childComponent!: WizardsDynamicfieldsComponent;

    protected readonly subscriptions = new Subscription();
    protected readonly route = inject(ActivatedRoute);
    protected readonly TranslocoService: TranslocoService = inject(TranslocoService);
    protected readonly notyService: NotyService = inject(NotyService);
    protected readonly router: Router = inject(Router);
    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    // Fields that are final.
    protected hostId: number = 0;
    protected errors: GenericValidationError = {} as GenericValidationError;

    // These fields are implemented in the child classes
    protected WizardService: WizardsService = {} as WizardsService;
    protected WizardGet: WizardGet = {} as WizardGet;
    protected post: WizardPost = {
        host_id: 0
    } as WizardPost;

    ngAfterViewInit() {
    }

    public ngOnInit() {
        this.post.host_id = Number(this.route.snapshot.paramMap.get('hostId'));

        // Fetch wizard settings and service templates. This method must be implemented in the child class
        this.subscriptions.add(this.WizardService.fetch(this.post.host_id)
            .subscribe((result: WizardGet) => {
                this.WizardGet = result;
                // Create services from service the templates.
                for (let key in result.servicetemplates) {
                    this.post.services.push(
                        {
                            host_id: this.post.host_id,
                            servicetemplate_id: result.servicetemplates[key].id,
                            name: result.servicetemplates[key].name,
                            description: result.servicetemplates[key].description,
                            servicecommandargumentvalues: result.servicetemplates[key].servicetemplatecommandargumentvalues,
                            createService: !this.isServiceAlreadyPresent(result.servicesNamesForExistCheck, result.servicetemplates[key].name)
                        } as Service);
                }

                // Call custom implementation that may import specific fields from the given result.
                this.wizardLoad(result);
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected isServiceAlreadyPresent(objectOfCurrentServices: {
        [key: string]: string
    }, serviceName: string): boolean {
        return Object.values(objectOfCurrentServices).includes(serviceName);
    }

    public submit(): void {
        // Create a deep copy of this.post
        const updatedPost = JSON.parse(JSON.stringify(this.post));

        // Remove all services from the copied object where createService is false
        updatedPost.services = updatedPost.services.filter((service: Service) => {
            return service.createService;
        });

        this.subscriptions.add(this.WizardService.submit(updatedPost)
            .subscribe((result: GenericResponseWrapper) => {
                this.errors = {} as GenericValidationError;
                this.cdr.markForCheck();
                if (result.success) {
                    const title: string = this.TranslocoService.translate('Success');
                    const msg: string = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.router.navigate(['/services/notMonitored']);
                    this.cdr.markForCheck();
                    return;
                }
                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
                this.cdr.markForCheck();
            })
        );
    }

    // This hack is needed to make the child component to update its view.
    protected wizardLoad(result: WizardGet): void {
        this.childComponent.cdr.markForCheck();
    }

}
