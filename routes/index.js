
/*
 * routes
 */
var formidable = require('formidable'),
    util = require('util');

exports.index = function(req, res){
  res.render('index', { title: 'Home of the join CSV app', content: 'home' })
};

exports.join = function(req, res){
  res.render('index', { title: 'Join the CSVs', content: 'join' })
};

exports.processCsvs = function(req, res){
	var form = formidable.IncomingForm();
		console.log('fweaf')

	form.parse(req, function(err, fields, files) {
		console.log('fweaf')

      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
	});
	return;
};