( function( o ) {

	var  __dfltWd = { 0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday",  5 : "Friday", 6 : "Saturday" };
			
	function _isLeapYear( yr ) {
		
		if ( yr % 4 != 0 ) return 0;

		if ( yr % 100 != 0 ) return 1;

		if ( yr % 400 != 0 ) return 0;

		return 1;
	}

	function _getYearMonths( yr ) {
		
		return {
			0: { name : "January", days: 31 },
			1: { name : "February", days:  28 + _isLeapYear(yr) },
			2: { name : "March", days: 31},
			3: { name : "April", days: 30 },
			4: { name : "May", days: 31 },
			5: { name : "June", days: 30 },
			6: { name : "July", days: 31 },
			7: { name : "August", days: 31 },
			8: { name : "September", days: 30 },
			9: { name : "October" , days: 31},
			10: { name : "November", days: 30 },
			11: { name : "December", days: 31 }
		};		
	}

	function stopBubble ( e ) {

		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	var e = function( elem, options ) {

		var _currDt = new Date( ),
			_selDt = options && options[ "date" ] ? options[ "date" ] : _currDt,
			_that = this,
			_boxesM = { };

		// When the user clicks on a date
		function selectDate( evt ) {

			var node = evt.target ? evt.target : undefined,
				dt = undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			if( node.tagName === "A" ) {

				dt = _boxesM[node.text].getData()["date"] ;
			}

			x$.triggerHandler( _that, "selectDate", true, dt );
			
			stopBubble( evt );
		}

		// Get the unordered list to display the weekdays Sunday to Monday		
		function getWDList( ) {

			var ul = document.createElement( "ul" ),
				wd = options && options[ "wdTemplate" ] ? options[ "wdTemplate" ] : __dfltWd;

			for( var i = 0; i < 7; i++ ) {
				
				var node = document.createTextNode( wd[i].substring(0, 3) ),
					item = document.createElement( "li" );

				if( i == 0 || i == 6) {

					item.className = "weekend";
				}

				item.appendChild( node );

				ul.appendChild( item );
			}
			
			return ul;
		}

		// Get the list of days in the month
		function getMonthCalendar( ) {

			var ul = document.createElement( "ul" );

			x$.bind( ul, "click", selectDate );

			var y = _selDt.getFullYear( ),
				m = _selDt.getMonth( ),
				d = _selDt.getDate( ),
				days = _getYearMonths( y )[ m ][ "days" ];

			// We need an offset to determine which day of the week the 1st of the month falls on
			var offset = ( new Date(y,m,1) ).getDay( );

			for ( var i = 0; i < days + offset; i++ ) {

				var node = document.createTextNode( i  + 1 - offset ),
					item = document.createElement( "li" ),
					a = document.createElement( "a" ),
					dt = undefined;

				// Start adding the dates to the list item starting after the offset
				if ( i +1 > offset ) {

					dt = new Date( y, m, i  + 1 - offset  );

					a.setAttribute( "href", "javascript:;" );

					// Highlight the weekend dates
					if ( (i +1) % 7 == 0 || (i + 1) % 7 == 1 || i == 0) {

						item.className = "weekend";
					}

					// Highlight the current date
					if ( (i + 1 - offset) == d ) {

						item.className = "current-date";	
					}

					// box the anchor element for easy access to it's related data
					if ( x$.box ) {

						var idBx = new x$.box( a, {getData:getData, setData:setData} );

						idBx.setData( dt );

						_boxesM[ i + 1 - offset ] = idBx;
					}

					a.appendChild( node );

					item.appendChild( a );
				} else {

					// Use unicode character for non-breaking space(&nbsp;)
					item.appendChild( document.createTextNode( "\u00a0") );
				}

				ul.appendChild( item );
			}

			function setData( o, v ) {

				o[ "date" ] = v;
			}

			function getData( o ) {

				return o;
			}

			return ul;
		}

		function renderYear( ) {}

		function renderMonth( ) {

			var ulWL = getWDList( ),
 				ulMC = getMonthCalendar( );

			ulWL.className = "weekdays default invisible";
			ulMC.className = "weekdays default invisible"

			elem.appendChild( ulWL );
			elem.appendChild( ulMC );

			ulWL.className = "weekdays default visible";
			ulMC.className = "weekdays default visible"

			x$.triggerHandler( _that, "renderMonth", true, { days:ulMC, weekdays:ulWL } );
		}

		function renderWeek( ) {}

		this.render = function ( options ) {

			console.log(_selDt);

			switch( options[ "interval" ] ) {

				case "year":
					renderYear(  );

					break;
				case "month":
					renderMonth(  );

					break;
				case "week":
					renderWeek(  );

					break;
				default:
					renderMonth(  );

					break;
			}
			
			return this;
		}

		this.getBoxes = function( ) {

			return _boxesM;
		}

		this. getCurDate = function( ) {

			return _currDt;
		}

		this.getSelDate = function ( ) {

			return _selDt;
		}

		this.setDate = function ( d ) {
			
			_selDt = d;

			return this;
		}

		this.addEvent = function ( evtData ) {

			return this;
		}

		return this;
	}

	o.datewidget = o.datewidget || e;
} ( window ) );