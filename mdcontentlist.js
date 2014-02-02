//************************************************************************ 
//	EXTEND x$ TO SUPPORT VERTICAL SCROLL BAR MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdarray.js, mdtemplates.js
//************************************************************************ 		
(function(o) {

	function stopBubble ( e ) {
		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	var e = new function(){};

	// contentList takes an array of data
	e.contentList = function( data, options ) {

		var cp = x$( ".contentnavprev", this.elem )
			,cn = x$( ".contentnavnext", this.elem )
			,cf = x$( ".contentnavfirst", this.elem )
			,cl = x$( ".contentnavlast", this.elem );

		
		var _listing = x$( ">div.contentarea>ul>li", this.elem )
			,_size = options.size ? options.size : 0;

		if ( _size < 0 ) _size = 0;

		var _data = x$( data ).initArray( _size );
		
		if ( options.pages ) {
			options.pages.applyBindings({ currentPage:_data.currentPage( ), totalPages:_data.totalPages( ) });
		}
		_listing.applyBindings( _data.current() );

		function movePointer ( evt ) {
			var self = evt ? evt.currentTarget : this;

			switch( self.className ) {
				case "contentnavprev":
					_data.previous( _size );
					break;
				case "contentnavnext":
					_data.next( _size );
					break;
				case "contentnavfirst":
					_data.first( _size );
					break;
				case "contentnavlast":
					_data.last( _size );
					break;
			}

			if ( options.pages ) {
				options.pages.applyBindings({ currentPage:_data.currentPage( ), totalPages:_data.totalPages( ) });
			}
			// Update display with the current data
			_listing.applyBindings( _data.current() );

			stopBubble( evt );
		}

		cp.getNode().onclick = movePointer;
		cn.getNode().onclick = movePointer;
		cf.getNode().onclick = movePointer;
		cl.getNode().onclick = movePointer;

		return this;
	};

	o.extend(o.fn, e);
}(x$));
		