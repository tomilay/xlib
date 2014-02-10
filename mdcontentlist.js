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
		var _data = new x$.iterator( data, _size );
		var _navPages = options.navpages;
		var _tmpNav = _navPages ? new x$.template( _navPages.getNode() ) : undefined,
			_tmpList = new x$.template( _listing.getNode() );

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

			_data.gotoPage( page );
		};
		var setRow = function ( row ) {

			_data.gotoRow( row );
		};
		var updateDisplay = function ( ) {

			if ( _navPages ) {

				_tmpNav.applyBindings( { currentPage:_data.getCurrentPage( ), totalPages:_data.getTotalPages( ) } );
			}

			_tmpList.applyBindings( _data.getCurrentData() );
		};

		updateDisplay( );

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

			updateDisplay( );

			stopBubble( evt );
		}

		_cp.getNode().onclick = movePointer;
		_cn.getNode().onclick = movePointer;
		_cf.getNode().onclick = movePointer;
		_cl.getNode().onclick = movePointer;

		return {
			getListing: getListing,
			getNavPages: getNavPages,
			getData: getData,
			setPage: setPage,
			setRow: setRow,
			updateDisplay: updateDisplay
		}
	};

	o.contentList = o.contentList || e;
}(x$) );