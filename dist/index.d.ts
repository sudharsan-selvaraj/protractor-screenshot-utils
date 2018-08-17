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
