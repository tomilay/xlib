//************************************************************************ 
//	EXTEND x$ TO SUPPORT VERTICAL SCROLL BAR MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdcss.js
//************************************************************************ 		
(function(o) {

	var toggleMenu = function( evt ) {

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
	}

	var e = function ( elem ) {

			var ul;

			if ( elem ) {

				ul = x$( ">ul", elem );
			}

			if ( ul.getNode() ) {

				x$.bind( ul.getNode( ) , "click", toggleMenu );
			}

			return { };
	};

	o.verticalBar = o.verticalBar || e;
}(x$));