( function ( o ) {

	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	// options e.g ( data:{})
	var e = function ( elem, options ) {

		var _nav = x$( ".factfinder-ul", elem ),
			_content = x$( ".factfinder-content", elem ),
			_details = x$( ".content-details", _content.getNode() ),
			_metadata = x$( ".metadata", _content.getNode() ),
			_node = undefined,
			_attrs =  options && options.data[ "attributes" ] || [ { href: "javascript:;", hreftxt: "default attribute", attribute:"none"} ],
			_utmplt = new x$.template( x$(".factfinder-ul", elem).getNode() ),
			_entity = undefined,
			_this = this;

		
		function searchEntity ( evt ) {

			// Find the data
			// Find the default node 
			// Bind the default node to the data and display
			str = x$.input( x$("#searchbox", elem ).getNode() ).getValue( );

			_entity = str;

			alert( str );
		}

		function searchFact ( attribute ) {

			if ( options.factFinder ){

				options.factFinder( _entity, attribute, displayData );
			}
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

				searchFact ( x$.input(node.childNodes[0]).getValue() );
			}
		}

		function displayData( data, node ) {

			if( node && node.cloneNode ) {
				
				_node = node.cloneNode( true );
				_node = x$.template.bindDataToNode( data, _node );

				// add the node to the node container
				_details.insertLast( _node );
			}
		}

		x$.bind( x$( "#searchanchor", elem ).getNode(), "click", searchEntity );
		x$.bind( x$( "#searchbox", elem ).getNode(), "keypress", keyPress );
		x$.bind( x$( ".factfinder-nav", elem ).getNode(), "click", navClick );

		_utmplt.applyBindings( _attrs );

		return {
			displayData : displayData
		}

	}

	o.factFinder = o.factFinder || e;
} (x$) );