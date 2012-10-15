$(document).ready(function() {

	// jQuery uploader plugin
	// the options are fairly self explanitory
	// I tried to follow jQuery.ajax naming conventions
	var csvForm = $("#csvForm").uploader({
		url: "/process/join.ajax",
		beforeSend: beforeSend,
		success: success,
		validate: validate,
		done: done
	})

	// upload the form on click
	$('#submitCsvButton').click(function(e) {
		e.preventDefault();
		csvForm.upload();
	})

	// whenever employee names get put into the dom, attach this event
	$(".employeeName a").live('click', function(e) {
		var sal = $(this).parent().data("salary") // get the dom cached data
		salaryModal($(this).text(), sal); // present salary info
	})

	// when the salary popup closes, clear out the data
	$('#salModal').live('hide', function () {
		clearModal();
	})

});

// before uploading to the server, start a progress bar
function beforeSend() {
	clearErrors();
	$('#feedback').append(createProgressBar("uploadProgress"));

	updateProgressById("uploadProgress", 10)
	// console.log('starting');
}

// when data has been successfully received from the server, 
// update progress and display the table
function success(data) {
	updateProgressById("uploadProgress", 75)
	displayBasicStats(data);
}

// pre upload validation
function validate(files) {
	var pass = true;

   	var errList = document.createElement("ul");

	updateProgressById("uploadProgress", 25)

   	if(files.length == 2) {
		if(files[0].value && files[1].value) {
			pass = true;
		}
		// do both files exist?
		else { 
	   		$(errList).append(createError("You do not have enough files"));
			pass = false;
		}
		// first file does not end in csv
		if(files[0].value && !isCSV(files[0].value)) { 
	   		$(errList).append(createError("Your first file may not be a csv. Please check the file extension"));
			pass = false;
		}
		// second file does not end in csv
		if(files[1].value && !isCSV(files[1].value)) { // second file does not end in csv

	   		$(errList).append(createError("Your second file may not be a csv. Please check the file extension"));
			
		}
   	}
   	else {
   		// the form itself does not have two inputs of type file
   		$(errList).append(createError("Your form does not have enough files"));
		pass = false;

   	}

   	// if we didnt pass clear the progress bar and display the errors
	if(!pass) {
		$('#errors').html(errList);
		clearFeedback();
	}

	return pass;
}

// returns true of string ends in .csv
function isCSV(fname) {
	return fname.match(/.*\.csv\b/i);
}

// the upload is done and the data has been displayed.. to the bar!
function done() {
	updateProgressById("uploadProgress", 95)

	// console.log('finished');
}

// display the salary modal for a specfic employee's information
function salaryModal(name, sals) {
	$('#currEmployee').text(" " + name);

	$('#salModal .modal-body').append(createSalaryTable(sals, ["Salary ($)", "Pay Period Start", "Pay Period End"]));

	$('#salModal').show().modal('show')
}

// reusable error li element creator
function createError(msg) {
	var error = document.createElement("li");
	var errorText = document.createElement("span");
	$(errorText).text(msg).addClass("label").addClass("label-important");
	$(error).append(errorText);
	return error;
}

// reusable bootstrap progress bar creator
function createProgressBar(id) {
	var progress = document.createElement("div");
	var bar = document.createElement("div");
	$(progress).attr("id", id).addClass("progress").addClass("progress-striped").addClass("active");
	$(bar).addClass("bar");
	$(progress).append(bar);

	return progress;
}

// create the salary table
function createSalaryTable(sals, headers) {
	var tab = document.createElement("table");

	$(tab).addClass('table').addClass('table-striped').addClass('table-bordered');

	var heads = document.createElement("tr");

	// iterate and create the headers
	for(var i =0; i < headers.length; i++) {
		var th = document.createElement("th");
		$(th).text(headers[i]);
		$(heads).append(th)
	}

	$(tab).append(heads);

	// for each salary data set for a date range
	for(var i = 0 ; i < sals.length; i++) {

		var dRow = document.createElement("tr");

		// for each value in the current salary data set
		for(var j = 1; j < sals[i].length; j++) {
			var td = document.createElement("td");
			$(td).text(sals[i][j]);
			$(dRow).append(td);
		}

		$(tab).append(dRow);
	}

	return tab;
}

// blast out the errors
function clearErrors() {
	$('#errors').html("");
}

// blast out the progress bar area
function clearFeedback() {
	$('#feedback').html("");
}

// blast out the modal's employee specific text
function clearModal() {
	$('#currEmployee').text("")
	$('#salModal .modal-body').html("");
}

// update a specific progress bar
function updateProgressById(id, percent) {
	$("#"+id+ " .bar").width(percent + "%");
}

// display the table and let the user see the progress bar before we clear it
// users like progress bars
function displayBasicStats(d) {

	$('#data').html(d);

	setTimeout(function() {

		clearFeedback();
	}, 1000)
}