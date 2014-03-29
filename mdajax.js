//************************************************************************ 
//EXTEND x$ TO SUPPORT AJAX
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {
	var doc = window.document;
	var callbackError = function(xhr) {
		// throw new Error("Ajax Error: Missing callback" + xhr);
		alert(xhr);
	};

	var onReadyStateChange = function(options) {
		return function() {
			xhr = this;
			var type = "text/html";
			if(xhr.readyState === 4 && xhr.status === 200) {
				if(options.callback)
					options.callback.call(xhr, getResponse(type, xhr));
				else
					callbackError.call(xhr, getResponse(type, xhr));
			};
		}
	};

	function fileInput(doc) {
		node = x$.createElement("input", doc);
		
		node.setAttribute("type", "file");

		return node;
	}

	function multipartForm(doc) {
		node = x$.createElement("form", doc);
		
		node.setAttribute("enctype","multipart/form-data");
		node.setAttribute("method","post");

		return node;
	}

	function hiddenInput(doc){
		node = x$.createElement("input", doc);

		node.setAttribute("type", "hidden");

		return node;
	}
	// ************************************************************************ 
	// CREATE AN IE ACTIVE-X XMLHttpRequest OBJECT
	// ************************************************************************ 		
	function createActiveXHR() {
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {}
	}
	
	// ************************************************************************ 
	// CREATE A STANDARD XMLHttpRequest OBJECT
	// ************************************************************************ 		
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch(e) {}
	}
	
	// ************************************************************************ 
	// COPY A FORM AND ITS DATA ONTO A NEW FORM
	// ************************************************************************ 		
	function cloneForm(old) {
		var frm = old.cloneNode(true);
		if (old instanceof HTMLFormElement) {
			for(var i=0; i<old.length; i++) {
				if(old[i] && old[i].name){
					x$(frm[old[i].name]).setValue(x$(old[old[i].name]).getValue());
				}
			}
		}
		return frm;
	}
	// ************************************************************************ 
	// ENCODE AN OBJECT TO SATISFY THE FORM-URLENCODE FORMAT
	// ************************************************************************ 		
	function encodeFormData(data) {
		if(!data) return ""; // Always return a string
		var pairs = [];
		for(var name in data) {
			if(!data.hasOwnProperty(name)) continue;
			if(typeof data[name] === "function") continue;
			var value = data[name].toString();
			name = encodeURIComponent(name.replace(" ", "+"));
			value = encodeURIComponent(value.replace(" ", "+"));
			pairs.push(name + "=" + value);
		}
		return pairs.join('&');
	}

	function ajaxRAW(xhr, data) {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		if(data){
			xhr.send(data);
		} else {
			xhr.send(null);
		}
	};

	function ajaxJSON(xhr, data) {
		xhr.setRequestHeader("Content-Type", "application/json");
		if(data){
			xhr.send(data);
		} else {
			xhr.send(null);
		}
	};
	
	function ajaxFormUrlEncoded(xhr, data) {
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(encodeFormData(data));
	};
	
	function getResponse(contentType, xhr) {
        var ret;
        switch(contentType) {
            case "text/xml":
            	ret = xhr.responseXML;
                break;
            case "text/html":
            	ret = xhr.responseText;
            	break;
            case "application/json":
            	ret = JSON.parse(xhr.responseText);
                break;
            default:
            	ret = xhr.responseText;
                break;
        }
        return ret;
    };

	// ************************************************************************ 
	// CREATE REFERENCE TO XMLHttpRequest OBJECT
	// ************************************************************************ 		
	o.xhr = window.ActiveXObject ?
			function () {
				return createStandardXHR() || createActiveXHR();
			} : 
			createStandardXHR;

	// ************************************************************************ 
	// FUNCTION TO RETURN OR CREATE AN IFRAME FOR AJAX PURPPOSES
	// ************************************************************************ 		
	var iFrame = function ( ) {

		var elm = x$.createElement("iframe", doc),
			frag = doc.createDocumentFragment(),
			div = doc.getElementById("ajaxDiv") || doc.createElement("div");

		if ( ! doc.getElementById("ajaxDiv") )		
			div.setAttribute("id", "ajaxDiv");

		elm.style.display = 'none';

		frag.appendChild(elm);
		div.appendChild(frag);
		doc.body.appendChild(div);
		
		elm.contentDocument.write("<html><body></body></html>");

		return elm;
	};
	
	// ************************************************************************ 
	// POST FORM DATA USING AN IFRAME
	// ************************************************************************ 		
	o.ajaxIFrame = function ( parent, options ) { 

		var cb = options.callback?options.callback:callbackError,
			ifrm = iFrame();
		var callback = function() {
			var xhr = ifrm.contentDocument.body.innerHTML;

			x$(ifrm).remove();
			cb(xhr);
		};

		if (ifrm.attachEvent) ifrm.attachEvent('onload', callback);
		if (ifrm.addEventListener) ifrm.addEventListener('load', callback, false);

		parent.target = ifrm.name;
		
		parent.submit();
	};	
	
	// ************************************************************************ 
	// LOAD url USING AN IFRAME
	// ************************************************************************ 		
	o.iframeUrl = function( options ) { 

		var cb = options.callback,
			ifrm = iFrame( );
		
		var callback = function ( ) {

			var node = x$(options.selector, ifrm.contentDocument.body ).getNode( );

			if ( cb ) {

				cb( node );
			}

			x$( ifrm ).remove( );
		};

		x$.bind( ifrm, "load", callback );

		if ( options.url ) {

			ifrm.src = options.src;
		}
	};	

	// ************************************************************************ 
	// ADD A FILE INPUT TO A FORM FOR LATER UPLOAD
	// ************************************************************************ 		
	o.addFileToBatch = function ( fileNode, options ) { 

		var body = doc.body;

		//clone input file element
		var clone = fileNode.cloneNode( true ), form = null;

		// copy clone to the source form to replace the fileNode to move
		x$( fileNode ).appendBefore( clone );

		if ( x$.find('> form#xsfiles', body).length == 0 ) {

			form = multipartForm( doc );
			form.setAttribute( "action", options.url );
			form.setAttribute( "id", "xsfiles" );
			form.setAttribute( "display", "none" );
			x$( body ).insertLast( form );
		} else {

			form = x$.find( '> form#xsfiles', body )[ 0 ];
		}

		// move input file element to the transport form
		x$( form ).insertLast( fileNode );

		return form;
	};	

	// ************************************************************************ 
	// UPLOAD DATA FROM A FILE INPUT - USES AN IFRAME TRANSPORT
	// ************************************************************************ 		
	o.addFile = function(fileNode, options) { 
		var form = x$.addFileToBatch(fileNode, options);

		x$.ajaxIFrame(form, options);

		x$(form).remove();
	};	

	// ************************************************************************ 
	// BUNDLE DATA WITH STREAM - ADD DATA TO A TRANSPORT FORM
	// ************************************************************************ 		
	o.appendData = function(form, data, name){
		// create a hidden node with the data
		var hidden = hiddenInput(doc);
		// set the value
		hidden.setAttribute("value", data);
		hidden.setAttribute("name", name);

		// append to the form
		x$(form).insertLast(hidden);
	}

	// ************************************************************************ 
	// AJAX FUNCTIONALITY
	// options syntax {method:<method>,url:<url>,data:<data>,format:<format>}
	// ************************************************************************ 		
	o.ajax = function (options) {
		var xhr = o.xhr(), method=options.method?options.method:"get", url=options.url?options.url:doc.URL;

		xhr.open(method, url, true);
		
		xhr.onreadystatechange = onReadyStateChange.call(this, options);
		
		switch (options.format){
		case "JSON":
			ajaxJSON(xhr, options.data);
			break;
		case "FormUrlEncoded":
			ajaxFormUrlEncoded(xhr, options.data);
			break;
		default:
			ajaxRAW(xhr, options.data);
			break;
		}
	};

	var jsonp = {
		    callbackCounter: 0,

		    fetch: function(url, callback) {
		        var fn = 'JSONPCallback_' + this.callbackCounter++;
		        window[fn] = this.evalJSONP(callback);
		        url = url.replace('=JSONPCallback', '=' + fn);

		        var scriptTag = document.createElement('SCRIPT');
		        scriptTag.src = url;
		        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
		    },

		    evalJSONP: function(callback) {
		        return function(data) {
		            var validJSON = false;
			    if (typeof data == "string") {
			        try {validJSON = JSON.parse(data);} catch (e) {
			            /*invalid JSON*/}
			    } else {
			        validJSON = JSON.parse(JSON.stringify(data));
		                window.console && console.warn(
			            'response data was not a JSON string');
		            }
		            if (validJSON) {
		                callback(validJSON);
		            } else {
		                throw("JSONP call returned invalid or empty JSON");
		            }
		        }
		    }
		};
	
	o.jsonp = jsonp;
}(x$));