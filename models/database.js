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
  mytypes.push({ identifier:'meteo', data: '{ "name":"meteo", "url":"http://service.suedtirol.info/api/Weather" }' })
  mytypes.push({ identifier:'accommodation', data: '{ "name":"accommodation", "url":"http://service.suedtirol.info/api/Accommodation" }' })
  mytypes.push({ identifier:'event', data: '{ "name":"event", "url":"http://service.suedtirol.info/api/Event"}' })
  mytypes.push({ identifier:'gastronomy', data: '{ "name":"gastronomy", "url":"http://service.suedtirol.info/api/Gastronomy"}' })
  mytypes.push({ identifier:'activity', data: '{ "name":"activity", "url":"http://service.suedtirol.info/api/Activity"}' })
  mytypes.push({ identifier:'poi', data: '{ "name":"poi", "url":"http://service.suedtirol.info/api/Poi"}' })

  return mytypes;
};

//CREATE Table
function createGeobankTable(){
  pool.query(
      'CREATE TABLE geobank(id SERIAL PRIMARY KEY, identifier VARCHAR(20) UNIQUE, data JSONB)' , (err, res) => {
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
  pool.end();
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
      pool.end();
      if (err) {
          callback(null, err);
        }
      if(res.rows.length > 0)
           callback(res.rows[0].data);
      else {
        callback(null, "nothing");
      }
  });

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
  //   pool.end();
  // });

};
