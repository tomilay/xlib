// Content List
( function( o ) {

	function moveChildNodes( from, to ) {

		while( from.hasChildNodes() ) {

			to.appendChild( from.removeChild(from.firstChild) );
		}

		return to;
	}

	function removeChildNodes( from ) {

		while( from.hasChildNodes() ) {

			from.removeChild( from.firstChild );
		}

		return from;
	}

	function stopBubble ( e ) {

		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	var cl = function( elem, data, options ) {

		if  ( elem == undefined ) {

			return false;
		}

		// If the elem has no childNodes, i.e. no template return
		if ( ! elem.hasChildNodes() ) {

			return false;
		}

		var _that = this,
			_size = options.size ? options.size : 0,
			_data = new x$.iterator( data, _size ),
			_boxesM = undefined,
			_widget = { },
			_cache = { },
			_text_nav = options.textnav !== undefined ? options.textnav : true,
			_nav_top = options.navtop !== undefined ? options.navtop : true;

		// Add the content footer(if any)
		function addContentFooter( ) {

			if ( ! options.hasOwnProperty("footer")  ) {

				return false; 
			}

			var header = document.createElement( "div" ), 
				p = document.createElement( "p" );

			header.className = "contentfooter";
			p.appendChild( document.createTextNode(options.footer) );
			header.appendChild( p );
			_widget[ "impl" ].appendChild( header );
			_widget[ "footer" ]  = header;
		}

		// Add the content header(if any)
		function addContentHeader( ) {

			if ( ! options.hasOwnProperty("header")  ) {

				return false; 
			}

			var header = document.createElement( "div" ), 
				p = document.createElement( "p" );

			header.className = "contentheader";
			p.appendChild( document.createTextNode(options.header) );
			header.appendChild( p );
			_widget[ "impl" ].appendChild( header );
			_widget[ "header" ]  = header;
		}

		function getBoxes( ) {

			return _boxesM;
		}

		function addRow( r ) {

			data.push( r );
		}
		
		function gotoPage( pg ) {

			_data.gotoPage( pg );

			updateContent( );
		}

		function last( ) {

			_data.last( _size );

			updateContent( );
		}
		
		function initCtrls( ) {

			var content = document.createElement( "div" ),
				nav = document.createElement( "div" ),
				ul = document.createElement( "ul" );

			content.className = "contentlist clearbefore clearafter";

			_widget[ "content" ] = {};
			_widget[ "content" ][ "ul" ] = content.appendChild( ul );

			if ( _nav_top ) {
			
				_widget[ "nav" ] = _widget[ "impl" ].appendChild( nav );
			}
			
			_widget[ "content" ][ "impl" ] = _widget[ "impl" ].appendChild( content );

			if ( ! _nav_top ) {
				
				_widget[ "nav" ] = _widget[ "impl" ].appendChild( nav );
			}

			addNavigation( );
		}

		function addNavigation( ) {

			var first = document.createElement( "div" ),
				prev = document.createElement( "div" ),
				next = document.createElement( "div" ),
				last = document.createElement( "div" ),
				status = initNavigationStatus( ); 

			// navigation
			first.className = "contentnavfirst";
			prev.className = "contentnavprev";
			next.className = "contentnavnext";
			last.className = "contentnavlast";

			if ( _text_nav ) {

				first.appendChild( document.createTextNode("first") );
				prev.appendChild( document.createTextNode("previous") );
				next.appendChild( document.createTextNode("next") );
				last.appendChild( document.createTextNode("last") );
			}

			if ( _data.getTotalPages() > 1 ) {

				_widget[ "first" ] = _widget[ "nav" ].appendChild( first );
				_widget[ "prev" ] = _widget[ "nav" ].appendChild( prev );
				_widget[ "last" ] = _widget[ "nav" ].appendChild( last );
				_widget[ "next" ] = _widget[ "nav" ].appendChild( next );
				_widget[ "status" ] = _widget[ "nav" ].appendChild( status );
			}			
			
			// bind navigation controls to navigation function
			if ( _widget[ "status" ]  ) {

				x$.bind( _widget[ "first" ] , "click", navigate );
				x$.bind( _widget[ "prev" ] , "click", navigate );
				x$.bind( _widget[ "next" ] , "click", navigate );
				x$.bind( _widget[ "last" ] , "click", navigate );
			}
		}

		// Construct the current pages display
		function initNavigationStatus( ) {

			var	status = document.createElement( "div" ),
				sp = document.createElement( "span" ),
				curPg = document.createElement( "span" ),
				totPgs = document.createElement( "span" );

			status.className = "contentnavpages";
			curPg.setAttribute("data-bind", "currentPage");
			totPgs.setAttribute("data-bind", "totalPages");
			sp.appendChild( document.createTextNode("Page ") );
			sp.appendChild( curPg );
			sp.appendChild( document.createTextNode(" out of ") );
			sp.appendChild( totPgs );
			status.appendChild( sp );

			return status;
		}

		// Initialize the content of the widget
		function initialize( ) {

			addContentHeader( );

			initCtrls( );

			addContentFooter( );
		}

		// Update the content of the widget
		function updateContent( ) {

			var status; 
			
			x$.triggerHandler( _that, 'beforeUpdateContent', true,  _data.getCurrentData() );

			if ( _widget[ "status" ] ) {
				
				status = new x$.template( _widget[ "status" ].firstChild );

				// update the status display
				status.applyBindings( { currentPage:_data.getCurrentPage( ), totalPages:_data.getTotalPages( ) } );
			} else if ( _data.getTotalPages() > 1 ) {
				
				addNavigation( );

				status = new x$.template( _widget[ "status" ].firstChild );

				// update the status display
				status.applyBindings( { currentPage:_data.getCurrentPage( ), totalPages:_data.getTotalPages( ) } );
			}

			//  clone cached template
			var tmpcpy = _cache[ "template" ].cloneNode( true );

			// remove child nodes from the content area of the widget(if any)
			removeChildNodes( _widget[ "content" ][ "ul" ] );

			_widget[ "content" ][ "li" ] = _widget[ "content" ][ "ul" ].appendChild( document.createElement("li") );

			// copy template child nodes to the content area of widget
			moveChildNodes( tmpcpy, _widget[ "content" ][ "li" ] );

			// bind content to the widget
			var tmplt = new x$.template( _widget[ "content" ][ "li" ], options );

		 	_boxesM = tmplt.applyBindings(  _data.getCurrentData() );
		}

		// When the user clicks on a navigation control(first, previous, next, last)
		function navigate( evt ) {

			var self = evt ? ( evt.currentTarget ? evt.currentTarget : this ) : this;

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

			updateContent( );

			stopBubble( evt );
		}

		_widget[ "impl" ] = elem;

		// cache the template
		_cache[ "template" ] = moveChildNodes( elem, document.createElement("div") ).cloneNode( true );

		initialize( );

		updateContent( );

		x$.bind( elem, "click", navigate );

		this.addRow = addRow;
		this.gotoPage = gotoPage;
		this.getBoxes = getBoxes;
		this.last = last;
		
		return this;
	}

	o.ContentList = o.ContentList || cl;
} ( window ) );