//************************************************************************ 
//	EXTEND x$ TO SUPPORT DATA CAPTURE FROM THE WEB
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdarray.js, mdtemplates.js
//************************************************************************ 		
(function(o) {

	var e = function( elem, options ) {
		var 
			_contentList, 
			_form, 
			_array = [ ];

		var save = function ( ) {

			_form = new x$.template( x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode() );
			
			// Add a new record 
			_array[ _array.length ] = _form.getData( );

			// Move row pointer to the last record.
			_contentList.setRow( _array.length );
		};

		options.size = options.size ? options.size : 1;

		// Reuse contentlist functionality
		_contentList = new x$.contentList( elem, _array, options );

		return {
			save: save
		}
	};

	o.dataCapture = o.dataCapture || e;
}(x$));