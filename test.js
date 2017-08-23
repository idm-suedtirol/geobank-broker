var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./models/database');

var urlencodedParser = bodyParser.urlencoded({ extended:false })

app.use(express.static(__dirname + '/public'));

//For Bootstrap reference
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/bootstrap/tags', express.static(__dirname + '/node_modules/bootstrap-tagsinput/dist/'));

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
  var temp = req.body.tagname.replace(/,/g, ";");
  var x = temp.split(";")
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

app.get('/tag', function(req, res){
  var myresult = 	db.selectTagsfromGeobankTable(callback);


  function callback(data,err){

    if(err)
    {
      console.log(err);
      res.end(JSON.stringify(err))
    }
    else
    {
      var testarray = data;
      var destarray = [];

      for(var i of testarray){
        var obj = JSON.parse(i.tags);
        for (var j of obj){
          if(destarray.indexOf(j.tagname) === -1)
            destarray.push(j.tagname);
        }
      }
      res.end(JSON.stringify(destarray, undefined, 2));
    }
}
})

app.get('/tag/:param', function(req, res){
  var myresult = db.selectIdentifiersFromTagsfromGeobankTable(req.param('param'), callback);
  function callback(data, err){
    if(err)
    {
      console.log(err);
      res.end(JSON.stringify(err))
    }
    else
    {
      res.end(JSON.stringify(data, undefined, 2));
    }
  }
})

app.get('/endpoint/:param', function(req, res){
  var myresult = db.selectFromGeobankTable(req.param('param'), callback);
  function callback(data, err){
    if(err)
    {
      console.log(err);
      res.end(JSON.stringify(err))
    }
    else
    {
      res.end(JSON.stringify(data, undefined, 2));
    }
  }
})

app.get('/', function(req, res){
      res.sendFile(__dirname + "/" + "doc.html");
})

var server = app.listen(8090, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
