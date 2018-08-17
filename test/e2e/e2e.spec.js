var imageEqual = require("looks-same");
var path = require("path");
var fs = require("fs");
var compareImage = function (currentImage, referenceimageName) {
    return new Promise(function (resolve, reject) {
        imageEqual(path.join(browser.params.reportPath, currentImage),
            path.join(browser.params.screenShotsPath, referenceimageName),
            {tolerance: 10},
            function (error, isEqual) {
                if (error) {
                    reject(error);
                } else {
                    if (!isEqual) {
                        createImageDiff(currentImage, referenceimageName).then(function () {
                            resolve(isEqual);
                        });
                    } else {
                        resolve(isEqual);
                    }
                }
            })
    })
};

var createImageDiff = function (currentImage, referenceimageName) {
    return new Promise(function (resolve, reject) {
        imageEqual.createDiff({
            reference: path.join(browser.params.reportPath, currentImage),
            current: path.join(browser.params.screenShotsPath, referenceimageName),
            diff: path.join(browser.params.diffPath, currentImage),
            highlightColor: '#ff00ff',
            strict: true
        }, function (error) {
            resolve(true);
        });
    })
};

describe("Test Screenshot utils", function () {

    beforeAll(function () {
        browser.get("http://www.protractortest.org/#/tutorial");
        browser.waitForAngular();
    });

    it("Test default screen shot method", function (done) {
        browser.takeScreenshot().then(function (base64) {
            fs.writeFileSync(browser.params.reportPath + "/defaultpage.png", base64, 'base64');
            compareImage("defaultpage.png", "defaultpage.png").then(function (isEqual) {
                expect(isEqual).toEqual(true);
                done();
            });
        });
    });

    it("Test Full page screen shot method using newly created object", function (done) {
        fullPageScreenScreenshot.takeScreenshot({
            saveTo: browser.params.reportPath + "/fullpage_using_object.png"
        }).then(function () {
            compareImage("fullpage_using_object.png", "fullpage.png").then(function (isEqual) {
                expect(isEqual).toEqual(true);
                done();
            });
        });
    });

    it("Test Full page screen shot method using browser object", function (done) {
        fullPageScreenScreenshot.makeAsDefault();
        browser.takeScreenshot({
            saveTo: browser.params.reportPath + "/fullpage_using_browser.png"
        }).then(function () {
            compareImage("fullpage_using_browser.png", "fullpage.png").then(function (isEqual) {
                expect(isEqual).toEqual(true);
                done();
            });
        });
    });

    it("Test screenshot crop functionality", function (done) {
        fullPageScreenScreenshot.resetToDefault();
        fullPageScreenScreenshot.takeScreenshot({
            dimensions: {
                x: 0,
                y: 0,
                height: 1000,
                width: 800
            },
            saveTo: browser.params.reportPath + "/cropped.png"
        }).then(function () {
            compareImage("cropped.png", "cropped.png").then(function (isEqual) {
                expect(isEqual).toEqual(true);
                done();
            });
        });
    });

    it("Test screenshot of element", function (done) {
        fullPageScreenScreenshot.takeScreenshot({
            element: $("#step-1-interacting-with-elements"),
            saveTo: browser.params.reportPath + "/element.png"
        }).then(function () {
            compareImage("element.png", "element.png").then(function (isEqual) {
                expect(isEqual).toEqual(true);
                done();
            });
        });
    });

    it("Test Reporter screen shot", function (done) {
        protractor.promise
            .all([
                compareImage( browser.name+"_"+"Test default screen shot method.png", "defaultpage.png"),
                compareImage( browser.name+"_"+"Test Full page screen shot method using browser object.png", "fullpage.png"),
                compareImage( browser.name+"_"+"Test screenshot crop functionality.png", "defaultpage.png")
            ]).then(function (result) {
            expect(result[0]).toEqual(true, "Test default screen shot method");
            expect(result[1]).toEqual(true, "Test Full page screen shot method using browser object");
            expect(result[2]).toEqual(true, "Test screenshot crop functionality");
            done();
        })
    });
});