import {ProtractorBrowser, ElementFinder} from "protractor";
import * as fs from "fs";

interface configOptions {
    browserInstance:ProtractorBrowser,
    setAsDefaultScreenshotMethod?:boolean
}

/**
 *  Options that can to be passed as parameter to `takeScreeshot` method.
 *  1. element(OPTIONAL) - to take screenshot of any particular element.
 *  2. dimensions(OPTIONAL) - to crop the screen shot based on x,y,width and height of the screnshot.
 *  3. saveTo(OPTIONAL) - file path to automatically save the processed screenshot.
 */
interface screenShotOptions {
    element?:ElementFinder;
    dimensions?:{
        x:number,
        y:number,
        width:number,
        height:number
    },
    saveTo?:string
}

let html2canvasPath = require.resolve("html2canvas").replace("/npm/index.js", "/html2canvas.min.js");

/**
 * This plugin does few things:
 *   1. Takes a fullpage screenshot of the webpage.
 *   2. Takes a screenshot of any particular element.
 *   3. Crop the screen for webpage or element with dimensions.
 *   4. Make fullpage screenshot as default behaviour of browser.takeScreenshot();
 *
 *    example config.js:
 *    ---------------------------------------------------
 *    var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils.;
 *    exports.config = {
 *
 *       onPrepare: function() {
 *           global.screenShotUtils = new screenShotUtils({
 *             browserInstance : browser,
 *             setAsDefaultScreenshotMethod : true // Make fullpage screenshot as default behaviour browser.takeScreenshot()
 *           });
 *       }
 *     }
 *    @author Sudharsan Selvaraj
 *    @created August 12 2018
 */
class ProtractorScreenShotUtils {

    private browser:ProtractorBrowser;
    private isDefaultScreenshotMethod:boolean = false;
    private originalScreenshotMethod:any;

    constructor(config:configOptions) {
        if (!config || !config.browserInstance) {
            throw new Error("browser object is required");
        }
        this.browser = config.browserInstance;
        if (config.setAsDefaultScreenshotMethod == true) {
            this.makeAsDefault();
        }
    }

    public takeScreenshot(options:screenShotOptions = {}) {
        let currentContext:any = this.browser ? this.browser : this,
            element:ElementFinder = options.element ? options.element : currentContext.$("body"),
            dimensions = options.dimensions || {},
            outputPath = options.saveTo || null,
            html2canvasScript = fs.readFileSync(html2canvasPath, 'utf8'),
            injectionScript =
                `var callBack = arguments[arguments.length -1];
                var dimensions = arguments[1];
                html2canvas(arguments[0]).then(function(canvas){
                     
                     if(Object.keys(dimensions).length == 4) {
                        console.log("Success");
                        var croppedCanvas = document.createElement("canvas");
                        var context = canvas.getContext('2d');
                        var croppedImage = context.getImageData(dimensions.x,dimensions.y,canvas.width,canvas.height);
                        console.log(croppedImage)
                        console.log(canvas.width,canvas.height);
                        var croppedContext = croppedCanvas.getContext('2d');
                        croppedCanvas.width = dimensions.width;
                        croppedCanvas.height = dimensions.height;
                        croppedContext.putImageData(croppedImage,0,0);
                        callBack(croppedCanvas.toDataURL())
                     } else {
                        callBack(canvas.toDataURL())
                     }
                 })`;

        return currentContext.executeScript(`var scriptEle = document.createElement("script");
                scriptEle.type = "text/javascript";
                scriptEle.innerText = ${html2canvasScript};
                document.body.appendChild(scriptEle);
                `).then(function () {
            return currentContext.executeAsyncScript(injectionScript, element.getWebElement(), dimensions).then(function (base64String:string) {
                base64String = base64String.replace(/^data:image\/png;base64,/, "");

                /*if output path is given, then save the screenshot as file*/
                if (outputPath) {
                    fs.writeFileSync(outputPath, base64String, 'base64');
                }

                return base64String;
            });
        });

    }

    /**
     * Method to set Full page screen shot as default behaviour of browser.takeScreenShot()
     */
    public makeAsDefault() {
        if (!this.isDefaultScreenshotMethod) {
            this.originalScreenshotMethod = this.browser.takeScreenshot;
            this.browser.takeScreenshot = this.takeScreenshot.bind(this.browser);
            this.isDefaultScreenshotMethod = true;
        }
    }

    /**
     * Method to reset Full page screen shot behaviour of browser.takeScreenShot()
     */
    public resetToDefault() {
        if (this.originalScreenshotMethod && this.isDefaultScreenshotMethod) {
            this.browser.takeScreenshot = this.originalScreenshotMethod.bind(this.browser);
            this.isDefaultScreenshotMethod = false;
        }
    }
}

export {ProtractorScreenShotUtils, configOptions, screenShotOptions};
