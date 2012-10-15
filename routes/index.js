
/*
 * routes
 */
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs'),
    csv = require('ya-csv'),
    mr = require('map-reduce');

exports.index = function(req, res){
  res.render('index', { title: 'Home of the join CSV app', content: 'home' })
};

exports.join = function(req, res){
  res.render('index', { title: 'Join the CSVs', content: 'join' })
};


exports.processCsvs = function(req, res){

	processFilesAndJoin(req, res, function(joined) {
		res.send(joined);
	});
};

function processFilesAndJoin(req, res, last) {
	var form = formidable.IncomingForm();

	form.keepExtensions = true;
	form.parse(req, function(err, fields, files) {});

	var reader = csv.createCsvStreamReader(process.openStdin());
	var join = {};

	var storeData = function(data) {
	    var pk = "a" + data[0];
	    if(!(pk in join)) {
	    	join[pk] = [];
	    }

	    join[pk].push(data);
	}


    reader.addListener('data', function(data) {
	    storeData(data);
	});
	reader.addListener('end', function() {
		// console.log(join);
	});
	
	form.onPart = function(part) {
	    if (!part.filename) { upload_form.handlePart(part); return }

		reader.addListener('err', function(err) { if(err) throw err; });

	    part.on('data', function(buffer) {
	        // Pipe incoming data into the reader.
	        reader.parse(buffer.toString());
	    });
	    part.on('end', function() {});
	}

	form.on('end', function() {
		reader.end();

		last(join)
	})

}
