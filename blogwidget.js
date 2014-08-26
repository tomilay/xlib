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

				case "btn_submit":

					submit( );

					preventDefault( evt );

					break;
			}
		}

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
					callback:options.callback ? options.callback : loadList
				} 
			);
		}

		function loadList ( o ) {

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

		function emptyList( l ) {
			
			while ( l.firstChild ) {

				l.removeChild( l.firstChild );
			}
		}

		function setUser( ) {}

		function setBlog( ) {}

		return {
			initializeList: initializeList,
			setUser : setUser,
			setBlog : setBlog
		};
	};

	o.editwidget = o.editwidget || e;
}(x$));