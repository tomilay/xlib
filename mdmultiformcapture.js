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

			x$.bind( x$(">div.contentarea", elem).getNode(), "click", userClick );

			// Reuse contentlist functionality
			_contentList = new x$.contentList( elem, _array, options );

			x$.bind( _contentList.getIterator() , "next", updateControls );
			x$.bind( _contentList.getIterator() , "previous", updateControls );
			x$.bind( _contentList.getIterator() , "first", updateControls );
			x$.bind( _contentList.getIterator() , "last", updateControls );
		} );
		
		// Return the current row of the record from its screen position
		function getCurrentRow ( pos ) {

			var curPage = _contentList.getIterator( ).getCurrentPage( ),
				pageSize = _contentList.getIterator( ).getPageSize( );

			return ( curPage * pageSize ) - ( pageSize - pos );
		}

		// Return the current position on screen of the record affected by an event evt
		function getItemPos ( evt ) {

			var node = evt.target ? evt.target : undefined;
			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			while( node && node.parentNode && node.id !== "listing" ) {
				
				node = node.parentNode;
			}

			return node.idx;
		}

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

					alert( submit() ); 

					preventDefault( evt );

					break;
				case "btn_update":

					var pos = getItemPos( evt );

					update( pos, getCurrentRow(pos) );

					preventDefault( evt );

					break;
				case "btn_remove":
					
					remove( getCurrentRow(getItemPos(evt)) );

					preventDefault( evt );

					break;
			}
		}

		function add ( ) {

			var form = x$( ">div.contentarea>ul>li>div.formcontainer>form", elem ).getNode( );
			if( x$.isArray(form) )	{

				form = form[ form.length - 1 ];
			}	
			var tmplt = new x$.template( form );
			
			// Add a new record 
			_array[ _array.length ] = tmplt.getData( );

			form.reset( );

			// Move row pointer to the last record.
			_contentList.getIterator( ).gotoRow( _array.length )
		};

		function newRecord ( ) {

			var form = x$( ">div.contentarea>ul>li>div.formcontainer>form", elem ).getNode( );

			if( x$.isArray(form) )	{

				form = form[ form.length - 1 ];
			}	

			form.reset( );

			unsetState( "edit", form );
			setState( "new", form );

			// return false;
		};

		function update ( idx, curRow ) {
			
			var form = x$( ">div.contentarea>ul>li>div.formcontainer>form", elem ).getNode( );

			if ( x$.isArray(form) ) {

				form = form[ idx ];
			}
			var tmplt = new x$.template( form );
			
			// Update the existing record
			_array[ curRow ] = tmplt.getData( );

			// return fa;
		};

		function remove ( curRow ) {
			
			// var curRow = _contentList.getIterator( ).getCurrentRow( );
			var form = x$( ">div.contentarea>ul>li>div.formcontainer>form", elem ).getNode( );

			// Remove the existing record from _array
			if ( _array[curRow] ) {

				_array.splice( curRow, 1 );

				if( _array.length > 0 ){

					_contentList.getIterator( ).previous( );
					_contentList.updateDisplay( );
				} else {

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
		
		function unsetState( state, elem ) {

			var add = x$( "#add", elem ),
				update = x$( "#update", elem ),
				remove = x$( "#remove", elem );

			add.removeClass( state );
			update.removeClass( state );
			remove.removeClass( state );
		}

		function setState( state, elem ) {

			var add = x$( "#add", elem ),
				update = x$( "#update", elem ),
				remove = x$( "#remove", elem );

			add.addClass( state );
			update.addClass( state );
			remove.addClass( state );
		}

		function updateControls( args ) {

			var form = x$(">div.contentarea>ul>li>div.formcontainer>form", elem).getNode();

			// If there are no records, set the screen to new mode
			if ( ! (args[1].data.getTotalRows() === 0) ) {

				if( x$.isArray(form) ) {

					x$.each( form, function (idx, val) {

						unsetState( "new", val );
						setState( "edit", val );
					} );
				} else {

					unsetState( "new", form );
					setState( "edit", form );
				}
			} else {
				form.reset( );

				unsetState( "edit", form );
				setState( "new", form );
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