// TODO: Schemas, display all countries

// import libraries
var express = require('express');
var router = express.Router();
var js2xmlparser = require('js2xmlparser');
var xmlparser = require('express-xml-bodyparser');
var bodyParser = require('body-parser');
var dbConnect = require('./dbConnect.js');





// Show all results
router.get('/', function(req, res, next) {
	let sql = "SELECT Code, Name FROM country";
	let query = dbConnect.query(sql, (err, results) => {
		if(err) throw err;

		var endResult = [];
		var result = results.map(function(val) {
		  return val.Name;
		}).join(';');

		var resultCode = results.map(function(val) {
		  return val.Code;
		}).join(';');
		
		endResult.push(resultCode);
		endResult.push(result);	
		res.send(JSON.stringify(endResult));		
		
	});
});


// Show single result
router.get('/:code',function(req, res) {
	
	// get body from request
	let data = [
		req.params.code,
		req.params.code,
		req.params.code
	];

	let sql = "SELECT * FROM country WHERE Code = ?;SELECT Name, CountryCode, Population FROM city WHERE CountryCode = ?;SELECT CountryCode, Language, IsOfficial, Percentage FROM countrylanguage WHERE CountryCode = ?";
	let query = dbConnect.query(sql, data, (err, results) => {
		if(err) throw err;

		// gets all tables and sorts city and languages in subcategories
		for(var i = 0; i <= results[0].length - 1; i++){
			var cities = [];
			var lang = [];

			for (var x = 0; x <= results[1].length - 1; x++){
				if (results[0][i].Code == results[1][x].CountryCode){
					cities.push(results[1][x]);
				}
			}

			results[0][i].Cities = cities;

			for (var x = 0; x <= results[2].length - 1; x++){
				if (results[0][i].Code == results[2][x].CountryCode){
					lang.push(results[2][x]);
				}
			}

			results[0][i].Languages = lang;
			
		}

		results.pop();
		results.pop();

		//console.log("asd");

		// if url contains xml it should parse json to xml
		if (req.headers['content-type'] == "application/xml"){

			// Parser method (not allowed to use)
			/*results = js2xmlparser.parse("country", results);
			var s = results.replace("<country>", "<countries xmlns=''>");
			var s2 = s.replace(/.{8}$/,"countries>");	
			res.send(s2); */


			var xmlString = "<?xml version=\"1.0\"?>\n";
			xmlString += "<Countries xmlns:xs=\"schema.xsd\">\n";
			xmlString += "<Country>\n";
			Object.keys(results[0][0]).forEach(function(key) {
			    var value = results[0][0][key];
			    if (Array.isArray(value)){
				    if (key == "Cities"){
				    	xmlString += "<Cities>\n";
				    } else if (key == "Languages"){
				    	xmlString += "</Cities>\n";
				    	xmlString += "<Languages>\n";
				    }
					value.forEach(function (item, index) {
					    if (key == "Cities"){
					    	xmlString += "<City>\n";
					    } else if (key == "Languages"){
					    	xmlString += "<Language>\n";
					    }

						Object.keys(item).forEach(function(subKey) {
							var subValue = item[subKey];
						  	xmlString += "<" + subKey + ">" + subValue + "</" + subKey + ">\n";
						});

					    if (key == "Cities"){
					    	xmlString += "</City>\n";
					    } else if (key == "Languages"){
					    	xmlString += "</Language>\n";
					    }
					});


			    } else {
			    	xmlString += "<" + key + ">" + value + "</" + key + ">\n";
			    }
			    
			});

			xmlString += "</Languages>\n";
			xmlString += "</Country>\n";
			xmlString += "</Countries>\n";

			res.charset = 'utf-8';
			res.send(xmlString);
		} else {
			res.send(results[0][0]);
		}

		//console.log(req.get("Content-Header"));
		//js2xmlparser.parse("country", results)
	});

});


//add new country
router.post('/', function (req, res) {

	let data = [];
	if (req.headers['content-type'] == "application/xml"){
		data = [
			req.body.data.code,
			req.body.data.name,
			req.body.data.continent,
			req.body.data.region,
			req.body.data.surfacearea,
			req.body.data.population,
			req.body.data.lifeexpectancy,
			req.body.data.gnp,
			req.body.data.headofstate,
			req.body.data.capital,
			req.body.data.code2
		];

	} else if (req.headers['content-type'] == "application/json"){
		// gets post values
		data = [
			req.body.Code,
			req.body.Name,
			req.body.Continent,
			req.body.Region,
			req.body.SurfaceArea,
			req.body.Population,
			req.body.LifeExpectancy,
			req.body.GNP,
			req.body.HeadOfState,
			req.body.Capital,
			req.body.Code2
		];
	}

	console.log(req.headers['content-type']);
	

	let sql = "INSERT INTO country VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	let query = dbConnect.query(sql, data,(err, results) => {
		if(err) throw err;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

//update country
router.put('/:code', function (req, res) {

	let data = {};
	if (req.headers['content-type'] == "application/xml"){
		data = {
			Code: req.body.data.code,
			Name: req.body.data.name,
			Continent: req.body.data.continent,
			Region: req.body.data.region,
			SurfaceArea: req.body.data.surfacearea,
			Population: req.body.data.population,
			LifeExpectancy: req.body.data.lifeexpectancy,
			GNP: req.body.data.gnp,
			HeadOfState: req.body.data.headofstate,
			Capital: req.body.data.capital,
			Code2: req.body.data.code2
		};
	} else if (req.header['content-type'] == "application/json"){
		//gets all post values
		data = {
			Code: req.body.Code,
			Name: req.body.Name,
			Continent: req.body.Continent,
			Region: req.body.Region,
			SurfaceArea: req.body.SurfaceArea,
			Population: req.body.Population,
			LifeExpectancy: req.body.LifeExpectancy,
			GNP: req.body.GNP,
			HeadOfState: req.body.HeadOfState,
			Capital: req.body.Capital,
			Code2: req.body.Code2
		};
	}

	

	let sql = "UPDATE country SET ? WHERE Code = '" + req.params.code + "'";
	let query = dbConnect.query(sql, data, (err, results) => {
		if(err) throw err;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});

//Delete country
router.delete('/:code',function (req, res) {
	let sql = "DELETE FROM country WHERE Code = '" + req.params.code + "'";
	let query = dbConnect.query(sql, (err, results) => {
		if(err) throw err;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
});


module.exports = router;