
/*
 * routes
 */

// joinService does does all the work to keep this file small, light, and readable
var joinService = require('../services/joinService.js');

var formidable = require('formidable'); // handle receving files from upload

// Route Handling
this.join = function(req, res){
  res.render('upload', { title: 'Join the CSVs', content: 'join' })
};


this.processCsvs = function(req, res){
	var form = formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {});

	try {
		joinService.processFilesAndJoin(form, function(joined) {
			res.partial('partials/stats', {data: joined});
		});
	}
	catch(e) {
		// as a fail safe for the above service. here, so that we still have res in scope	
		res.send("Please refresh your page and try again."); 
	}
};
