"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var html2canvasPath = require.resolve("html2canvas").replace("/npm/index.js", "/html2canvas.min.js");
var ProtractorScreenShotUtils = (function () {
    function ProtractorScreenShotUtils(config) {
        this.isDefaultScreenshotMethod = false;
        if (!config || !config.browserInstance) {
            throw new Error("browser object is required");
        }
        this.browser = config.browserInstance;
        if (config.setAsDefaultScreenshotMethod == true) {
            this.makeAsDefault();
        }
    }
    ProtractorScreenShotUtils.prototype.takeScreenshot = function (options) {
        if (options === void 0) { options = {}; }
        var currentContext = this.browser ? this.browser : this, element = options.element ? options.element : currentContext.$("body"), dimensions = options.dimensions || {}, outputPath = options.saveTo || null, html2canvasScript = fs.readFileSync(html2canvasPath, 'utf8'), injectionScript = "var callBack = arguments[arguments.length -1];\n                var dimensions = arguments[1];\n                html2canvas(arguments[0]).then(function(canvas){\n                     \n                     if(Object.keys(dimensions).length == 4) {\n                        console.log(\"Success\");\n                        var croppedCanvas = document.createElement(\"canvas\");\n                        var context = canvas.getContext('2d');\n                        var croppedImage = context.getImageData(dimensions.x,dimensions.y,canvas.width,canvas.height);\n                        console.log(croppedImage)\n                        console.log(canvas.width,canvas.height);\n                        var croppedContext = croppedCanvas.getContext('2d');\n                        croppedCanvas.width = dimensions.width;\n                        croppedCanvas.height = dimensions.height;\n                        croppedContext.putImageData(croppedImage,0,0);\n                        callBack(croppedCanvas.toDataURL())\n                     } else {\n                        callBack(canvas.toDataURL())\n                     }\n                 })";
        return currentContext.executeScript("var scriptEle = document.createElement(\"script\");\n                scriptEle.type = \"text/javascript\";\n                scriptEle.innerText = " + html2canvasScript + ";\n                document.body.appendChild(scriptEle);\n                ").then(function () {
            return currentContext.executeAsyncScript(injectionScript, element.getWebElement(), dimensions).then(function (base64String) {
                base64String = base64String.replace(/^data:image\/png;base64,/, "");
                if (outputPath) {
                    fs.writeFileSync(outputPath, base64String, 'base64');
                }
                return base64String;
            });
        });
    };
    ProtractorScreenShotUtils.prototype.makeAsDefault = function () {
        if (!this.isDefaultScreenshotMethod) {
            this.originalScreenshotMethod = this.browser.takeScreenshot;
            this.browser.takeScreenshot = this.takeScreenshot.bind(this.browser);
            this.isDefaultScreenshotMethod = true;
        }
    };
    ProtractorScreenShotUtils.prototype.resetToDefault = function () {
        if (this.originalScreenshotMethod && this.isDefaultScreenshotMethod) {
            this.browser.takeScreenshot = this.originalScreenshotMethod.bind(this.browser);
            this.isDefaultScreenshotMethod = false;
        }
    };
    return ProtractorScreenShotUtils;
}());
exports.ProtractorScreenShotUtils = ProtractorScreenShotUtils;
