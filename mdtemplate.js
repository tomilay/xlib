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

	var e = function ( elem ) {
		
		var lm = x$( "[data-bind]", elem ).getNode( ),
			_parent = elem.parentNode,
			copy = elem.cloneNode( true );

		// To keep track of elements already appended to the parent
		var olds = [ ];

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
			}

			olds = [ ];
		}

		// Binding multirow-data
		function bindRows( data ) {

			// Remove the template node from the document if present
			if ( elem ) 
				x$( elem ).remove( );

			for ( var i = 0; i < data.length; i++ ) {
				
				bindSingle( data[ i ], i+1 );
			}
		}

		// idx is optional.  If included, it appends an index to the template node
		function bindSingle( data, idx ) {

 			var node = addToParent(copy.cloneNode(true), _parent);
			lm = x$( "[data-bind]", node ).getNode( );

			if ( idx ) node.idx = idx - 1;

			if ( lm && x$.isArray(lm)  && lm.length > 0 ) {

				// Sort on type and name.  Ensures appropriate grouped element(radio/checkbox groups) ordering.
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

					// Set values only for data fields with an actual value.  Prevents inadvertent overwriting.
					if ( data[inpt.getDataBind()]  || data[inpt.getDataBind()] === "" ) {

						inpt.setValue( data[inpt.getDataBind()] );
					}

					// If the element is part of a group, permit the rest of them to be looped over
					if ( group.length > 1 )
						return { "inc":group.length-1 };
				} );
			}
		}

		var applyBindings = function ( data ) {
			
			if( ! x$.isEmpty(data) ) {
				
				// Remove any old copies of binds from document
				emptyOlds( );

				if( x$.isArray(data) ){

					bindRows( data )

				}else{

					// Remove the template node from the document if present
					if ( elem ) 
						x$( elem ).remove( );

				 	bindSingle( data );
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
			}
			return data;
		};

		return {
			applyBindings: applyBindings,
			getData: getData,
		}
	};

	o.template = o.template || e;
}(x$));
