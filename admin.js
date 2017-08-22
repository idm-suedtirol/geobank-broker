var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./models/database');

var urlencodedParser = bodyParser.urlencoded({ extended:false })

app.use(express.static('public'));

app.get('/admin', function (req, res) {
  // console.log(req.query.id);
  //  if(req.query.id === undefined)
    res.sendFile(__dirname + "/" + "admin.html");
  // else
  //   res.send(req.query.id);
})

app.get('/api/data', function(req, res){
  var obj = db.getFromGeobankTable(req.query.id, callback)
   function callback(data, err){
     if(err){
       console.log(err);
       res.end(JSON.stringify(err));
     }else{
       res.send(data);
     }
   }

})

app.get('/api/list', function(req, res){
  var obj = db.selectListfromGeobankTable(callback)
  function callback(data, err){
    if(err){
      console.log(err);
      res.end(JSON.stringify(err));
    }else{
      res.send(data);
    }
  }
})

app.get('/api/delete', function(req, res){
  console.log(req.query.id);
  var obj = db.deleteFromTable(req.query.id, callback);
  function callback(data, err){
    if(err){
      console.log(err);
      res.end(JSON.stringify(err));
    }else{
      res.writeHead(301,
      {Location: 'http://localhost:8090/admin'});
      res.end();
    }
  }
})

app.post('/api/postdata', urlencodedParser, function(req, res){
  var x = req.body.tagname.split(";")
  var cont = [];
  for(var i of x){
    if(i.length>0){
      var obj = {"tagname": i};
      cont.push(obj);
    }
  }
  response = {
       doc:req.body.doc,
       tag:cont,
       url: req.body.url,
       origin: req.body.origin,
       dataFormats: req.body.dataFormats
    };
    if(req.body.hiddenId === "-1"){
      db.insertIntoGeobankTable(req.body.datatype, response, callback);
    }else{
      db.updateGeobankTable(req.body.hiddenId, req.body.datatype, response, callback);
    }
    function callback(data, err){
      if(err)
      {
        console.log(err);
				res.end(JSON.stringify(err))
      }else{
        res.writeHead(301,
        {Location: 'http://localhost:8090/admin'});
        res.end();
      }
    }
})

var server = app.listen(8090, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
