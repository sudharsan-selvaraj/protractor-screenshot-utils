import { ProtractorBrowser, ElementFinder } from "protractor";
interface configOptions {
    browserInstance: ProtractorBrowser;
    setAsDefaultScreenshotMethod?: boolean;
}
interface screenShotOptions {
    element?: ElementFinder;
    dimensions?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    saveTo?: string;
    canvasOptions?: canvasOptions;
}
interface canvasOptions {
    allowTaint?: boolean;
    backgroundColor?: string;
    canvas?: HTMLCanvasElement;
    foreignObjectRendering?: boolean;
    imageTimeout?: number;
    ignoreElements?: (element: Element) => boolean;
    logging?: boolean;
    onclone?: (document: Document) => void;
    proxy?: string;
    removeContainer?: boolean;
    scale?: number;
    useCORS?: boolean;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
    letterRendering?: boolean;
}
declare class ProtractorScreenShotUtils {
    private browser;
    private isDefaultScreenshotMethod;
    private originalScreenshotMethod;
    constructor(config: configOptions);
    takeScreenshot(options?: screenShotOptions): any;
    makeAsDefault(): void;
    resetToDefault(): void;
}
export { ProtractorScreenShotUtils, configOptions, screenShotOptions };
