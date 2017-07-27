const { Pool, Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:testhallo@localhost:5432/geobank';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost:5432/geobank',
  database: 'geobank',
  password: 'testhallo',
  port: 5432,
})

pool.query(
    'CREATE TABLE geobank(id SERIAL PRIMARY KEY, data JSONB)' , (err, res) => {
    console.log("finito");
    pool.end();
  });

// pool.connect(function(err,client,done) {
//   client.query(
//     'CREATE TABLE geobank(id SERIAL PRIMARY KEY, data JSONB)' , (err, res) => {
//     console.log("finito");
//     done();
//   });
// });
//
// pool.end();


 //client = new pg.Client(connectionString);
//client.connect();
//var query = client.query(
//  'CREATE TABLE geobank(id SERIAL PRIMARY KEY, data JSONB)');
//client.end();
//query.on('end', () => { client.end(); });
//query.on('end', function() {
    // client.end();
// });
