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
			_array = [ ];

		var add = function ( ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();
			var tmplt = new x$.template( form );
			
			// Add a new record 
			_array[ _array.length ] = tmplt.getData( );

			form.reset( );

			// Move row pointer to the last record.
			_contentList.getIterator( ).gotoRow( _array.length )
		};

		var newRecord = function ( ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			form.reset( );

			unsetState( "edit" );
			setState( "new" );
		};

		var update = function ( ) {
			
			var curRow = _contentList.getIterator( ).getCurrentRow( );
			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();
			var tmplt = new x$.template( form );
			
			// Update the existing record
			_array[ curRow ] = tmplt.getData( );

			return true;
		};

		var remove = function ( ) {
			
			var curRow = _contentList.getIterator( ).getCurrentRow( );
			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			// Remove the existing record from _array
			if ( _array[curRow] ) {

				_array.splice( curRow, 1 );

				if( _array.length > 0 ){

					_contentList.getIterator( ).previous( );
					_contentList.updateDisplay( );
				} else {
					var add = x$("#add"),
						submit = x$("#submit"),
						update = x$("#update"),
						remove = x$("#remove");

					form.reset( );
					unsetState( "edit" );
					setState( "new" );
				}
			}
			return true;
		};

		var submit = function ( ) {
			
			return JSON.stringify( _array );
		};
		
		options.size = options.size ? options.size : 1;

		// Reuse contentlist functionality
		_contentList = new x$.contentList( elem, _array, options );

		function unsetState( state ) {

			var add = x$("#add"),
				newRecord = x$("#new_record"),
				// submit = x$("#submit"),
				update = x$("#update"),
				remove = x$("#remove");

			add.removeClass( state );
			newRecord.removeClass( state );
			// submit.removeClass( state );
			update.removeClass( state );
			remove.removeClass( state );
		}

		function setState( state ) {

			var add = x$("#add"),
				newRecord = x$("#new_record"),
				// submit = x$("#submit"),
				update = x$("#update"),
				remove = x$("#remove");

			add.addClass( state );
			newRecord.addClass( state );
			// submit.addClass( state );
			update.addClass( state );
			remove.addClass( state );
		}

		function updateControls( args ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			if ( ! (args[1].data.getTotalRows() === 0) ) {

				unsetState( "new" );
				setState( "edit" );
			} else {
				form.reset( );

				unsetState( "edit" );
				setState( "new" );
			}
		}

		x$.bind( _contentList.getIterator() , "next", updateControls );
		x$.bind( _contentList.getIterator() , "previous", updateControls );
		x$.bind( _contentList.getIterator() , "first", updateControls );
		x$.bind( _contentList.getIterator() , "last", updateControls );

		return {
			add: add,
			newRecord: newRecord,
			update: update,
			remove: remove,
			submit: submit
		}
	};

	o.dataCapture = o.dataCapture || e;
}(x$));

// 	function add( ) {

// 		dc.add( );

// 	 	return false;
// 	}

// 	function update( ) {

// 		dc.update( );

// 	 	return false;
// 	}

// 	function rem( ) {

// 		dc.remove( );

// 		return false;
// 	}

// 	function sub( ) {

// 		alert( dc.submit( ) );

// 		return false;
// 	}

// 	function newRecord( ) {

// 		dc.newRecord( );

// 		return false;
// 	}

// window.onload = function ( ) {

// 	var dc = new x$.dataCapture( x$("#datacapture").getNode(), {size:1} );
// }