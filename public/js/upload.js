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
	// $('#csvForm').removeClass('error');
	// $('#errors').html("");

	console.log('starting');
}

function success(data) {
	console.log("data: " + data);
}

function validate(files) {
	console.log("vald" + files)
	return files;
	// var err = false;

 //   	var errList = document.createElement("ul");

	// if($(form).find(":file").length < 2) {
 //   		var notEnoughFiles = document.createElement("li");
 //   		$(notEnoughFiles).text("You do not have enough files")
	// 	$(errList).append('')
	// 	err = true;
	// }

	// if(err) {
	// 	$(form).addClass('error');
	// 	$('#formDiv#errors').append(errList);
	// }

	// return !err;
}

function error(errs) {

}

function done() {
	console.log('finished');
}