( function ( o ) {

	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	function searchArray( arr, field, key ) {

	    for ( var i=0; i < arr.length; i++ ) {

	        if ( arr[i][field] === key ) {

	            return arr[ i ];
	        }
	    }
	}				

	// options e.g ( data:{})
	var e = function ( elem, options ) {

		var _nav = x$( ".ff-ul", elem ),
			_content = x$( ".ff-content", elem ),
			_details = x$( ".content-details", _content.getNode() ),
			_metadata = x$( ".metadata", _content.getNode() ),
			_node = undefined,
			_attrs =  options && options.data[ "attributes" ] || [ { href: "javascript:;", hreftxt: "default attribute", attribute:"none"} ],
			_utmplt = new x$.template( x$(".ff-ul", elem).getNode() ),
			// _entity should resolve to a primary key.  Nothing more complicated than that.
			_entity = undefined,
			_cache = { };

		function findFacts ( entity, obj ) {

			// In practice: make a request for the data given by criteria for the given entity.
			var tmplt = undefined,
				data = undefined,
				cbcomplete = false;

			if ( obj.template.location === "local" ) {

				gatherer( "template", obj.template.value );
			} else {

				if ( _cache[obj.template.value + obj.template.selector] ){
					
					gatherer( "template", _cache[obj.template.value + obj.template.selector] );					
				} else {

					x$.iframeUrl( {url:obj.template, callback:templateCallback} );
				}
			}

			if( obj.datasource.location === "local" ) {

				gatherer( "data", obj.datasource.value )
			} else {

				var entity = "?entity=" + entity;

				// get the data from the remote source
				x$.ajax(
					{format:"JSON", method:"get", url:obj.datasource.value + entity, 
					callback:dataCallBack
					});

			}

			function gatherer( src, val ) {

				if ( src === "data" ) {

					data = val;
				} else {

					tmplt = val;
				}

				if ( _node ) {

					x$( _node ).remove( );

					_node = null;
				}

				if ( data && tmplt ) {

					if ( tmplt && tmplt.cloneNode ) {

						_node = tmplt.cloneNode( true );

						// adding the node to the node container before binding allows us
						// to cache  the node as a belonging to document instead of iframe
						_details.insertLast( _node );

						if ( obj.template.location === "remote" ) {

							var id = obj.template.value + obj.template.selector;

							if ( ! _cache[id] )
								_cache[ id ] = _node.cloneNode( true );
						}

						_node = x$.template.bindDataToNode( data, _node );
					}
				}
			}

			function templateCallback( tmplt ) {

				gatherer ( "template", tmplt );
			}

			function dataCallBack( o ) {

				data = JSON.parse( o );
				
				gatherer( "data", data );
			}
		}

		function searchEntity ( evt ) {

			// Find the data
			// Find the default node 
			// Bind the default node to the data and display
			str = x$.input( x$("#searchbox", elem ).getNode() ).getValue( );

			_entity = str;
		}

		function searchFact ( obj ) {

			findFacts( _entity, obj, displayData );
		}

		function keyPress( evt ) {

			var node = evt.target ? evt.target : undefined;
			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			switch ( evt.keyCode ) {
				
				case 13:
					if ( node.id == "searchbox" ) {

						searchEntity( );
					}

					preventDefault( evt );
					
					break;
			}

			// 
		}

		function navClick( evt ) {

			var node = evt.target ? evt.target : undefined;
			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			while( node && node.parentNode && node.tagName !== "A" ) {
				
				node = node.parentNode;
			}

			if( node.tagName === "A" ) {

				var obj = searchArray( _attrs, "hreftxt", x$.input(node.childNodes[0]).getValue() );

				if ( obj.attribute ) {

					searchFact ( obj );
				}
			}
		}

		function displayData( data, tmplt ) {

			if ( tmplt && tmplt.cloneNode ) {

				_node = tmplt.cloneNode( true );
				_node = x$.template.bindDataToNode( data, _node );

				// add the node to the node container
				_details.insertLast( _node );
			}
		}

		x$.bind( x$( "#searchanchor", elem ).getNode(), "click", searchEntity );
		x$.bind( x$( "#searchbox", elem ).getNode(), "keypress", keyPress );
		x$.bind( x$( ".ff-nav", elem ).getNode(), "click", navClick );

		_utmplt.applyBindings( _attrs );

		return {
			displayData : displayData
		}

	}

	o.factFinder = o.factFinder || e;
} (x$) );