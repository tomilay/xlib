//************************************************************************ 
//	EXTEND x$ TO SUPPORT DATA CAPTURE FROM THE WEB
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdarray.js, mdtemplates.js
//************************************************************************ 	
(function(o) {

	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	var e = function( sel, options ) {

		var 
			_contentList, 
			_array = [ ],
			elem;

		x$.ready( function ( ) {

			elem = x$( sel ).getNode( );

			options.size = options.size ? options.size : 1;

			x$.bind( x$(">div.contentarea>ul", elem).getNode(), "click", userClick );

			// Reuse contentlist functionality
			_contentList = new x$.contentList( elem, _array, options );

			x$.bind( _contentList.getIterator() , "next", updateControls );
			x$.bind( _contentList.getIterator() , "previous", updateControls );
			x$.bind( _contentList.getIterator() , "first", updateControls );
			x$.bind( _contentList.getIterator() , "last", updateControls );
		} );
		
		function userClick( evt ) {

			id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			switch( id ) {

				case "btn_new":

					newRecord( );

					preventDefault( evt );

					break;
				case "btn_add":

					add( );

					preventDefault( evt );

					break;
				case "btn_submit":

					alert( submit() ); //submit( );

					preventDefault( evt );

					break;
				case "btn_update":

					update( );

					preventDefault( evt );

					break;
				case "btn_remove":

					remove( );

					preventDefault( evt );

					break;
			}
		}

		function add ( ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();
			var tmplt = new x$.template( form );
			
			// Add a new record 
			_array[ _array.length ] = tmplt.getData( );

			form.reset( );

			// Move row pointer to the last record.
			_contentList.getIterator( ).gotoRow( _array.length )
		};

		function newRecord (  ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			form.reset( );

			unsetState( "edit" );
			setState( "new" );

			return false;
		};

		function update ( ) {
			
			var curRow = _contentList.getIterator( ).getCurrentRow( );
			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();
			var tmplt = new x$.template( form );
			
			// Update the existing record
			_array[ curRow ] = tmplt.getData( );

			return true;
		};

		function remove ( ) {
			
			var curRow = _contentList.getIterator( ).getCurrentRow( );
			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			// Remove the existing record from _array
			if ( _array[curRow] ) {

				_array.splice( curRow, 1 );

				if( _array.length > 0 ){

					_contentList.getIterator( ).previous( );
					_contentList.updateDisplay( );
				} else {
					var add = x$( "#add", elem ),
						submit = x$( "#submit", elem ),
						update = x$( "#update", elem ),
						remove = x$( "#remove", elem );

					form.reset( );
					unsetState( "edit" );
					setState( "new" );
				}
			}
			return true;
		};

		function submit ( ) {
			
			return JSON.stringify( _array );
		};
		
		function unsetState( state ) {

			var add = x$( "#add", elem ),
				newRecord = x$( "#new_record", elem ),
				update = x$( "#update", elem ),
				remove = x$( "#remove", elem );

			add.removeClass( state );
			newRecord.removeClass( state );
			update.removeClass( state );
			remove.removeClass( state );
		}

		function setState( state ) {

			var add = x$( "#add", elem ),
				newRecord = x$( "#new_record", elem ),
				update = x$( "#update", elem ),
				remove = x$( "#remove", elem );

			add.addClass( state );
			newRecord.addClass( state );
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