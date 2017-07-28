var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ls';
var http = require('http');
var db = require('./models/database');
var url = require('url');

http.createServer(function(req,res){
	var route = url.parse(req.url).pathname.replace("/","");
	res.writeHead(200, {'Content-Type': 'application/json'});
	console.log(route);
	if (route.length === 0){
		var services = getServices();
		var json = JSON.stringify(services);
		res.end(json);
	}
	else if(route != 'favicon.ico') {

		var myresult = 	db.selectFromGeobankTable(route, callback);

		function callback(data,err){

			if(err)
			{
				console.log(err);
				res.end(JSON.stringify(err))
			}				
			else
		  	res.end(JSON.stringify(data));
		}

		//res.end(JSON.stringify(getDetail(route)));

	}
}).listen(8090);

function getServices(){
	return ["meteo","accomodation","event","environment"]
}
