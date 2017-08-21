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
						if(destarray.indexOf(j.tagname) === -1)
							destarray.push(j.tagname);
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
	}else if(route.substring(0,4) === "form"){
			var myresult = db.selectListfromGeobankTable(callback)
			function callback(data, err){
			if(err){
				console.log(err);
				res.end(JSON.stringify(err))
			}else{
				var testarray = data;
				var content = "<div><div class='leftDiv'><h2>Insert</h2>";
				content += 		"<p class='firstLevel'><span class='left'>Datatype: </span><input type='text' name='tDatatype'></p>"
											+"<p class='firstLevel'><span class='left'>Services</span></p>"
											+"<p class='secondLevel'><span class='left'>Doc: </span><input type='text' name='tDoc'></p>"
											+"<p class='secondLevel'><span class='left'>Tag</span></p>"
											+"<p class='thirdLevel'><span class='left'>Tagname: </span><input type='text' name='tTagname'></p>"
											+"<p class='secondLevel'><span class='left'>Url: </span><input type='text' name='tUrl'></p>"
											+"<p class='secondLevel'><span class='left'>Origin: </span><input type='text' name='tOrigin'></p>"
											+"<p class='secondLevel'><span class='left'>dataFormats: </span><input type='text' name='tDataFormats'></p>"
											+"<input type='button' value='Insert'>"
				content += "</div>";
				content += "<div class='rightDiv'><h2>Update</h2>";
				for(var i of testarray){
					content += 		"<div><p class='firsLevel'><span class='left'>Id:" + i.id +"</span></p>"
												+"<p class='firstLevel'><span class='left'>Datatype: </span><input type='text' class='iField' name='iDatatype' value='"+ i.datatype+"' disabled></p>"
												+"<p class='firstLevel'><span class='left'>Services</span></p>"
												+"<p class='secondLevel'><span class='left'>Doc: </span><input type='text' class='iField' name='iDoc' value='" + i.services.doc + "' disabled></p>"
												+"<p class='secondLevel'><span class='left'>Tag</span></p>"
												+"<p class='thirdLevel'><span class='left'>Tagname: </span>";
												for (var j of i.services.tag)
																content += j.tagname + " ";
												content+= "</p>"
												+"<p class='secondLevel'><span class='left'>Url: </span><input type='text' class='iField' name='iUrl' value='"+ i.services.url +"' disabled></p>"
												+"<p class='secondLevel'><span class='left'>Origin: </span><input type='text' class='iField' name='iOrigin' value='" + i.services.origin + "' disabled></p>"
												+"<p class='secondLevel'><span class='left'>dataFormats: </span><input type='text' class='iField' name='iDataFormats' value='" + i.services.dataFormats + "' disabled></p>"
												+"<input type='button' value='Edit' onClick='activate(this);'><input type='button' style='display:none' value='Submit' onClick='update(this);'><hr></div>";
			}
			content +="</div></div>"
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("<html><head><title>Form</title><style>.firstLevel{margin-left:20px;}.secondLevel{margin-left: 60px;}.thirdLevel{margin-left:100px;}.left{font-weight: bold;}."
			+"leftDiv{display:inline-block;float:left;width:50%;}.rightDiv{display:inline-block;float:left;width:50%;}</style><script type='text/javascript'>"
			+"function activate(element){var x = element.parentElement.childNodes; for(var i = 0; i < x.length; i++){var y = x[i].childNodes;"
			+"for(var j = 0; j < y.length; j++){y[j].disabled = !y[j].disabled;}} if(element.value === 'Edit'){element.value='Cancel'; element.nextSibling.style.display = 'inline-block'; }"
			+"else{element.value='Edit'; element.nextSibling.style.display= 'none';}} function update(element){var obj; obj.identifier='Hallo'; obj.data='null' }</script></head><body>" + content + "</body></html>");
	    res.end();
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
