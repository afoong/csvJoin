$(document).ready(function() {
	$('#submitCsvButton').click(function(e) {
		e.preventDefault();
		$.ajax({
			type: "POST", 
			url: "/process/join.ajax",
			beforeSend: startUpload,
			success: finishedUpload
		})
	})
});

function startUpload() {
	console.log('starting')
}

function finishedUpload() {

	console.log('finished')
}
