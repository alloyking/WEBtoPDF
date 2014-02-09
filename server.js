var fs = require('fs');
var express = require('express');
var app = express();

var LOCAL = "localhost:3000";

app.use(express.static(__dirname + '/'));

var getContent = function(url, callback){
    var d = new Date();
    var fname = d.getMilliseconds() + '-' + Math.floor(Math.random() * (9999 - 10 + 1) + 10);
    var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', fname, url, LOCAL+'/'+fname+'.png']);
    phantom.on('exit', function(){
      callback(fname+'.pdf');
    });
};

app.get('/', function(req, res) {
 res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
 res.end();
});


app.get('/download', function(req,res){
    res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Access-Control-Allow-Origin': '*'
    });
    getContent(req.query.url, function(content){
      fs.readFile(__dirname +'/'+ content, function(err, data){
        
        //console.log(__dirname +'/rendermulti-3.pdf');
        res.end(data, 'binary');
      
      });
      
    });
});

app.listen(3000);