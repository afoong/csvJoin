
/*
 * routes
 */
var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs'),
    csv = require('csv'),
    mr = require('map-reduce');

exports.index = function(req, res){
  res.render('index', { title: 'Home of the join CSV app', content: 'home' })
};

exports.join = function(req, res){
  res.render('index', { title: 'Join the CSVs', content: 'join' })
};


exports.processCsvs = function(req, res){
	processFilesAndJoin(req, res, function() {});
};

function processFilesAndJoin(req, res, last) {
	var form = formidable.IncomingForm();
	
	form.uploadDir = "./uploads";
	form.keepExtensions = true;

	form.parse(req, function(err, fields, files) {
		
		mr({
			on: files,
			map: function(emit, value, key) {
				console.log('map called: ' + key)
				// console.log(value)

				emit.next(value);
			},
			reduce: function(partial, curr) {
				console.log('reduce called: ')
				// console.log(partial)
				// console.log(curr)

				if(!partial) {
					// base case, nothing reduced yet
					return [curr]
				}
				else {
    				partial.unshift(curr)
    				// console.log("aftershift")
    				// console.log(partial)
					return partial 
				}

			},
			done: function(err, reduced) {
				console.log('done')
				console.log(reduced)
			}
		})
		
	});
}

