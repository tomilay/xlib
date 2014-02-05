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

	var e = function( elem, data, options ) {

		var _cp = x$( ".contentnavprev", elem )
			,_cn = x$( ".contentnavnext", elem )
			,_cf = x$( ".contentnavfirst", elem )
			,_cl = x$( ".contentnavlast", elem );
		
		var _size = options.size ? options.size : 0;
		if ( _size < 0 ) _size = 0;
		var _listing = x$( ">div.contentarea>ul>li", elem );
		var _data = x$( data ).initArray( _size );

		var getListing = function ( ) {

			return _listing;
		};
		var getNavPages = function( ) {

			return options.navpages;
		};
		var getData = function ( ) {

			return _data;
		};
		var setPage = function ( page ) {

				var data = this.getData( ), 
					navPages = this.getNavPages( );

				data.gotoPage( page );

				// Update display with the current data
				if ( navPages ) {

					navPages.applyBindings({ currentPage:data.currentPage( ), totalPages:data.totalPages( ) });
				}

				this.getListing( ).applyBindings( data.current() );
		};

		if ( options.navpages ) {

			options.navpages.applyBindings( { currentPage:_data.currentPage( ), totalPages:_data.totalPages( ) } );
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

			// Update display with the current data
			if ( options.navpages ) {

				options.navpages.applyBindings({ currentPage:_data.currentPage( ), totalPages:_data.totalPages( ) });
			}

			_listing.applyBindings( _data.current() );

			stopBubble( evt );
		}

		_cp.getNode().onclick = movePointer;
		_cn.getNode().onclick = movePointer;
		_cf.getNode().onclick = movePointer;
		_cl.getNode().onclick = movePointer;

		return {
			getListing:getListing,
			getNavPages:getNavPages,
			getData:getData,
			setPage:setPage
		}
	};

	o.contentList = o.contentList || e;
}(x$));