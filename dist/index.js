"use strict";
const fs = require("fs");
let html2canvasPath = require.resolve("html2canvas").replace("/npm/index.js", "/html2canvas.min.js");
class ProtractorScreenShotUtils {
    constructor(config) {
        this.isDefaultScreenshotMethod = false;
        if (!config || !config.browserInstance) {
            throw new Error("browser object is required");
        }
        this.browser = config.browserInstance;
        if (config.setAsDefaultScreenshotMethod == true) {
            this.makeAsDefault();
        }
    }
    takeScreenshot(options = {}) {
        let currentContext = this.browser ? this.browser : this, element = options.element ? options.element : currentContext.$("body"), dimensions = options.dimensions || {}, outputPath = options.saveTo || null, html2canvasScript = fs.readFileSync(html2canvasPath, 'utf8'), injectionScript = `var callBack = arguments[arguments.length -1];
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
                scriptEle.innerText = function injectScript() { ${html2canvasScript} };
                document.body.appendChild(scriptEle);
                document.body.appendChild(scriptEle);
                injectScript();
                `).then(function () {
            return currentContext.executeAsyncScript(injectionScript, element.getWebElement(), dimensions).then(function (base64String) {
                base64String = base64String.replace(/^data:image\/png;base64,/, "");
                if (outputPath) {
                    fs.writeFileSync(outputPath, base64String, 'base64');
                }
                return base64String;
            });
        });
    }
    makeAsDefault() {
        if (!this.isDefaultScreenshotMethod) {
            this.originalScreenshotMethod = this.browser.takeScreenshot;
            this.browser.takeScreenshot = this.takeScreenshot.bind(this.browser);
            this.isDefaultScreenshotMethod = true;
        }
    }
    resetToDefault() {
        if (this.originalScreenshotMethod && this.isDefaultScreenshotMethod) {
            this.browser.takeScreenshot = this.originalScreenshotMethod.bind(this.browser);
            this.isDefaultScreenshotMethod = false;
        }
    }
}
exports.ProtractorScreenShotUtils = ProtractorScreenShotUtils;
