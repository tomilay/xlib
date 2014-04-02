//************************************************************************ 
//	EXTEND x$ TO SUPPORT VERTICAL SCROLL BAR MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdcss.js
//************************************************************************ 		
(function(o) {

	var e = function ( elem ) {

			var ul;

			function toggleMenu( evt ) {

				var node = evt.target ? evt.target : undefined;
					node = node || ( evt.srcElement ? evt.srcElement : undefined );

				while ( node && node.parentNode && node.tagName !== "LI" ) {
				
					node = node.parentNode;
				}

				if ( x$( ">ul", node ).getNode( ) ) {

					var ul = x$( ">ul", node );

					if ( ! ul.hasClass("visib") ){

						setTimeout( function() { ul.addClass("visib"); }, 100 );
					} else {

						setTimeout( function() { ul.removeClass("visib"); }, 100 );
					}
				}
				unselectAll( );

				x$( node ).addClass( "selected" );
			}

			function unselectAll( ) {
				var node = x$( ">ul li", elem );

				if( x$.isArray(node.getNode()) )
					node.each( function( i, v ) {

						x$( v ).removeClass( "selected" );
					} );
				else
					node.removeClass( "selected" );
			}

			if ( elem ) {

				ul = x$( ">ul", elem );
			}

			if ( ul.getNode() ) {

				x$.bind( ul.getNode( ) , "click", toggleMenu );
			}

			return { 
				unselectAll: unselectAll
			};
	};

	o.verticalBar = o.verticalBar || e;
}(x$));