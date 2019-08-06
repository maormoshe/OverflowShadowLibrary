import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
    selector: '[ngxOverflowShadow]'
})
export class NgxOverflowShadowDirective implements AfterViewInit, OnDestroy {
    private static DEFAULT_STYLE = {
        position: 'sticky',
        bottom: 0
    };

    @Input() shadowStyle = '0 0 8px 1px rgba(0, 0, 0, 0.8)';

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
        Object.keys(NgxOverflowShadowDirective.DEFAULT_STYLE).forEach((prop) => {
            this.renderer.setStyle(this.bottomShadowDiv, prop, NgxOverflowShadowDirective.DEFAULT_STYLE[prop]);
        });
        this.renderer.appendChild(nativeElement, this.bottomShadowDiv);
    }

    private callback(entries: IntersectionObserverEntry[]): void {
        const {isIntersecting} = entries[0];

        console.log(entries);

        if (isIntersecting) {
            this.renderer.removeStyle(this.bottomShadowDiv, 'boxShadow');
        } else {
            this.renderer.setStyle(this.bottomShadowDiv, 'boxShadow', this.shadowStyle);
        }
    }
}
