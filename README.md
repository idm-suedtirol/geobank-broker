# Geobank Broker

## Getting started
- Clone this repository: `git clone git@github.com:idm-suedtirol/geobank-broker.git`
- Install node.js from https://nodejs.org, and make sure node.js commands are in your `$PATH`.
- Change directory into your local repository
- Install all dependencies with `npm install`
- Run the broker: `node app.js`

## Retrieve Google spreadsheet credentials
- Ask someone of the project to give you access to the Google spreadsheet `GeoBank_Datasets`.
- Read and apply `https://developers.google.com/sheets/api/quickstart/nodejs` (see shortcuts!!).
- Download credentials to your local repository's root folder
- Copy the application code from the web-browser to your running broker app (terminal)

## Configure PostgreSQL
- Read https://github.com/idm-suedtirol/doc-howto/wiki/Postgres.
- Change the configuration of PG to the credentials seen in `models/database.js`.
- Create a table with `psql`: `CREATE TABLE geobank(id SERIAL PRIMARY KEY, identifier VARCHAR(50) UNIQUE, data JSONB);`
- Restart the PostgreSQL service if you changed any configuration.
