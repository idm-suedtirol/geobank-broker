const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/geobank';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE geobank(id SERIAL PRIMARY KEY, name VARCHAR(40) not null)');
query.on('end', () => { client.end(); });
