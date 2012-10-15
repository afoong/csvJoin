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
		csvForm.upload();
	})

	$(".employeeName a").live('click', function(e) {
		var sal = $(this).parent().data("salary")
		salaryModal($(this).text(), sal);
	})

});

function salaryModal(name, sals) {
	$('#currEmployee').text(" " + name);

	$('#salModal .modal-body').append(createSalaryTable(sals, ["Salary ($)", "Pay Period Start", "Pay Period End"]));


	$('#salModal').show().modal('show')
}

function beforeSend() {
	clearErrors();
	$('#feedback').append(createProgressBar("uploadProgress"));

	updateProgressById("uploadProgress", 10)
	console.log('starting');
}

function success(data) {
	var dataObj = data;
	updateProgressById("uploadProgress", 75)
	displayStats(dataObj);

}

function validate(files) {
	var pass = true;

   	var errList = document.createElement("ul");

	updateProgressById("uploadProgress", 25)

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
		clearFeedback();
	}

	return pass;
}

function isCSV(fname) {
	return fname.match(/.*\.csv\b/i);
}

function error(errs) {

}

function done() {
	updateProgressById("uploadProgress", 95)

	console.log('finished');
}

function createError(msg) {
	var error = document.createElement("li");
	var errorText = document.createElement("span");
	$(errorText).text(msg).addClass("label").addClass("label-important");
	$(error).append(errorText);
	return error;
}

function createProgressBar(id) {
	var progress = document.createElement("div");
	var bar = document.createElement("div");
	$(progress).attr("id", id).addClass("progress").addClass("progress-striped").addClass("active");
	$(bar).addClass("bar");
	$(progress).append(bar);

	return progress;
}

function createSalaryTable(sals, headers) {
	var tab = document.createElement("table");

	$(tab).addClass('table').addClass('table-striped').addClass('table-bordered');

	var heads = document.createElement("tr");
	for(var i =0; i < headers.length; i++) {
		var th = document.createElement("th");
		$(th).text(headers[i]);
		$(heads).append(th)
	}

	$(tab).append(heads);

	for(var i = 0 ; i < sals.length; i++) {

		var dRow = document.createElement("tr");

		for(var j = 1; j < sals[i].length; j++) {
			var td = document.createElement("td");
			$(td).text(sals[i][j]);
			$(dRow).append(td);
		}

		$(tab).append(dRow);
	}

	return tab;
}

function clearErrors() {
	$('#errors').html("");
}

function clearFeedback() {
	$('#feedback').html("");
}

function updateProgressById(id, percent) {
	$("#"+id+ " .bar").width(percent + "%");
}

function displayStats(d) {

	$('#data').html(d);

	setTimeout(function() {

		clearFeedback();
	}, 1000)
}