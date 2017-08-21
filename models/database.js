const { Pool, Client } = require('pg');
//const connectionString = process.env.DATABASE_URL || 'postgres://postgres:testhallo@localhost:5432/geobank';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geobank',
  password: 'testhallo',
  port: 5432,
});

//TODO
//createGeobankTable();
//dropGeobankTable();
//fillGeobankTable();
//updateGeobankTable();
//selectFromGeobankTable('meteo');
//selectedtest('meteo');

//Create Object Array for Table
function getGeobankObjectArray(){
  var mytypes = [];
  // mytypes.push({ identifier:'meteogb', data: '{ "origin":"Siag", "url":"http://service.suedtirol.info/api/Weather", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["meteo"] }'});
  // mytypes.push({ identifier:'meteointegreen', data: '{ "origin":"province BZ", "url":"http://ipchannels.integreen-life.bz.it/MeteoFrontEnd", "doc":"http://ipchannels.integreen-life.bz.it/MeteoFrontEnd","dataFormats":"json", "tag":["meteo"] }'});
  // mytypes.push({ identifier:'accommodation', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Accommodation", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["accommodation","tourism"] }' });
  // mytypes.push({ identifier:'event', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Eventi", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["events","tourism"] }' });
  // mytypes.push({ identifier:'gastronomy', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Gastronomy", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["gastronomy"] }' });
  // mytypes.push({ identifier:'activity', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Activity" , "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["activity"] }' });
  // mytypes.push({ identifier:'poi', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Poi" , "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":["poi"] }' });
  // mytypes.push({ identifier:'parking', data: '{ "origin":"Province BZ", "url":"http://ipchannels.integreen-life.bz.it/parkingFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/parkingFrontEnd","dataFormats":"json", "tag":["integreen","parking"] }' });
  // mytypes.push({ identifier:'environment', data: '{ "origin":"Province BZ", "url":"http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd","dataFormats":"json", "tag":["integreen","parking"] }' });
  // mytypes.push({ identifier:'traffic_btfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd","dataFormats":"json", "tag":["integreen","traffic"] }' });
  // mytypes.push({ identifier:'traffic_linkfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/LinkFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/LinkFrontEnd","dataFormats":"json", "tag":["integreen","traffic"] }' });
  // mytypes.push({ identifier:'traffic_streetfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/StreetFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/StreetFrontEnd","dataFormats":"json", "tag":["integreen","traffic"] }' });
  // mytypes.push({ identifier:'traffic_trafficfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/TrafficFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/TrafficFrontEnd","dataFormats":"json", "tag":["integreen","traffic"] }' });


//brings a net
  mytypes.push({ identifier:'meteogb', data: '{ "origin":"Siag", "url":"http://service.suedtirol.info/api/Weather", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"meteo" }] }'});
  mytypes.push({ identifier:'meteointegreen', data: '{ "origin":"province BZ", "url":"http://ipchannels.integreen-life.bz.it/MeteoFrontEnd", "doc":"http://ipchannels.integreen-life.bz.it/MeteoFrontEnd","dataFormats":"json", "tag":[{ "tagname":"meteo" }] }'});
  mytypes.push({ identifier:'accommodation', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Accommodation", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"accommodation" },{ "tagname":"tourism" }] }' });
  mytypes.push({ identifier:'event', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Eventi", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"events" },{ "tagname":"tourism" }] }' });
  mytypes.push({ identifier:'gastronomy', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Gastronomy", "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"gastronomy" }] }' });
  mytypes.push({ identifier:'activity', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Activity" , "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"activity" }] }' });
  mytypes.push({ identifier:'poi', data: '{ "origin":"LTS", "url":"http://service.suedtirol.info/api/Poi" , "doc":"http://service.suedtirol.info/help","dataFormats":"json", "tag":[{ "tagname":"poi" }] }' });
  mytypes.push({ identifier:'parking', data: '{ "origin":"Province BZ", "url":"http://ipchannels.integreen-life.bz.it/parkingFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/parkingFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"parking" }] }' });
  mytypes.push({ identifier:'environment', data: '{ "origin":"Province BZ", "url":"http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/EnvironmentFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"parking" }] }' });
  mytypes.push({ identifier:'traffic_btfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/BluetoothFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"traffic" }] }' });
  mytypes.push({ identifier:'traffic_linkfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/LinkFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/LinkFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"traffic" }] }' });
  mytypes.push({ identifier:'traffic_streetfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/StreetFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/StreetFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"traffic" }] }' });
  mytypes.push({ identifier:'traffic_trafficfrontend', data: '{ "origin":"IDM-Suedtirol", "url":"http://ipchannels.integreen-life.bz.it/TrafficFrontEnd" , "doc":"http://ipchannels.integreen-life.bz.it/TrafficFrontEnd","dataFormats":"json", "tag":[{ "tagname":"integreen" },{ "tagname":"traffic" }] }' });


  return mytypes;
};


//CREATE Table
function createGeobankTable(){
  pool.query(
      'CREATE TABLE geobank(id SERIAL PRIMARY KEY, identifier VARCHAR(50) UNIQUE, data JSONB)' , (err, res) => {
      console.log(err, res);
      pool.end();
    });
};



//DROP Table
function dropGeobankTable(){
  pool.query(
      'DROP Table geobank' , (err, res) => {
      console.log(err, res);
      pool.end();
    });
};

//INSERT INTO TABLE
function fillGeobankTable(){

  var arr = getGeobankObjectArray();

  arr.forEach(function(value){
    console.log("Inserting:" + value.identifier);
    pool.query(
      //'INSERT INTO geobank (identifier,data) VALUES(\'' + value.identifier + '\',\'' + value.data + '\')' , (err, res) => {
      'INSERT INTO geobank (identifier,data) VALUES($1,$2)', [ value.identifier, value.data] , (err, res) => {
        console.log(err, res);
    });
  });

  //tuater vorher schun zua
  //pool.end();
};

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

//SELECT FROM TABLE
exports.selectFromGeobankTable = function(identifier, callback){
  console.log("Selecting:" + identifier);

   pool.query(
    'SELECT data FROM geobank WHERE identifier = $1', [ identifier ] , (err, res) => {
      if (err) {
          callback(null, err);
        }
      if(res.rows.length > 0)
           callback(res.rows[0].data);
      else {
        callback(null, "nothing");
      }
  });

  //pool.end();

  // pool.connect((err, client, release) => {
  //   if (err) {
  //     return console.log('Error acquiring client', err.stack)
  //   }
  //   client.query('SELECT data FROM geobank WHERE identifier = $1', [ identifier ], (err, result) => {
  //     release();
  //     if (err) {
  //       return console.log('Error executing query', err.stack);
  //     }
  //     //console.log(result.rows[0].data);
  //
  //     callback(result.rows[0].data);
  //   });
  // });

};

//SELECT FROM TABLE
exports.selectListfromGeobankTable = function(callback){

  console.log("Selecting ALL");

   pool.query(
    'SELECT identifier as datatype,data as services FROM geobank' , (err, res) => {
      if (err) {
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
