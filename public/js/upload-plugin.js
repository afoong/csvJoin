(function( $ ){

  $.fn.uploader = function( options ) {

  	var settings = $.extend( {
  		beforeSend : function() {
	      console.log("before");
	    },
	    success : function(content) { 
	      console.log(content);
	    },
	    validate : function(files) { 
	      return files;
	    },
	    error : function(errs) {
	    	for(e in errs) {
	    		alert(e)
	    	}
	    },
	    done: function() {
	    	console.log("done")
	    }
    }, options);

    this.upload = function() { 
    	settings.beforeSend.apply(this);

	    if(settings.validate.apply(this, [this.find(":file")])) {
	    	iframeFileSubmit(this);
	   	}
	   	else {
	   		settings.error.apply(this);
	   	}

	   	return this;
	};

    /* 
		http://viralpatel.net/blogs/ajax-style-file-uploading-using-hidden-iframe/ 
	*/
    function iframeFileSubmit (form) {

     	// Create the iframe...
	    var iframe = document.createElement("iframe");
	    iframe.setAttribute("id", "upload_iframe");
	    iframe.setAttribute("name", "upload_iframe");
	    iframe.setAttribute("width", "0");
	    iframe.setAttribute("height", "0");
	    iframe.setAttribute("border", "0");
	    iframe.setAttribute("style", "width: 0; height: 0; border: none;");
	 
	    // Add to document...
	    form.parent().append(iframe);
	    window.frames['upload_iframe'].name = "upload_iframe";
	 
	    iframeId = document.getElementById("upload_iframe");
	 
	    // Add event...
	    var eventHandler = function () {
	    		var content;
	 
	            if (iframeId.detachEvent) iframeId.detachEvent("onload", eventHandler);
	            else iframeId.removeEventListener("load", eventHandler, false);
	 
	            // Message from server...
	            if (iframeId.contentDocument) {
	            	if(iframeId.contentDocument) {

	                	content = iframeId.contentDocument.body.innerHTML;
	            	}
	            } else if (iframeId.contentWindow) {
	            	if(iframeId.contentWindow.document) {

	                	content = iframeId.contentWindow.document.body.innerHTML;
	            	}
	            } else if (iframeId.document) {
	            	if(iframeId.document) {

	                	content = iframeId.document.body.innerHTML;
	            	}
	            }
	 
	            settings.success.apply(form, [content]);
	 
	            // Del the iframe...
	            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);

	   			settings.done.apply(this);
	        }
	 
	    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
	    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
	 
	    // Set properties of form...
	    form.attr("target", "upload_iframe");
	    form.attr("action", options.url);
	    form.attr("method", "post");
	    form.attr("enctype", "multipart/form-data");
	    form.attr("encoding", "multipart/form-data");
	 
	    // Submit the form...
	    form.submit();
    }

	return this;
  
  };

})( jQuery );
