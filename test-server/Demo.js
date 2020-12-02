let user = require('./User');

console.log(`userName:${user.userName}`);
console.log(`sayHello:${user.sayHello()}`);



let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer(function (req,res) {
  res.statusCode = 200;
  res.setHeader("Content-Type","text/plain; charset=utf-8");

  res.end(util.inspect(url.parse(req.url)));
}).listen(8080,'127.0.0.1',()=> {
  console.log("服务器已运行");
})
