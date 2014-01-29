//************************************************************************ 
//	EXTEND x$ TO SUPPORT VERTICAL SCROLL BAR MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdcss.js
//************************************************************************ 		
(function(o) {

	var hasChildren = function( listNode ) {
		 var ulNode = x$(">ul", listNode).getNode();

		 if( ulNode !== undefined ) {
		 	listNode.onclick = toggleMenu;
		 } else {
		 	listNode.onclick = stopBubble;
		 }
	}

	function stopBubble( e ) {
		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	var toggleMenu = function(evt) {
		var self = evt ? evt.currentTarget : this;

		if( !x$(">ul", this).hasClass("visib") ){
			setTimeout( function() { x$(">ul", self).addClass("visib"); },100 )
		} else {
			setTimeout( function() { x$(">ul", self).removeClass("visib"); },100 )
		}

		stopBubble( evt );
	}

	var e = {
		scrollbar: function( ) {
			var ul, li;

			if ( this.elem ) {
				ul = x$( ">ul", this.elem );
			}

			if ( ul ) {
				li = x$( "li" ).getNode();

				for( i = 0; i < li.length; i++ ) {
					hasChildren( li[ i ] );
				}
			}

			return this;
		}
	};

	o.extend(o.fn, e);
}(x$));