var fs = require('fs');

var screenShotUtils = require("../../dist/index.js").ProtractorScreenShotUtils;

var base64value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABA4AAAEeCAYAAAAKMFd8AAAMGGlDQ1BJQ0MgUHJvZmlsZQAASImVVwdUU0kXnldSCAktEOmE3g";

describe("Screenshot utils unit test", function () {

    var browser = {
        takeScreenshot: function () {
            return "Default Screenshot method"
        },
        executeScript : function () {
            return new Promise(function (resolve, reject) {
                return resolve("")
            });
        },
        executeAsyncScript: function () {
            return new Promise(function (resolve, reject) {
                return resolve(base64value)
            });
        },
        $: function (locator) {
            return {
                getWebElement: function () {
                    return locator;
                }
            };
        }
    };

    beforeAll(function () {
        spyOn(browser, 'takeScreenshot').and.callThrough();
        spyOn(browser, 'executeAsyncScript').and.callThrough();
        spyOn(browser, '$').and.callThrough();
    });


    describe("Test constructor method", function () {

        it("Should throw error when browser object is not passed", function () {
            expect(function () {
                new screenShotUtils()
            }).toThrow(new Error("browser object is required"))
        });

        describe("When only browser object is passed", function () {

            var screenShotUtilsObject;
            beforeAll(function () {
                screenShotUtilsObject = new screenShotUtils({
                    browserInstance: browser
                });
            });

            it("browser object should be assigned", function () {
                expect(screenShotUtilsObject.browser).toEqual(browser);
            });

            it("isDefaultScreenshotMethod value should be false", function () {
                expect(screenShotUtilsObject.isDefaultScreenshotMethod).toEqual(false);
            });

            it("originalScreenshotMethod value should be null", function () {
                expect(screenShotUtilsObject.originalScreenshotMethod).toEqual(undefined);
            });

            it("browser.takeScreenShot() should return \"Default Screenshot method\"", function () {
                expect(browser.takeScreenshot()).toEqual("Default Screenshot method");
            });

            it("screenShotUtilsObject.takeScreenShot() should return \"base64 vale\"", function (done) {
                screenShotUtilsObject.takeScreenshot().then(function (base64) {
                    expect(browser.$).toHaveBeenCalledWith("body");
                    expect(browser.executeAsyncScript).toHaveBeenCalled();
                    expect(base64).toEqual(base64value.replace(/^data:image\/png;base64,/, ""));
                    done();
                })
            });

        });

        describe("when setAsDefaultScreenshotMethod options is passed as True", function () {
            var screenShotUtilsObject;
            beforeAll(function () {
                screenShotUtilsObject = new screenShotUtils({
                    browserInstance: browser,
                    setAsDefaultScreenshotMethod: true
                });
            });

            afterAll(function () {
                screenShotUtilsObject.resetToDefault();
            });

            it("browser object should be assigned", function () {
                expect(screenShotUtilsObject.browser).toEqual(browser);
            });

            it("isDefaultScreenshotMethod value should be false", function () {
                expect(screenShotUtilsObject.isDefaultScreenshotMethod).toEqual(true);
            });

            it("originalScreenshotMethod value should be equal to browser.takeScreenshot", function () {
                expect(screenShotUtilsObject.originalScreenshotMethod()).toEqual("Default Screenshot method");
            });

            it("browser.takeScreenShot() should return \"Default Screenshot method\"", function (done) {
                browser.takeScreenshot().then(function (base64) {
                    expect(base64).toEqual(base64value.replace(/^data:image\/png;base64,/, ""));
                    done();
                })
            });

            it("screenShotUtilsObject.takeScreenShot() should return \"base64 vale\"", function (done) {
                screenShotUtilsObject.takeScreenshot().then(function (base64) {
                    expect(browser.$).toHaveBeenCalledWith("body");
                    expect(browser.executeAsyncScript).toHaveBeenCalled();
                    expect(base64).toEqual(base64value.replace(/^data:image\/png;base64,/, ""));
                    done();
                })
            });

        });

    });

    describe("Test saveTo and element option in takeScreenshot method", function () {
        var screenShotUtilsObject, filename = "./out.png";
        beforeAll(function () {
            screenShotUtilsObject = new screenShotUtils({
                browserInstance: browser,
            });
            screenShotUtilsObject.takeScreenshot({
                saveTo: filename,
                element : browser.$("locator")
            });
        });

        afterAll(function () {
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
        });

        it("new file should be created", function () {
            expect(fs.existsSync(filename)).toBeTruthy();
        });

        it("$ function should not be called", function () {
            expect(browser.$).toHaveBeenCalledWith("locator");
        });

    });

    describe("Test makeAsDefault method", function () {

        var screenShotUtilsObject;
        beforeAll(function () {
            screenShotUtilsObject = new screenShotUtils({
                browserInstance: browser
            });
            screenShotUtilsObject.makeAsDefault();
        });

        afterAll(function () {
            screenShotUtilsObject.resetToDefault();
        });

        it("browser.gtakeScreenShot() should return base64 string", function (done) {
            browser.takeScreenshot().then(function (base64) {
                expect(base64).toEqual(base64value.replace(/^data:image\/png;base64,/, ""));
                done();
            })
        });

        it("isDefaultScreenshotMethod value should be True", function () {
            expect(screenShotUtilsObject.isDefaultScreenshotMethod).toBeTruthy();
        });
    });

});