
/**
 * jQuery ajax upload plugin
 * uses the iframe technique
 */
(function( $ ){

  // create the jQuery plugin
  $.fn.uploader = function( options ) {

  	// if the options were not specified, give them defaults
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

  	// control flow for the upload action
    this.upload = function() { 
    	// before uploading, call before send with this object's context
    	settings.beforeSend.apply(this);

    	// make sure you validate (we're looking for file inputs)
	    if(settings.validate.apply(this, [this.find(":file")])) {
	    	iframeFileSubmit(this);
	   	}
	   	else {
	   		// validate failed, so.. error
	   		settings.error.apply(this);
	   	}

	   	// return this for chaining
	   	return this;
	};

    /**
     * Andrew did not come up with this on his own
     * he copied from the internets and modified it: 
	 *	
	 * http://viralpatel.net/blogs/ajax-style-file-uploading-using-hidden-iframe/ 
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
	 
	 			// successfully got the response from the upload
	            settings.success.apply(form, [content]);
	 
	            // Del the iframe...
	            setTimeout('iframeId.parentNode.removeChild(iframeId)', 250);

	            // call the done function so plugin users know when this is finished.
	   			settings.done.apply(this);
	        }
	 
	    if (iframeId.addEventListener) iframeId.addEventListener("load", eventHandler, true);
	    if (iframeId.attachEvent) iframeId.attachEvent("onload", eventHandler);
	 
	    // Set properties of form...

	    // target is where to send the response
	    form.attr("target", "upload_iframe");
	    // action is the url to submit to
	    form.attr("action", options.url);
	    form.attr("method", "post");
	    form.attr("enctype", "multipart/form-data");
	    form.attr("encoding", "multipart/form-data");
	 
	    // Submit the form...
	    form.submit();
    }

    // support jQuery chaining
	return this;
  
  };

})( jQuery );
