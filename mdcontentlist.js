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

		x$.bind( _tmpList, "bindSingle", bindHandler);

		function bindHandler ( args ) { 
			
			if ( options.bindHandler ) {

				options.bindHandler( args[ 1 ].childNodes[0] );
			}
		}
		
		function getIterator ( ) {

			return _data;
		};

		function updateDisplay ( ) {

			if ( _navPages ) {

				_tmpNav.applyBindings( { currentPage:_data.getCurrentPage( ), totalPages:_data.getTotalPages( ) } );
			}

			_tmpList.applyBindings( _data.getCurrentData() );
		};

		updateDisplay( );

		function movePointer ( evt ) {

			var self = evt ? evt.currentTarget? evt.currentTarget : this : this;

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

		function first( ) {

			_data.first( _size );

			updateDisplay( );
		}

		function last( ) {

			_data.last( _size );

			updateDisplay( );
		}

		function next( ) {

			_data.next( _size );

			updateDisplay( );
		}

		function previous( ) {

			_data.previous( _size );

			updateDisplay( );
		}

		function gotoPage( pg ) {

			_data.gotoPage( pg );

			updateDisplay( );
		}

		if( _cp.getNode() ) {
			
			x$.bind( _cp.getNode() , "click", movePointer );
		}

		if( _cn.getNode() ) {
			
			x$.bind( _cn.getNode() , "click", movePointer );
		}

		if( _cf.getNode() ) {
			
			x$.bind( _cf.getNode() , "click", movePointer );
		}

		if( _cl.getNode() ) {
			
			x$.bind( _cl.getNode() , "click", movePointer );
		}

		return {
			first: first,
			last:last,
			next: next,
			previous: previous,
			gotoPage: gotoPage
		}
	};

	o.contentList = o.contentList || e;
}(x$) );