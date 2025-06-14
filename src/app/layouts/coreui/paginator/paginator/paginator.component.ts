import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ColComponent, PageItemDirective, PageLinkDirective, PaginationComponent, RowComponent } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Paging } from '../paginator.interface';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { LocalNumberPipe } from '../../../../pipes/local-number.pipe';

@Component({
    selector: 'oitc-paginator',
    imports: [
        ColComponent,
        FaIconComponent,
        NgIf,
        PageItemDirective,
        PageLinkDirective,
        PaginationComponent,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        NgFor,
        LocalNumberPipe
    ],
    templateUrl: './paginator.component.html',
    styleUrl: './paginator.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnChanges {

    @Input() paging?: Paging;
    @Output() pageChange = new EventEmitter<number>();

    public pages: number[] = [];
    protected readonly faAnglesLeft = faAnglesLeft;
    protected readonly faAngleLeft = faAngleLeft;
    protected readonly faAnglesRight = faAnglesRight;
    protected readonly faAngleRight = faAngleRight;
    private paginatorLimit = 5;
    private paginatorOffset = 2;

    public ngOnChanges() {
        if (this.paging) {
            if (this.paging.pageCount <= this.paginatorLimit) {
                // Less pages than paginator limit
                this.pages = [];
                for (let i = 1; i <= this.paging.pageCount; i++) {
                    this.pages.push(i)
                }
            }

            if (this.paging.pageCount > this.paginatorLimit) {
                // More pages than paginator limit
                this.pages = [];
                if (this.paging.page <= this.paginatorOffset) {
                    // First paginator pages
                    for (let i = 1; i <= this.paginatorLimit; i++) {
                        this.pages.push(i)
                    }
                } else if (this.paging.page > this.paging.pageCount - this.paginatorOffset) {
                    // Last paginator pages
                    for (let i = this.paging.pageCount - this.paginatorLimit + 1; i <= this.paging.pageCount; i++) {
                        this.pages.push(i)
                    }
                } else {
                    // Middle paginator pages
                    for (let i = this.paging.page - this.paginatorOffset; i <= this.paging.page + this.paginatorOffset; i++) {
                        this.pages.push(i)
                    }
                }
            }
        }
    }

    // Go to first page
    public firstPage() {
        this.pageChange.emit(1);
    }

    // Go to next page (if any)
    public nextPage() {
        if (this.paging) {
            if (this.paging.nextPage) {
                this.pageChange.emit((this.paging.page + 1));
            }
        }
    }

    // Go to previous page (if any)
    public prevPage() {
        if (this.paging) {
            if (this.paging.prevPage && this.paging.page - 1 > 0) {
                this.pageChange.emit((this.paging.page - 1));
            }
        }
    }

    // Go to last page
    public lastPage() {
        if (this.paging) {
            this.pageChange.emit(this.paging.pageCount);
        }
    }

    // Go to specific page
    public changePage(newPage: number) {
        this.pageChange.emit(newPage);
    }
}
