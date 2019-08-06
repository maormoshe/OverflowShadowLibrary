import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
    selector: '[ngxOverflowShadow]'
})
export class NgxOverflowShadowDirective implements AfterViewInit, OnDestroy {
    @Input() bottomShadow = 'os_bottom-style';

    bottomShadowDiv: HTMLElement;

    private observer: IntersectionObserver;

    constructor(private readonly renderer: Renderer2,
                private readonly elementRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        const {nativeElement} = this.elementRef;

        this.observer = new IntersectionObserver(this.callback.bind(this), {root: nativeElement});

        this.createBottomPlaceholderDiv(nativeElement);
        this.createBottomShadowDiv(nativeElement);
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }

    private createBottomPlaceholderDiv(nativeElement: HTMLElement): void {
        const bottomPlaceholderDiv = this.renderer.createElement('div');

        this.renderer.appendChild(nativeElement, bottomPlaceholderDiv);
        this.observer.observe(bottomPlaceholderDiv);
    }

    private createBottomShadowDiv(nativeElement: HTMLElement): void {
        this.bottomShadowDiv = this.renderer.createElement('div');
        this.renderer.appendChild(nativeElement, this.bottomShadowDiv);
    }

    private callback(entries): void {
        const {isIntersecting} = entries[0];

        if (isIntersecting) {
            this.renderer.removeClass(this.bottomShadowDiv, this.bottomShadow);
        } else {
            this.renderer.addClass(this.bottomShadowDiv, this.bottomShadow);
        }
    }
}
