//************************************************************************ 
//	EXTEND x$ TO SUPPORT VERTICAL SCROLL BAR MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdcss.js
//************************************************************************ 		
(function(o) {

	var _data = undefined;
	var _size = 1;
	var _listing = undefined;

	function stopBubble( e ) {
		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	var movePointer = function(evt) {
		var self = evt ? evt.currentTarget : this;

		if( self.className === "contentnavprev" ){
			// Move data pointer to the previous record
			_data.previous( _size );
		} else {
			// Move data pointer to the next record
			_data.next( _size );
		}

		alert( "current page:"+_data.currentPage() 
			+ "\nrows on page:" + _data.rowsOnCurrent()
			+ "\ntotal pages:" + _data.totalPages() 
			+ "\ntotal rows:" + _data.totalRows()
			+ "\npage size:" + _data.pageSize());
		
		// Update display with the current data
		_listing.applyBindings( _data.current() );

		stopBubble( evt );
	}

	var e = {
		// contentList takes an array of data
		contentList: function( data, options ) {

			var cp = x$(".contentnavprev", this.elem )
				,cn  = x$(".contentnavnext", this.elem );

			_listing = x$("#listing");

			_data = x$( data );
			_size = options.size ? options.size 
					: _size;

			_listing.applyBindings( _data.next( _size ).current() );

			cp.getNode().onclick = movePointer;
			cn.getNode().onclick = movePointer;

			return this;
		}
	};

	o.extend(o.fn, e);
}(x$));