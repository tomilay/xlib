// ************************************************************************ 
// EXTEND x$ TO SUPPORT INPUT CONTROLS
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
// ************************************************************************ 		
(function(o) {

	// ************************************************************************ 
	// WRAP OBJECT o IN STRING TAG d
	// ************************************************************************ 		
	function wrap( o, d ) {

		return o && d + o.toString( ) + d || d + d;
	};

	function unset( inpt ) {

		x$.each( inpt, function ( index, value ) {

			if( value.checked )
				value.checked = false;

			if( value.selected )
				value.checked = false;
		} );
	};

	function processAs( inpt ) {
		
		if ( x$.isArray(inpt) ) 
			return "array";

		if ( inpt.type )
			return "type";

		if ( inpt.tagName ) 
			return "tagName";
	}

	var e = function ( inpt ) {

		var pa = processAs( inpt );
		
		var getValue = function ( ) {

			var ret;

			switch ( pa ) {
				case "type":
					switch ( inpt.type ) {

						case "checkbox":
							ret = inpt.checked;

							break;
						case "radio":
							ret = inpt.checked;

							break;
						case "text":
							ret = wrap( inpt.value, "" );

							break;
						case "password":
							ret = wrap( inpt.value, "" );

							break;
						case "file":
							ret = wrap( inpt.value, "" );

							break;
						case "image":
							ret = wrap( inpt.src, "" );

							break;
						case "select-one":
							ret = wrap( inpt.value, "" );

							break;
						case "select-multiple":
							ret = {};

							for( var i = 0; i < inpt.length; i++ ) {
								
								if ( inpt[i].selected ) {

									ret[i] = wrap( inpt[i].value, "" );
								}
							}
							break;
						case "textarea":
							ret = wrap( inpt.value, "" );

							break;
					}
					break;
				case "array":
					// Checkbox and radio button groups
					ret = {};

					for( var i = 0; i < inpt.length; i++ ) {
						
						if ( inpt[i].checked ) {

							ret[i] = wrap( inpt[i].value, "" );
						}
					}
					break;
				case "tagName":
					switch( inpt.tagName.toUpperCase() ) {
						case "SPAN":
							ret = inpt.innerHTML;

							break;
						case "DIV":
							ret = inpt.innerHTML;

							break;
						case "IMG":
							ret = inpt.src;

							break;
					}
					break;
			}
			return ret;
		};

		var setValue = function ( val ) {

			switch ( pa ) {
				case "type":
					switch ( inpt.type ) {
						case "checkbox":
							inpt.checked = val;

							break;
						case "radio":
							inpt.checked = val;

							break;
						case "text":
							inpt.value = val;

							break;
						case "password":
							inpt.value = val;

							break;
						case "file":
							inpt.value = val;

							break;
						case "image":
							inpt.src = val;

							break;
						case "select-one":
							inpt.value = val;

							break;
						case "select-multiple":
							unset( inpt );

							x$.each( val, function( i, v ) {

								function comp( opt ) {

									if ( opt.value === v )
										opt.selected = true;
								}

								x$.map( inpt, comp );
							} );
							break;
						case "textarea":
							inpt.value = val;

							break;
					}
					break;
				case "array":
					unset( inpt );

					x$.each( val, function( i, v ) {

						function comp( opt ) {

							if ( opt.value === v )
								opt.checked = true;
						}

						x$.map( inpt, comp );
					} );
					break;
				case "tagName":
					switch( inpt.tagName.toUpperCase() ) {
						case "SPAN":
							inpt.innerHTML = val;

							break;
						case "DIV":
							inpt.innerHTML = val;
							
							break;
						case "IMG":
							inpt.src = val;

							break;
					}
					break;
			}

			return this;
		};

		var getDataBind = function ( ) {

			var elem;

			if( x$.isArray(inpt) )
				elem = inpt[0];
			else
				elem = inpt;

			return elem.attributes["data-bind"] ? elem.attributes["data-bind"].value : undefined;
		};

		return {
			getValue : getValue,
			setValue : setValue,
			getDataBind: getDataBind
		}
	};

	o.input =  o.input || e;
}(x$));