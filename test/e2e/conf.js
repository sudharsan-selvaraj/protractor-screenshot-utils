var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var path = require("path");
var screenShotUtil = require("../../dist/index.js").ProtractorScreenShotUtils;

var reporter = new HtmlScreenshotReporter({
    dest: 'reports/screenshots',
    filename: 'my-report.html',
    captureOnlyFailedSpecs: false,
    inlineImages: true,
    pathBuilder: function (currentSpec, suites, browserCapabilities) {
        return currentSpec.description;
    }
});

exports.config = {
    specs: ["e2e.spec.js"],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 1200000,
    },
    allScriptsTimeout: 1200000,
    beforeLaunch: function () {
        return new Promise(function (resolve) {
            reporter.beforeLaunch(resolve);
        });
    },

    capabilities: {
        browserName: "chrome",
    },


    onPrepare: function () {
        browser.manage().window().setSize(1050,900);
        jasmine.getEnv().addReporter(reporter);
        browser.params.reportPath = path.join(__dirname, "../../reports/screenshots");
        browser.params.screenShotsPath = path.join(__dirname, "../../screenshots");
        browser.params.diffPath = path.join(browser.params.screenShotsPath,"/diff");

        global.fullPageScreenScreenshot = new screenShotUtil({
            browserInstance: browser,
            setAsDefaultScreenshotMethod: false
        });
    },


    afterLaunch: function (exitCode) {
        return new Promise(function (resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    }
};
