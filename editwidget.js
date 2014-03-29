//************************************************************************ 
//	EXTEND x$ TO SUPPORT DATA MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdtemplates.js
//************************************************************************ 	
var property_dept = { property_dept_id:property_dept_id };

(function(o) {
	
	var cache = {};
	
	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	var e = function( elem, options ) {

		var 
			_array = [ ],
			_formSel = ".editcomponent>form";
			_iterator = new x$.iterator( _array ),
			_tmpData = undefined,
			_frmData = undefined;

			x$.bind( x$(".editcomponent", elem).getNode(), "click", userClick );
		
		function userClick( evt ) {

			id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			switch( id ) {

				case "btn_new":

					newRecord( );

					preventDefault( evt );

					break;
				case "btn_submit":

					submit( );

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

		function newRecord (  ) {

			var form = x$( _formSel, elem ).getNode();

			form.reset( );

			unsetState( "edit" );
			setState( "new" );

			return false;
		};

		function update ( ) {
			
			var form = x$( _formSel, elem ).getNode( );

			_frmData = new x$.template( form ).getData( );

			_frmData = x$.extend( x$.clone(_tmpData), _frmData );

			delete _frmData["href"];

			x$.ajax( 
				{
					format:"FormUrlEncoded", 
					method:"post", 
					url:options.updateurl,
					data:_frmData,
					callback:updateCallback
				}
			);
		};

		function remove ( ) {
			
			if( _tmpData ) {

				var data = {}; 
				
				data[options.key] = _tmpData[options.key];

				x$.ajax( 
					{
						format:"FormUrlEncoded", 
						method:"post", 
						url:options.removeurl,
						data:data,
						callback:removeCallback
					}
				);
			}
		};

		function submit ( ) {
			
			var form = x$( _formSel, elem ).getNode( );
			var data = new x$.template( form ).getData( );

			data = x$.extend( data, property_dept );

			_tmpData = data;

			x$.ajax( 
				{
					format:"FormUrlEncoded", 
					method:"post", 
					url:options.submiturl,
					data:data,
					callback:submitCallback
				}
			);
		};

		function initializeList ( options ) {
			
			x$.ajax( 
				{
					format:"JSON", 
					method:"get", 
					url:options.url, 
					callback:updateTopics
				} 
			);
		}

		function updateTopics ( o ) {

			_array= JSON.parse(o);

			updateDataList( );
		}

		function removeCallback ( o ) {

			var newIdx = undefined;

			for( var i = 0; i < _array.length; i++ ) {

				if( _array[i] === _tmpData ) {

					newIdx =  i > 0 ? i - 1 : _array.length > 1 ? i + 1 : undefined;
					
					_tmpData = newIdx ? _array[ newIdx ] : undefined;

					if( newIdx !== undefined ) {
						
						getData( options.key, _array[ newIdx ][options.key] );
					} else {

						var form = x$( _formSel, elem ).getNode( );

						form.reset( );
						// set the current widget state to new mode
						unsetState( "edit" );
						setState( "new" );
					}

					_array.splice( i, 1 );

					break;
				}
			}

			updateDataList( );

			// set the current widget state to edit mode
			// unsetState( "new" );
			// setState( "edit" );
		}

		function updateCallback ( o ) {

			_tmpData = x$.extend( _tmpData, _frmData );

			updateDataList( );

			// set the current widget state to edit mode
			unsetState( "new" );
			setState( "edit" );
		}

		function submitCallback ( o ) {

			_array[ _array.length ] = x$.extend(_tmpData, JSON.parse(o) );

			updateDataList( );

			// set the current widget state to edit mode
			unsetState( "new" );
			setState( "edit" );
		}

		function updateDataList( ) {
		    
			var data = _array,
	       		node = x$( "#tli" ).getNode( ),
	            nPar = undefined;
	            
	        if ( ! cache["tli"] ) {
	                
	        	cache[ "tli" ] = node.cloneNode( true );
	        }
	            
	        if( node ) {
	                
	        	nPar = node.parentNode;
	            
	        	emptyList( nPar );

	            node = null;
	        
	            node = cache[ "tli"].cloneNode( true );
	                
	            x$( nPar ).insertLast( node );

	            t = new x$.template( node );
	        
	            t.applyBindings( data );
	        }
		}

		function findData( id ) {

			var key = options.key;

			function filter( val ) {

				if ( val[key] == id ) {

					return true;
				}

				return false;
			}

			var data = x$.filter( _array, filter );

			data = data[0];

			return data;
		}

		function getData( key, id ) {

			function filter( val ) {

				if ( val[key] == id ) {

					return true;
				}

				return false;
			}

			_tmpData = x$.filter( _array, filter );

			_tmpData = _tmpData[ 0 ];

			//  bind the data to the widget controls
			x$.template.bindDataToNode( _tmpData, x$(_formSel).getNode() );

			// set the current widget state to edit mode
			unsetState( "new" );
			setState( "edit" );
		}

		function emptyList( l ) {
			
			while ( l.firstChild ) {

				l.removeChild( l.firstChild );
			}
		}

		function unsetState( state ) {

			var sbmt = x$( ".submit", elem ),
				newRecord = x$( ".new_record", elem ),
				update = x$( ".update", elem ),
				remove = x$( ".remove", elem );

			sbmt.removeClass( state );
			newRecord.removeClass( state );
			update.removeClass( state );
			remove.removeClass( state );
		}

		function setState( state ) {

			var sbmt = x$( ".submit", elem ),
				newRecord = x$( ".new_record", elem ),
				update = x$( ".update", elem ),
				remove = x$( ".remove", elem );

			sbmt.addClass( state );
			newRecord.addClass( state );
			update.addClass( state );
			remove.addClass( state );
		}

		function updateControls( args ) {

			var form = x$( _formSel, elem ).getNode();

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
			newRecord: newRecord,
			update: update,
			remove: remove,
			submit: submit,
			initializeList: initializeList,
			getData: getData
		}
	};

	o.editwidget = o.editwidget || e;
}(x$));