var pg = require('pg');
//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ls';
var http = require('http');
var db = require('./models/database');
var url = require('url');
var fs = require('fs');

http.createServer(function(req,res){
	var route = url.parse(req.url).pathname.replace("/","");
	res.writeHead(200, {'Content-Type': 'application/json'});
	//console.log(route);
	if (route.substring(0,3) === "tag" && route.length === 3){
		// var services = getServices();
		// var json = JSON.stringify(services);
		// res.end(json);

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
						if(destarray.indexOf(j.tagname) === -1){
							destarray.push(j.tagname);
						}
					}
				}
				res.end(JSON.stringify(destarray));
			}
		}

	}else if(route.substring(0,3) === "tag"){
		var myresult = db.selectIdentifiersFromTagsfromGeobankTable(route.substring(4), callback);
		function callback(data, err){
			if(err)
			{
				console.log(err);
				res.end(JSON.stringify(err))
			}
			else
			{
				res.end(JSON.stringify(data));
			}
		}
	}else if(route.substring(0,8) === "endpoint"){
		var myresult = db.selectFromGeobankTable(route.substring(9), callback)
		function callback(data, err){
			if(err)
			{
				console.log(err);
				res.end(JSON.stringify(err))
			}
			else
			{
				res.end(JSON.stringify(data));
			}
		}
	}else if(route.length === 0){
		var myresult = 	db.selectListfromGeobankTable(callback);
		function callback(data, err){
			if(err)
			{
				console.log(err);
				res.end(JSON.stringify(err))
			}
			else
			{
				res.end(JSON.stringify(data));
			}
		}
	}
	/*else if(route != 'favicon.ico') {

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

}*/
}).listen(8090);

function getServices(){
	return ["meteo","accomodation","event","environment"]
}
