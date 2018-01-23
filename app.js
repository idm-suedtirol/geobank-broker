var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
var db = require('./models/database');
var gd = require('./models/googledocs');
const logger = require('winston');
var schedule = require('node-schedule');
var urlencodedParser = bodyParser.urlencoded({ extended:false })

app.use(express.static(__dirname + '/public'));

/*
 * We enable CORS for all origins (See https://github.com/expressjs/cors#cors).
 * This could be a security issue as described in the following Web Security Blog:
 * http://blog.portswigger.net/2016/10/exploiting-cors-misconfigurations-for.html
 * However, for now we do not have sensible data, and thus the default CORS config
 * is good enough.
 */
app.use(cors());

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
  var obj = db.deleteFromTable(req.query.id, callback);
  function callback(data, err){
    if(err){
      log.error(err);
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
        if(req.body.hiddenId === "-1"){
          res.writeHead(301,
            {Location: 'http://localhost:8090/admin?status=insert'});
            res.end();
          }else{
            res.writeHead(301,
              {Location: 'http://localhost:8090/admin?status=update'});
              res.end();
            }
          }
        }
      })

app.get('/tag', function(req, res){
  db.selectTags(elaborateData);
  function elaborateData(data,err){
    if(err){
      res.end(JSON.stringify(err))
    }else{
      var map={}
      for (i in data){
        var tags =JSON.parse(data[i].tags);
        for (j in tags)
        map[tags[j]]=1;
      }
      res.end(JSON.stringify(Object.keys(map).sort()));
    }
  }
});
app.get('/endpoint', function(req, res){
  //logger.debug(req.params.tag);
  logger.debug(req.query.tag);
  console.log(req.query.tag);
  //var myresult = db.getEndpoints(req.params.tag, callback);
  var myresult = db.getEndpoints(req.query.tag, callback);
  function callback(data, err){
    if(err){
      logger.error(err);
      res.end(JSON.stringify(err))
    }else{
      res.end(JSON.stringify(data.sort()));
    }
  }
});
// app.get('/endpoint:tag', function(req, res){
//   logger.debug(req.params.tag);
//   var myresult = db.getEndpoints(req.params.tag, callback);
//   function callback(data, err){
//     if(err){
//       console.log(err);
//       res.end(JSON.stringify(err))
//     }else{
//       res.end(JSON.stringify(data.sort()));
//     }
//   }
// });

app.get('/endpoint/:endpoint', function(req, res){
  var name = req.params.endpoint
  logger.debug(name);
  var myresult = db.getService(name, callback);
  function callback(data, err){
    if(err){
      res.end(JSON.stringify(err))
    }else{
      res.end(JSON.stringify(data, undefined, 2));
    }
  }
})

app.get('/', function(req, res){
  res.sendFile(__dirname + "/" + "doc.html");
})

var server = app.listen(8090, function () {
  var host = server.address().address;
  var port = server.address().port;
  var job = new schedule.scheduleJob('*/10 * * * * *', function(){
     gd.requestData()
  });
  logger.info("Example app listening at http://%s:%s", host, port)
})
