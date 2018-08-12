import {ProtractorBrowser, ElementFinder} from "protractor";
import * as fs from "fs";

interface configOptions {
    browserInstance:ProtractorBrowser,
    setAsDefaultScreenshotMethod?:boolean
}

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
class ProtractorScreenShotUtils {

    private browser:ProtractorBrowser;
    private isDefaultScreenshotMethod:boolean = false;
    private originalScreenshotMethod:any;

    constructor(config:configOptions) {
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
            canvasScript = fs.readFileSync(html2canvasPath),
            injectionScript = canvasScript +
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

        return currentContext.executeAsyncScript(injectionScript, element.getWebElement(), dimensions).then(function (base64String:string) {
            base64String = base64String.replace(/^data:image\/png;base64,/, "")
            if(!outputPath) {
                return base64String;
            } else {
                fs.writeFileSync(outputPath,base64String,'base64');
            }
        });

    }

    public restoreToDefault() {
        if (this.originalScreenshotMethod && this.isDefaultScreenshotMethod) {
            this.browser.takeScreenshot = this.originalScreenshotMethod.bind(this.browser);
            this.isDefaultScreenshotMethod = false;
        }
    }

    public makeAsDefault() {
        if (!this.isDefaultScreenshotMethod) {
            this.originalScreenshotMethod = this.browser.takeScreenshot;
            this.browser.takeScreenshot = this.takeScreenshot.bind(this.browser);
            this.isDefaultScreenshotMethod = true;
        }
    }
}

export {ProtractorScreenShotUtils};