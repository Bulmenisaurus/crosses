import { Monomitter, monomitter } from './event';

export class ScrollableCanvas {
    canvasElement: HTMLCanvasElement;

    cameraPositionX: number;
    cameraPositionY: number;

    canvasIsDragging: boolean;
    canvasElementWidth: number;
    canvasElementHeight: number;

    canvasStartPanX: number;
    canvasStartPanY: number;

    cameraPanDeltaX: number;
    cameraPanDeltaY: number;
    cameraZoom: number;

    clickEvent: Monomitter<MouseEvent>;

    constructor(canvas: HTMLCanvasElement) {
        this.canvasElement = canvas;
        this.canvasElementWidth = 500;
        this.canvasElementHeight = 500;

        this.canvasIsDragging = false;
        this.canvasStartPanX = 0;
        this.canvasStartPanY = 0;

        // camera* - stuff related to the camera, like where it is located, the zoom, etc
        // also stuff related to the rendering of the final image

        this.cameraPositionX = 0;
        this.cameraPositionY = 0;
        this.cameraZoom = 20;

        this.cameraPanDeltaX = 0;
        this.cameraPanDeltaY = 0;

        this.clickEvent = monomitter();

        this.resize();

        // const debouncedResize = debounce(this.resize.bind(this), 100);

        window.addEventListener('resize', (e) => this.resize());
        canvas.addEventListener('wheel', (e) => this.onWheel(e));
        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    resize() {
        const container = this.canvasElement.parentElement!;
        const containerSize = container.getBoundingClientRect();

        this.canvasElementWidth = Math.round(containerSize.width);
        this.canvasElementHeight = Math.round(containerSize.height);

        this.canvasElement.width = this.canvasElementWidth;
        this.canvasElement.height = this.canvasElementHeight;

        // this.reRender();
    }

    onWheel(e: WheelEvent) {
        const scrollAmount = e.deltaY;

        // prevents zooming in entire page when pinch to scrolling
        e.preventDefault();

        /*
        const isFirefox = navigator.userAgent.indexOf('Firefox') > 0;
        return isFirefox ? 1.005 : 1.0006;
        */

        const base = 1.005;

        const clamp = (min: number, x: number, max: number) => Math.max(Math.min(x, max), min);

        const targetZoom = this.cameraZoom * (1 / base ** scrollAmount);
        console.log(targetZoom);
        this.cameraZoom = clamp(6, targetZoom, 30);

        // this.reRender();
    }

    onMouseDown(e: MouseEvent) {
        this.canvasIsDragging = true;
        this.canvasStartPanX = e.offsetX;
        this.canvasStartPanY = e.offsetY;
    }

    onMouseUp(e: MouseEvent) {
        this.canvasIsDragging = false;

        this.cameraPositionX += this.cameraPanDeltaX;
        this.cameraPositionY += this.cameraPanDeltaY;

        const isClick = this.cameraPanDeltaX ** 2 + this.cameraPanDeltaY ** 2 <= 1;

        this.cameraPanDeltaX = 0;
        this.cameraPanDeltaY = 0;

        // we shouldn't place a piece if a click occurred when moving the screen
        // TODO: what if the user moves the mouse a lot, but it eventually returns to it's original location?
        if (isClick) {
            this.clickEvent.publish(e);
        }
    }

    onMouseMove(e: MouseEvent) {
        if (!this.canvasIsDragging) {
            return;
        }

        this.cameraPanDeltaX = (e.offsetX - this.canvasStartPanX) / this.cameraZoom;
        this.cameraPanDeltaY = (e.offsetY - this.canvasStartPanY) / this.cameraZoom;
    }

    gameToCanvasCoord(x: number, y: number) {
        return {
            x: (x + this.cameraPositionX + this.cameraPanDeltaX) * this.cameraZoom,
            y: (y + this.cameraPositionY + this.cameraPanDeltaY) * this.cameraZoom,
        };
    }

    canvasToGameCoord(x: number, y: number) {
        return {
            x: x / this.cameraZoom - this.cameraPositionX - this.cameraPanDeltaX,
            y: y / this.cameraZoom - this.cameraPositionY - this.cameraPanDeltaY,
        };
    }

    gameToCanvasDistance(distance: number) {
        return distance * this.cameraZoom;
    }

    getViewPort() {
        const topLeft = this.canvasToGameCoord(0, 0);
        const bottomRight = this.canvasToGameCoord(
            this.canvasElement.width,
            this.canvasElement.height
        );

        return { topLeft, bottomRight };
    }
}
