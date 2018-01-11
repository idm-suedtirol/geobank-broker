const logger = require('winston')
logger.level='info';
const { Pool, Client } = require('pg');
var format = require('pg-format');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geobank',
  password: 'testhallo',
  port: 5432,
});

function setup(){
  pool.query(
      'CREATE TABLE geobank(id SERIAL PRIMARY KEY, identifier VARCHAR(50) UNIQUE, data JSONB)' , (err, res) => {
      console.log(err, res);
      pool.end();
    });
};

function batchInsert(arr){
  return new Promise(function(resolve,reject){
  	var insertQuerryString = format('INSERT INTO geobank (identifier,data) VALUES %L', arr);
    logger.debug("execute query: "+insertQuerryString);
	  pool.query(insertQuerryString,function(err,res){
        if (err)
          logger.debug("Query failed: "+err);
		    resolve(res);
  	  });
  });
};

exports.insert = function (identifier, data, callback){
    pool.query(
      'INSERT INTO geobank (identifier,data) VALUES($1,$2)', [ identifier, data] , (err, res) => {
        if (err) {
            logger.error(err);
	    if (callback)
	    	callback("failure inserting");
          }
        else{
          //console.log(res);
	    if (callback)
            	callback("success inserting");
        }
  });
}

exports.getFromGeobankTable = function (value, callback){
    pool.query(
      'SELECT * FROM geobank WHERE id = $1', [ value ] , (err, res) => {
        if (err) {
          console.log(err);
            callback("failure getting from db");
          }
          else{
          if(res.rows.length > 0)
            callback(res.rows[0]);
          else
            callback(null, "nothing");
        }
  });
}

exports.updateGeobankTable = function(value, data, obj, callback){
  pool.query(
    'UPDATE geobank SET identifier = $1, data = $2 WHERE id = $3', [ data, obj, value], (err, res) => {
      if(err){
        console.log(err);
        callback("failure updating");
      }else{
        callback("success updating");
      }
    }
  )
}

exports.deleteFromTable = function(value, callback){
  pool.query(
    'DELETE FROM geobank WHERE id = $1', [ value ], (err, res) => {
      if(err){
        console.log(err);
        calback("failure deleting");
      }else{
        callback("success deleting");
      }
    }
  )
}


//UPDATE TABLE
function updateGeobankTable(){

  var arr = getGeobankObjectArray();

  arr.forEach(function(value){
    console.log("Updating:" + value.identifier);
    pool.query(
      'UPDATE geobank SET data = $1 WHERE identifier = $2', [ value.data, value.identifier ] , (err, res) => {
        console.log(err, res);
    });
  });
  pool.end();
};

exports.getService = function(identifier, callback){
  logger.debug(identifier);
  var query = {
    name: 'fetch-webservice',
    text: 'SELECT data FROM geobank WHERE identifier = $1',
    values: [identifier]
  }
   pool.query(query, (err, res) => {
      if (err){
        logger.error("querry failed: "+err);
        callback(null, err);
      }else
          callback(res.rows.length>0?res.rows[0].data:res.rows);
    });
};

//SELECT FROM TABLE
exports.selectListfromGeobankTable = function(callback){

  console.log("Selecting ALL");

   pool.query(
    'SELECT id as id, identifier as datatype,data as services FROM geobank' , (err, res) => {
      if (err) {
          console.log(err);
          callback(null, err);
        }
      if(res.rows.length > 0)
           callback(res.rows);
      else {
        callback(null, "nothing");
      }
  });

  //pool.end();
};

exports.selectTags = function(callback){
   pool.query(
    "SELECT DISTINCT data->>'tags' as tags FROM geobank" , (err, res) => {
      if (err)
        callback(null, err);
      else
        callback(res.rows);
  });
};

exports.getEndpoints = function(tag,callback){
  var query = {
    text: '',
    values: [],
    rowMode: 'array'
  }
  if (tag){

    query.text= "select identifier from geobank where data @> \'{ \"tags\" : [ \"" +tag+"\" ] }\';";
    //query.values.push('\"'+tag+'\"'); //prepared statement not working with jsonb
  }
  else
      query.text= "select identifier from geobank";
   logger.debug(query);
   pool.query(query,(err, res) => {
      if (err) {
          callback(null, err);
        }else{
          var data = res.rows;
          var stringArray=[];
          for (i in data){
            stringArray.push(data[i][0]);
          }
          callback(stringArray);
        }
  });
};

//added for google docs integration
exports.syncDataSets = function(rows){
	var parsedData = [];
  var headers = rows[0];
  rows.shift();
  logger.debug("Headers: "+headers);
  logger.debug("Data: " +rows);
	for (i in rows){
    var dataObject = {};
    var row = rows[i];
    for (colI in headers){
      if (colI == 0 || !headers[colI] || !row[colI])
        continue;
      var key = headers[colI].toLowerCase();
      var value = row[colI];
      if (key==="tags")
        dataObject['tags'] = row[colI].split(', '); //parseTags
      else
        dataObject[key] = value;
    }
    var jsonString = JSON.stringify(dataObject);
		parsedData.push([row[0],jsonString]);
	}
	clearDataSets().then(batchInsert(parsedData));
}
function clearDataSets(){
  return new Promise(function(success,error){
	pool.query('DELETE FROM geobank', [ ], (err, res) => {
      		if(err){
        		logger.error(err);
			error(err);
      		}else{
			success(res);
      		}
    	});
    });
  }
