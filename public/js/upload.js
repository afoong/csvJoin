$(document).ready(function() {

	var csvForm = $("#csvForm").uploader({
		url: "/process/join.ajax",
		beforeSend: beforeSend,
		success: success,
		validate: validate,
		error: error,
		done: done
	})

	$('#submitCsvButton').click(function(e) {
		e.preventDefault();
		csvForm.upload().hide().show();
	})
});

function beforeSend() {
	$('#errors').html("");

	console.log('starting');
}

function success(data) {
	console.log("data: " + data);
}

function validate(files) {
	var pass = true;

   	var errList = document.createElement("ul");

   	if(files.length == 2) {
		if(files[0].value && files[1].value) {
			pass = true;
		}
		else {
	   		$(errList).append(createError("You do not have enough files"));
			pass = false;
		}
		
		if(files[0].value && !isCSV(files[0].value)) {
	   		$(errList).append(createError("Your first file may not be a csv. Please check the file extension"));
			pass = false;
		}
		
		if(files[1].value && !isCSV(files[1].value)) {

	   		$(errList).append(createError("Your second file may not be a csv. Please check the file extension"));
			
		}
   	}
   	else {
   		$(errList).append(createError("Your form does not have enough files"));
		pass = false;

   	}



	if(!pass) {
		$('#errors').html(errList);
	}

	return pass;
}

function isCSV(fname) {
	return fname.match(/.*\.csv\b/i);
}

function error(errs) {

}

function done() {
	console.log('finished');
}

function createError(msg) {
	var error = document.createElement("li");
	var errorText = document.createElement("span");
	$(errorText).text(msg).addClass("label").addClass("label-important");
	$(error).append(errorText);
	return error;
}