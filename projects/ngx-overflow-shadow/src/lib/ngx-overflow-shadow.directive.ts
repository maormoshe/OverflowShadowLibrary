import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';

@Directive({
    selector: '[ngxOverflowShadow]'
})
export class NgxOverflowShadowDirective implements AfterViewInit, OnDestroy {
    @Input() top = false;
    @Input() bottom = true;
    @Input() shadowStyle = '0 0 8px 1px rgba(0, 0, 0, 0.5)';

    topShadowDiv: HTMLElement;
    bottomShadowDiv: HTMLElement;

    private topIntersectionObserver: IntersectionObserver;
    private bottomIntersectionObserver: IntersectionObserver;

    constructor(private readonly renderer: Renderer2,
                private readonly elementRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.init();
    }

    ngOnDestroy(): void {
        if (this.top) {
            this.topIntersectionObserver.disconnect();
        }
        if (this.bottom) {
            this.bottomIntersectionObserver.disconnect();
        }
    }

    private init(): void {
        if (this.top) {
            this.initTopShadow();
        }
        if (this.bottom) {
            this.initBottomShadow();
        }
    }

    private initTopShadow(): void {
        const {nativeElement} = this.elementRef;

        this.createTopShadowDiv(nativeElement);
        this.createTopIntersectionObserver(nativeElement);
        this.createTopPlaceholderDiv(nativeElement);
    }

    private initBottomShadow(): void {
        const {nativeElement} = this.elementRef;

        this.createBottomShadowDiv(nativeElement);
        this.createBottomIntersectionObserver(nativeElement);
        this.createBottomPlaceholderDiv(nativeElement);
    }

    private createTopShadowDiv(nativeElement: HTMLElement): void {
        this.topShadowDiv = this.renderer.createElement('div');
        this.renderer.setStyle(this.topShadowDiv, 'position', 'sticky');
        this.renderer.setStyle(this.topShadowDiv, 'top', 0);
        this.renderer.insertBefore(nativeElement, this.topShadowDiv, nativeElement.firstChild);
    }

    private createBottomShadowDiv(nativeElement: HTMLElement): void {
        this.bottomShadowDiv = this.renderer.createElement('div');
        this.renderer.setStyle(this.bottomShadowDiv, 'position', 'sticky');
        this.renderer.setStyle(this.bottomShadowDiv, 'bottom', 0);
        this.renderer.appendChild(nativeElement, this.bottomShadowDiv);
    }

    private createTopIntersectionObserver(nativeElement: HTMLElement): void {
        this.topIntersectionObserver = new IntersectionObserver(this.callback.bind(this, this.topShadowDiv), {root: nativeElement});
    }

    private createBottomIntersectionObserver(nativeElement: HTMLElement): void {
        this.bottomIntersectionObserver = new IntersectionObserver(this.callback.bind(this, this.bottomShadowDiv), {root: nativeElement});
    }

    private createTopPlaceholderDiv(nativeElement: HTMLElement): void {
        const topPlaceholderDiv = this.renderer.createElement('div');

        this.renderer.insertBefore(nativeElement, topPlaceholderDiv, nativeElement.firstChild);
        this.topIntersectionObserver.observe(topPlaceholderDiv);
    }

    private createBottomPlaceholderDiv(nativeElement: HTMLElement): void {
        const bottomPlaceholderDiv = this.renderer.createElement('div');

        this.renderer.appendChild(nativeElement, bottomPlaceholderDiv);
        this.bottomIntersectionObserver.observe(bottomPlaceholderDiv);
    }

    private callback(shadowDiv: HTMLElement, entries: IntersectionObserverEntry[]): void {
        const isIntersecting = entries.find((entry) => entry.isIntersecting);

        if (isIntersecting) {
            this.renderer.removeStyle(shadowDiv, 'boxShadow');
        } else {
            this.renderer.setStyle(shadowDiv, 'boxShadow', this.shadowStyle);
        }
    }
}
