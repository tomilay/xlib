//************************************************************************ 
//        EXTEND x$ TO SUPPORT TEMPLATING
//        
//         Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
//         Dependency: mdcore.js, mdinputs.js
//        
//        This module permits a web designer to create templates
//        that will bind to data-sets or models
//************************************************************************  
(function(o) {

	// Order the input elements by type and name
	function typeSort( x, y ) {

		if ( x.type < y.type ) 
			return -1;
		else if ( x.type > y.type )
			return 1;
		else if ( x.name < y.name )
			return -1;
		else if ( x.name > y.name )
			return 1;
		else
			// return -1 instead of 0.  Otherwise google chrome behaves funny.
			return -1
	}

	function bindDataToNode( data, node ) {

		if ( data ) {
			
			var lm = x$( "[data-bind]", node ).getNode( );

			if ( lm && x$.isArray(lm)  && lm.length > 0 ) {

				// Sort on type and name.  Ensures appropriate grouped element(radio/checkbox groups) ordering.
				lm.sort( typeSort );

				x$.each( lm, function get( index, value ) {

					// filters out elements that share a group with the current value
					function filterGroup( val ) {

						if ( ! (val.type) ) return false;

						if ( val.type === value.type && val.name === value.name && val.name !== "" )
							return true;
					}
					
					// If the element is a part of a group, the group array will be filled with the whole lot of them.
					var inpt,
						group = x$.filter( lm, filterGroup );

					if ( group.length > 1 ) {

						inpt = new x$.input( group );
					} else {

						inpt = new x$.input( value );
					}

					// Set values only for data fields with an actual value.  Prevents inadvertent overwriting.
					if ( data[inpt.getDataBind()]  || data[inpt.getDataBind()] === "" || inpt.getDataNode() ) {

						if( inpt.getDataNode() ) { 
							
							if ( data[inpt.getDataNode()] ) {  // if the input is bound as a node
							
								var newNode = new x$.template( value );

								newNode.applyBindings( data[inpt.getDataNode()] ); //bindDataToNode( data[ inpt.getDataNode() ], value.parentNode );
							} else {

								 // remove the node
								 x$( value ).remove( );
							}
						} else {

							inpt.setValue( data[inpt.getDataBind()] );
						}
					}

					// If the element is part of a group, permit the rest of them to be looped over
					if ( group.length > 1 )
						return { "inc":group.length-1 };
				} );
			} else if ( lm ) {

				var inpt = new x$.input( lm );

				inpt.setValue( data[inpt.getDataBind()] );
			}
		}

		return node;
	}

	var e = function ( elem ) {
		
		var lm = x$( "[data-bind]", elem ).getNode( ),
			_parent = elem.parentNode,
			_copy = elem.cloneNode( true ),

			// To keep track of elements already appended to the parent
			// The databind removes an old/template node from the parent 
			// node and replaces it with a _copy of the original element
			olds = [ ];

		function addToParent( node, parentNode ) {

			if ( ! parentNode )
				return;

			if ( ! node )
				return;

			x$( parentNode ).insertLast( node );

			// Add element to the old elements array
			olds[ olds.length ] = node;
			
			return node;
		}

		function emptyOlds( ) {
			
			for ( var i = 0; i < olds.length; i++ ) {

				x$( olds[ i ] ).remove( );

				// set the node to null
				olds[ i ] = null;
			}

			olds = [ ];
		}

		// Binding multirow-data
		function bindRows( data ) {

			// Remove the template node from the document if present.
			// It will be present on the initial attempt at binding.
			if ( elem ) {

				x$( elem ).remove( );

				elem = null;
			}

			for ( var i = 0; i < data.length; i++ ) {
				
				bindSingle.call( this, data[ i ], i+1 );
			}
		}

		// idx is optional.  If included, it appends an index to the template node
		function bindSingle( data, idx ) {

 			var node = addToParent(_copy.cloneNode(true), _parent);

			if ( idx ) node.idx = idx - 1;

			bindDataToNode( data, node );

			x$.triggerHandler( this, "bindSingle", true, node );
		}

		var applyBindings = function ( data ) {
			
			if( ! x$.isEmpty(data) ) {
				
				// Remove any old copies of bound nodes from document
				emptyOlds( );

				if( x$.isArray(data) ){

					bindRows.call( this, data )

				}else{

					// Remove the template node from the document if present.
					// It will be present on the initial attempt at binding.
					if ( elem ) {

						x$( elem ).remove( );

						elem = null;
					}

				 	bindSingle.call( this,  data );
				}
			}
		};

		//************************************************************************ 
		// RETRIEVE THE DATA FROM THE FORM CONTROLS AND RETURN AN OBJECT DATA CONTAINER
		//************************************************************************ 					
		var getData = function ( ) {

			var data = {};
			
			if ( lm && x$.isArray(lm)  && lm.length > 0 ) {

				lm.sort( typeSort );

				x$.each( lm, function get( index, value ) {
					
					// filters out elements that share a group with the current value
					function filterGroup( val ) {

						if ( ! (val.type) ) return false;

						if ( val.type === value.type && val.name === value.name )
							return true;
					}
					
					// If the element is a part of a group, the group array will be filled with the whole lot of them.
					var inpt,
						group = x$.filter( lm, filterGroup );

					if ( group.length > 1 ) {

						inpt = new x$.input( group );
					} else {

						inpt = new x$.input( value );
					}

					data[ inpt.getDataBind() ] = inpt.getValue( );

					// If the element is part of a group, permit the rest of them to be looped over
					if ( group.length > 1 )
						return { "inc":group.length-1 };
				} );
			} else if ( lm ) {

				var inpt = new x$.input( lm );

				data[ inpt.getDataBind() ] = inpt.getValue( );
			}
			return data;
		};

		return {
			applyBindings: applyBindings,
			getData: getData
		}
	};
	
	e.bindDataToNode = bindDataToNode;

	o.template = o.template || e;
}(x$));
