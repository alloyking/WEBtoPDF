// Render Multiple URLs to file

var RenderUrlsToFile, arrayOfUrls, system;
var fileName;
system = require("system");


/*
Render given urls
@param array of URLs to render
@param callbackPerUrl Function called after finishing each URL, including the last URL
@param callbackFinal Function called after finishing everything
*/
RenderUrlsToFile = function(urls,fname, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;
    urlIndex = 0;
    webpage = require("webpage");
    page = null;
    fileName = fname;
    getFilename = function() {
        if(urlIndex === 2){
            return fileName + ".pdf";
        } else{
            return fileName + ".png";
        }
        
    };
    next = function(status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };
    retrieve = function() {
        var url;
        if (urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            page = webpage.create();
          
           if(urlIndex === 2){
                page.viewportSize = { width: 1024, height: 800 };
                page.paperSize = { width: "8.5in", height: "9in"};
           }
            page.settings.userAgent = "Phantom.js bot";
            return page.open("http://" + url, function(status) {
               
                var file;
                file = getFilename();
                if (status === "success") {
                    return window.setTimeout((function() {
                        page.render(file);
                        return next(status, url, file);
                    }), 1000);// delay to allow page/animation load
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

arrayOfUrls = null;

if (system.args.length > 1) {
    arrayOfUrls = Array.prototype.slice.call(system.args, 2);
} else {
    console.log("Usage: phantomjs phantom-server.js [domain.name1, domain.name2, ...]");
    arrayOfUrls = ["www.google.com", "www.bbc.co.uk", "www.phantomjs.org"];
}

RenderUrlsToFile(arrayOfUrls,system.args[1], (function(status, url, file) {
    if (status !== "success") {
        return console.log("Unable to render '" + url + "'");
    } else {
        return console.log("Rendered '" + url + "' at '" + file + "'");
    }
}), function() {
    return phantom.exit();
});