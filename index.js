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

		var myresult = getDetail(route);
		console.log(myresult);

		//res.end(JSON.stringify(getDetail(route)));
		res.end(myresult);
	}
}).listen(8090);

function getServices(){
	return ["meteo","accomodation","event","environment"]
}
function getDetail(service){

	return db.selectFromGeobankTable(service);

	// if (service === "meteo"){
	// 	return {
	// 		id:125,
	// 		formats:["xml","json","jsonp"],
	// 		url:"http://patrick.ohnewein.nit"
	// 	}
	// }
}
