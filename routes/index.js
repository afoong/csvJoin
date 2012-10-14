
/*
 * routes
 */
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs'),
    csv = require('csv');

exports.index = function(req, res){
  res.render('index', { title: 'Home of the join CSV app', content: 'home' })
};

exports.join = function(req, res){
  res.render('index', { title: 'Join the CSVs', content: 'join' })
};


exports.processCsvs = function(req, res){
	processFilesAndJoin(req, res, finishedJoining);
};

function processFilesAndJoin(req, res, last) {
	var form = formidable.IncomingForm();
	
	form.uploadDir = "./uploads";
	form.keepExtensions = true;

	form.parse(req, function(err, fields, files) {
		// send what we need down the callback chain
		var context = {
			fileNames: [],
			last: last,
			req: req,
			res: res
		};

		eachFile.apply(context, [
			files, 							// process these files
			'f', 							// key prefix
			1, 								// index to start with (f1, f2)
			Object.keys(files).length + 1, 	// process stop condition
			function(file) { 				// how to process each item
				context.fileNames.push(file.path)
			}, 
			join 							// call this when done
		]);

	});
}

function join() {
	this.last.apply(this)
}

function finishedJoining() {

	eachFile.apply(this, [
		this.fileNames, 					// proccess these strings
		'', 								// array, so no prefix
		0, 									// index to start on
		this.fileNames.length, 			// process stop condition
		function(name) {					// how to process each item
			console.log('attempt delete of '+ name)
			fs.unlink(name, function (err) {
				if (err) throw err;
				console.log(name)
				console.log("delete: "+ name)
			});
		},
		function() {						// call this when done
			console.log("done")
			this.res.send("fewafe");
		}
	]);
}

function eachFile(files, prefix, idx, size, action, cb) {
	if(idx < size) {
		var file = files[prefix+idx];
		action(file);
		idx++;
		eachFile.apply(this, arguments);
	}
	else if(idx == size) {
		cb.apply(this);
	}
}