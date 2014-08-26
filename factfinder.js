/*
dependencies:mdcore.js, mdinput.js, mdtemplate.js
*/
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

	function emptyNode( n ) {
		
		while ( n.firstChild ) {

			n.removeChild( n.firstChild );
		}
	}

	// options e.g ( data:{})
	var e = function ( options ) {

		var _elem = options.node,
			_nav = x$( ".ff-ul", _elem ),
			_content = x$( ".ff-content", _elem ),
			_details = x$( ".content-details", _content.getNode() ),
			_node = undefined,
			_attrs =  options && options.data[ "attributes" ] || [ { href: "javascript:;", hreftxt: "default attribute", attribute:"none"} ],
			_utmplt = new x$.template( x$(".ff-ul", _elem).getNode() ),
			// _entity should resolve to a primary key.  Nothing more complicated than that.
			_entity = { },
			_cache = { },
			_this = this,
			_initialState = "initial_state",
			// cache ids for missing data and templates
			_now = Date.now && Date.now() || function() { return +new Date; }(),
		 	_mDataId = "md"+_now,
			_mTmpId = "mt"+_now,
			_navLm = undefined;

		function unselectAll( ) {

			var node = x$( ".ff-ul a", _elem );

			if( x$.isArray(node.getNode()) )
				node.each( function( i, v ) {

						x$( v ).removeClass( "selected" );
				} );
			else
				node.removeClass( "selected" );
		}

		function findFacts ( entity, obj ) {

			// In practice: make a request for the data given by criteria for the given entity.
			var tmplt = _initialState,
				data = _initialState,
				ent = entity;

			if( ! obj )
				return;

			getTemplate();

			function getData() {

				if( obj.datasource.location === "local" ) {

					gatherer( "data", obj.datasource.value );
				} else {

					ent = "?entity=" + ent[ "id" ];

					// get the data from the remote source
					x$.ajax(
						{format:"JSON", method:"get", url:obj.datasource.value + ent, 
						callback:dataCallBack
						});

				}
			}

			function getTemplate() {

				if ( obj.template.location === "local" ) {

					gatherer( "template", obj.template.value );

					getData();
				} else {

					if ( _cache[obj.template.value + obj.template.selector] ){
						
						gatherer( "template", _cache[obj.template.value + obj.template.selector] );	

						getData();				
					} else {

						x$.iframeUrl( {url:obj.template, selector:obj.template.selector, src:obj.template.value, callback:templateCallback} );
					}
				}
			}

			function gatherer( src, val ) {

				if ( src === "data" ) {

					data = val || {}; 
				} else {

					tmplt = val || x$.createElement( "div", document );
				}

				if ( _node ) {

					x$( _node ).remove( );

					_node = null;
				}

				if ( data !== _initialState && tmplt !== _initialState ) {

					if ( tmplt && tmplt.cloneNode ) {

						_node = tmplt.cloneNode( true );

						// adding the node to the node container before binding allows us
						// to cache  the node as a belonging to document instead of iframe
						emptyNode( _details.getNode() );

						_details.insertLast( _node );

						if ( obj.template.location === "remote" ) {

							var id = obj.template.value + obj.template.selector;

							if ( ! _cache[id] )
								_cache[ id ] = _node.cloneNode( true );
						}

						var  tm = new x$.template( _node );
						tm.applyBindings( data );

						x$.triggerHandler( _this, "boundDataToNode", true, _node );
					}
				}

				unselectAll( );

				x$( _navLm ).addClass( "selected" );
			}

			function templateCallback( tmplt ) {

				gatherer ( "template", tmplt );

				getData();
			}

			function dataCallBack( o ) {

				var data;

				try{
					
					data = JSON.parse( o );
				} catch ( e ) {

					data = {};
				}

				gatherer( "data",  data );
			}
		}

		function searchEntity ( evt ) {

			str = x$.input( x$("#searchbox", _elem ).getNode() ).getValue( );

			setEntity ( str );
		}

		function setEntity ( str ) {

			// find the key for the search term.  
			// the key is used in subsequent requests for attributes.
			_entity[ "name" ] = str;

			var node = x$( ".ff-summary" ).getNode( ),
				tmplt = new x$.template( node ),
				data = { name:_entity["name"] };

				tmplt.applyBindings( data );

			if ( options.entFn ) {

				options.entFn( str, setKey );
			}
		}

		function init( ) {
		
			_this = this;

			return this;
		}
		
		// the callback function that sets _entity to the returned key
		function setKey ( key ) {

			_entity[ "id" ] = key;

			selectInit( );
		}

		function searchFact (  ) {

			var obj = searchArray( _attrs, "hreftxt", x$.input(_navLm.childNodes[0]).getValue() );

			findFacts( _entity, obj );
		}

		function selectAttribute( a ) {

			_navLm = a;

			searchFact( );
		}

		function selectInit( ) {

			selectAttribute( x$(".ff-ul:first-child a", _elem).getNode() );
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
		}

		function navClick( evt ) {

			var node = evt.target ? evt.target : undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			while( node && node.parentNode && node.tagName !== "A" ) {
				
				node = node.parentNode;
			}

			if( node.tagName === "A" ) {

				_navLm = node;

				searchFact( );
			}
		}

		function missingTmplt( val ) {

			var div = x$.createElement( "div", document ),
				span = x$.createElement( "span", document ),
				span1 = x$.createElement( "span", document );

			span.setAttribute( "data-bind", "attribute" );
			span1.innerHTML = "Oops, missing "+val+" for attribute ";
			span1.appendChild( span );
			div.appendChild( span1 );

			return div;
		}

		x$.bind( x$( ".ff-nav", _elem ).getNode(), "click", navClick );

		_utmplt.applyBindings( _attrs );

		selectInit( );

		return {
			selectAttribute:selectAttribute,
			setEntity:setEntity,
			init:init
		};
	}

	o.factFinder = o.factFinder || e;
} (x$) );