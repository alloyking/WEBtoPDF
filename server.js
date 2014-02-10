var fs = require('fs');
var express = require('express');
var app = express();

var LOCAL = "localhost:3000";

app.use(express.static(__dirname + '/'));

var getContent = function (url, callback) {
    var d = new Date();
    var pngImag;
    var fname = d.getMilliseconds() + '-' + Math.floor(Math.random() * (9999 - 10 + 1) + 10);
    var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', fname, url, LOCAL + '/' + fname + '.png']);
    phantom.on('exit', function () {
        callback(fname);
    });
};

app.get('/', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });
    res.end();
});


app.get('/download', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*'
    });
    getContent(req.query.url, function (content) {
        fs.readFile(__dirname + '/' + content + '.pdf', function (err, data) {
            //show user the pdf data
            res.end(data, 'binary');
            //delete the old .png that was used to render the pdf.
            fs.unlink(__dirname + '/' + content + '.png', function () {
                console.log('png removed');
            });
        });
    });
});

app.listen(3000);