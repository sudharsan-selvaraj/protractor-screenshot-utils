[![Build Status](https://travis-ci.org/sudharsan-selvaraj/protractor-screenshot-utils.svg?branch=master)](https://travis-ci.org/sudharsan-selvaraj/protractor-screenshot-utils)
[![Code Coverage](https://codecov.io/gh/sudharsan-selvaraj/protractor-screenshot-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/sudharsan-selvaraj/protractor-screenshot-utils/branch/master)

# protractor-screenshot-utils

**A simple utility to capture fullpage screenshot, screenshot of any element and crop the screenshot by any screen coordinates from your e2e protractor tests out-of-box.**

# Features

1. This module can take **fullpage screenshots** of any webpage.
2. It can take **screenshot** of any given **WebElement**.
3. It also has the ability to crop the screenshot with given co-ordinates of screen.
4. Automatically save the captured screenshot in given path.
5. Overrides default `browser.getScreenshot()` method to capture full page screenshots.

# Preview
<table border="0px">
<tr>
  <th>Default Screenshot</th>
  <th>Fullpage Screenshot</th>
  <th>Element Screenshot</th>
<tr>
<tr>
  <td valign="top"><img src="https://raw.githubusercontent.com/sudharsan-selvaraj/protractor-screenshot-utils/master/screenshots/chrome/defaultpage.png"></td>
  <td valign="top"><img src="https://raw.githubusercontent.com/sudharsan-selvaraj/protractor-screenshot-utils/master/screenshots/chrome/fullpage.png"></td>
  <td valign="top">_____________________________________<img src="https://raw.githubusercontent.com/sudharsan-selvaraj/protractor-screenshot-utils/master/screenshots/chrome/element.png">_____________________________________</td>
<tr>
</table>

# How to install

```
npm install protractor-screenshot-utils
```

# Usage

Add add the below code to protractor config file:

Example:

*protractor.config.js*
```javascript
var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;
exports.config = {
    framework: 'jasmine2',
      onPrepare: function() {
          global.screenShotUtils = new screenShotUtils({
            browserInstance : browser
          });
      }
};
```
That's it. Now you can take fullpage screenshots from your tests by just using any of the below code.

## Taking fullPage screenshot
```javascript
screenShotUtils.takeScreenshot().then(function(base64string){
    //logic to save the image to file.
})
```
 or you can also directly save the image as file using 

 ```javascript
screenShotUtils.takeScreenshot({
    saveTo: "fullpageScreenshot.png"
})
```
Above code will automatically saves the screenshot as `fullpageScreenshot.png` file.

## Taking screenshot of any element

 ```javascript
screenShotUtils.takeScreenshot({
    element : element(by.id("header")), //you can pass any protractor element
    saveTo: "headerElement.png"
})
```

## Taking screenshot by screen co-ordinates

 ```javascript
screenShotUtils.takeScreenshot({
    dimensions : {
        x:20, //starting x point
        y:40, //startng y point
        width : 200,
        height: 200
    },
    saveTo: "croppedImage.png"
})
```

You can also crop the screenshot of an element by using

 ```javascript
screenShotUtils.takeScreenshot({
    element : element(by.id("main-container")),
    dimensions : {
        x:20, //starting x point
        y:40, //startng y point
        width : 200,
        height: 200
    },
    saveTo: "croppedElementImage.png"
})
```

# Additional Funtionalities:

## Override default browser.takeScreenshot()

If your using any html-screenshot reporter in your test,then those reporters will call `browser.takeScreenshot()` to capture the screenshot of webpage in case of any failures in test. If you want to override default behaviour of `browser.takeScreenshot()` to caputer full page screenshot, you can use,

```javascript
global.screenShotUtils = new screenShotUtils({
    browserInstance : browser,
    setAsDefaultScreenshotMethod : true //this will override default browser.takeScreenshot() method to take full page image.
});
```
And you can now take fullpage screen shot, element screenshot using browser.takeScreenshot() with all options given in above examples.

