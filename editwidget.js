//************************************************************************ 
//	EXTEND x$ TO SUPPORT DATA MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdtemplates.js, verticalbar.js
//************************************************************************ 	

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
			_tmpData = undefined,
			_frmData = undefined,
			_vb = new x$.verticalBar( x$(".listmenu", elem).getNode() );

			x$.bind( x$(".editcomponent", elem).getNode(), "click", userClick );
		
		function userClick( evt ) {

			id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			switch( id ) {

				case "btn_new":

					newRecord.call( this );

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

			_vb.unselectAll();
			
			x$.triggerHandler( this, "newRecord", true, {article_content:""} );
			
			return false;
		};

		function update ( ) {
			
			if( options.beforeUpdate ) {
				
				options.beforeUpdate( );
			}

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
			
			if( options.beforeSubmit ) {
				
				options.beforeSubmit( );
			}
			
			var form = x$( _formSel, elem ).getNode( );
			var data = new x$.template( form ).getData( );

			data = x$.extend( data, key );

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
					callback:options.callback ? options.callback : updateList
				} 
			);
		}

		function updateList ( o ) {

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

			var form = x$( _formSel, elem ).getNode( );

			form.reset( );
		}

		function updateDataList( ) {
		    
			var data = _array,
	       		node = x$( "#wul", elem ).getNode( ),
	            nPar = undefined;
	            
	        if ( ! cache["wli"] ) {
	                
	        	cache[ "wli" ] = node.firstChild.cloneNode( true );
	        }
	            
	        if( node ) {
	                
	        	nPar = node; 
	            
	        	emptyList( nPar );

	            node = cache[ "wli"].cloneNode( true );
	                
	            x$( nPar ).insertLast( node );

	            t = new x$.template( node );
	        
	            t.applyBindings( data );
	        }
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
			
			x$.triggerHandler( this, "getData", true, _tmpData );
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
			
			if( x$.isArray(sbmt.getNode()) ) {
				
				sbmt.each( function(i,v) {
					
					x$(v).removeClass( state );
				} );
			} else {
				
				sbmt.removeClass( state );
			}

			if( x$.isArray(newRecord.getNode()) ) {
				
				newRecord.each( function(i,v) {
					
					x$(v).removeClass( state );
				} );
			} else {
				
				newRecord.removeClass( state );
			}

			if( x$.isArray(update.getNode()) ) {
				
				update.each( function(i,v) {
					
					x$(v).removeClass( state );
				} );
			} else {
				
				update.removeClass( state );
			}

			if( x$.isArray(remove.getNode()) ) {
				
				remove.each( function(i,v) {
					
					x$(v).removeClass( state );
				} );
			} else {
				
				remove.removeClass( state );
			}
		}

		function setState( state ) {

			var sbmt = x$( ".submit", elem ),
				newRecord = x$( ".new_record", elem ),
				update = x$( ".update", elem ),
				remove = x$( ".remove", elem );

			if( x$.isArray(sbmt.getNode()) ) {
				
				sbmt.each( function(i,v) {
					
					x$(v).addClass( state );
				} );
			} else {
				
				sbmt.addClass( state );
			}

			if( x$.isArray(newRecord.getNode()) ) {
				
				newRecord.each( function(i,v) {
					
					x$(v).addClass( state );
				} );
			} else {
				
				newRecord.addClass( state );
			}

			if( x$.isArray(update.getNode()) ) {
				
				update.each( function(i,v) {
					
					x$(v).addClass( state );
				} );
			} else {
				
				update.addClass( state );
			}

			if( x$.isArray(remove.getNode()) ) {
				
				remove.each( function(i,v) {
					
					x$(v).addClass( state );
				} );
			} else {
				
				remove.addClass( state );
			}
		}

		return {
			newRecord: newRecord,
			update: update,
			remove: remove,
			submit: submit,
			initializeList: initializeList,
			updateList: updateList,
			getData: getData
		};
	};

	o.editwidget = o.editwidget || e;
}(x$));