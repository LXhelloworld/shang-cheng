let http = require('http');
let url = require('url');
let util = require('util');

let fs = require('fs');

let server = http.createServer(function (req,res) {
  //res.statusCode = 200;
  //res.setHeader("Content-Type","text/plain; charset=utf-8");
  var pathName = url.parse(req.url).pathname;

  console.log(pathName);
  fs.readFile(pathName.substring(1),function (err,data) {
    if(err){
      res.writeHead(404,{
        'Content-Type': 'text/html'
      });
    }else {
      res.writeHead(200,{
        'Content-Type': 'text/html'
      });

      res.write(data.toString());
      res.end();
    }
  });




}).listen(8080,'127.0.0.1',()=> {
  console.log("服务器已运行");
})
