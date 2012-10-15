/**
 * A Service to handle processing files from the request
 */
function JoinService() {

	var csv = require('ya-csv'); // csv parser


	/**
	 * process the files from the request
	 * 
	 * form - a formidable form object
	 * callback - the callback
	 */
	this.processFilesAndJoin = function(form, callback) {
		// create the reader
		var reader = csv.createCsvStreamReader(process.openStdin());
		// this is where we cache the csv data
		var join = {};

		// this closure closes on join
		var storeData = function(data) {
		    var pk = "a" + data[0];
		    if(!(pk in join)) {
		    	// if the employee has not been added, create an empty doucment for them
		    	join[pk] = {e: [], s: []}; 
		    }

		    // this is the employee's basic information
		    if(data.length == 6) {
		    	join[pk]["e"] = data;
		    }
		    // this is hte employee's salary information
		    else if(data.length == 4) {
		    	join[pk]["s"].push(data);
		    }
		}

		// when data comes in, cache it
	    reader.addListener('data', function(data) {
		    storeData(data);
		});
		// this gets called when one file finished being processed
		reader.addListener('end', function() {
			// console.log(join);
		});
		
		// handle the parts that get uploaded
		form.onPart = function(part) {
			// delegate to formidable to handle the parts that arent files
		    if (!part.filename) { upload_form.handlePart(part); return }

		    // throw all errors!
			reader.addListener('err', function(err) { if(err) throw err; });

		    part.on('data', function(buffer) {
		        // Pipe incoming data into the reader.
		        reader.parse(buffer.toString());
		    });
		    part.on('end', function() {});
		}

		// when the form data is finished processing/caching close the reader and continue
		form.on('end', function() {
			reader.end();

			callback(join)
		})
	}
};

var service = new JoinService();

// export this service so others can use it
module.exports = service;

