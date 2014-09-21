// DateProvider
( function( o ) {

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

	function _isLeapYear( yr ) {
		
		if ( yr % 4 != 0 ) return 0;

		if ( yr % 100 != 0 ) return 1;

		if ( yr % 400 != 0 ) return 0;

		return 1;
	}

	var p = function( someDate ) {

		var _dt = someDate ? someDate : new Date( ),
			_c = [ ],
			_that = this,
			_boxesM = { };

		this.addConsumer = function( topic, fn ) {

			if ( ! _c.hasOwnProperty(topic) ) {

				_c[ topic ] = [ ];
			}

			if( fn == undefined )
				return;

			var idx = _c[ topic ].indexOf ( fn );

			if( idx <= -1 ) {
			
				_c[ topic ].push( fn );
			}
			
			// Notify the consumer
			// fn( _dt );

			return this;
		}

		this. getDate = function( ) {

			return _dt;
		}

		this.getDaysInMonth = function( ) {

			var y = _dt.getFullYear( ),
				m = _dt.getMonth( );

			return _getYearMonths( y )[ m ][ "days" ]
		}

		this.getMonthName = function( ) {

			var y = _dt.getFullYear( ),
				m = _dt.getMonth( );

			return _getYearMonths( y )[ m ][ "name" ]
		}

		// Move the date m months in the future
		this.nextMonth = function( m ) {

			var om = _dt.getMonth( ), // old month
				nmax = undefined;

			if ( m > 0 ) {
				
				if ( om  < 10 ) {

					// If next month has fewer days than current date
					if ( _getYearMonths( _dt.getFullYear() )[ om + 1 ][ "days" ]  < _dt.getDate() ) {

						nmax = _getYearMonths( _dt.getFullYear() )[ om + 1 ][ "days" ];

						_dt = new Date( _dt.getFullYear(), om + 1, nmax );
					} else {

						_dt.setMonth( _dt.getMonth() + m ); 
					}
					
				} else {

					_dt.setMonth( _dt.getMonth() + m ); 
				}

				this.notifyConsumers( "changeMonth" );
			} else if ( m < 0 ) {

				if( om > 1 ) {

					// If previous month has fewer days than current date
					if ( _getYearMonths( _dt.getFullYear() )[ om - 1 ][ "days" ]  < _dt.getDate() ) {

						nmax = _getYearMonths( _dt.getFullYear() )[ om - 1 ][ "days" ];

						_dt = new Date( _dt.getFullYear(), om - 1, nmax );
					} else {

						_dt.setMonth( _dt.getMonth() + m ); 
					}
				} else {

					_dt.setMonth( _dt.getMonth() + m ); 
				}

				this.notifyConsumers( "changeMonth" );
			}

			return _dt;
		}

		this.notifyConsumers = function( topic ) {

			if ( ! _c.hasOwnProperty(topic) ) {

				return false;
			}

			for ( var i = _c[ topic ].length - 1; i >= 0; i-- ) {

				_c[ topic ][ i ]( );
			};
		}

		this.removeConsumer = function( topic, c ) {

			if ( ! _c.hasOwnProperty(topic) ) {

				return false;
			}

			var idx = _c[ topic ].indexOf ( c );

			if( idx > -1 ) {

				_c[ topic ].splice( idx, 1 );
			}

			if ( _c[ topic ].length == 0 ) {

				delete _c[ topic ];
			}

			return this;
		}

		this.setDate = function ( dt ) {
			
			_dt = dt;
			
			this.notifyConsumers( "changeDate" );
			
			return this;
		}

		p.prototype.getYearMonths = _getYearMonths;

		return this;
	}

	o.DateProvider = o.DateProvider || p;

} ( window ) );

// Month calendar
( function( o ) {

	var  __dfltWd = { 0 : "Sunday", 1 : "Monday", 2 : "Tuesday", 3 : "Wednesday", 4 : "Thursday",  5 : "Friday", 6 : "Saturday" };
			
	function stopBubble ( e ) {

		if ( !e ) var e = window.event;
		if ( e ) e.cancelBubble = true;
		if ( e && e.stopPropagation ) e.stopPropagation();
	}

	// Every calendar widget is mapped to a dateprovider.
	var mc = function( elem, dtP ) {

		if  ( elem == undefined ) return false;

		var _that = this,
			_boxesM = { },
			_dataBind = undefined, // captures the data-bind attribute of the widget container
			_widget = { },
			_cCache = { };

		if ( elem.getAttributeNode("data-bind") ) {
			
			_dataBind = elem.getAttribute( "data-bind" );

			elem.removeAttribute( "data-bind" );
		}

		function composeCalendar( ) {

			var dt = dtP.getDate( ),
				y = dt.getFullYear( ),
				m = dt.getMonth( ),
				d = dt.getDate( ),
				days = dtP.getDaysInMonth( ),
				offset = ( new Date(y,m,1) ).getDay( ),
				today = new Date( ),
				cDiv = _widget[ "content" ][ "impl" ],
				c = _widget[ "content" ];

			if ( ! c.hasOwnProperty("month") ) {

				c[ "month" ] = { };
				c[ "month" ][ "impl" ] = document.createElement( "ul" );
				c[ "month" ][ "impl" ].className = "month";
			} else {

				c[ "month" ][ "impl" ].innerHTML = "";
			}

			c[ "month" ][ "ord" ] = m; // zero based index of month

			for ( var i = 0; i < days + offset; i++ ) {
				
				// A tracked list item
				c[ "month" ][ i ] = {};
				c[ "month" ][ i ][ "impl" ] = document.createElement( "li" );

				// Start adding the dates to the list item starting after the offset
				if ( i +1 > offset ) {					

					dt = new Date( y, m, i  + 1 - offset  );

					// Anchor to hold the date value and link
					c[ "month" ][ i ][ "a" ] = document.createElement( "a" );
					c[ "month" ][ i ][ "a" ] .setAttribute( "href", "javascript:;" );

					// Highlight the weekend dates
					if ( (i +1) % 7 == 0 || (i + 1) % 7 == 1 || i == 0 ) {

						c[ "month" ][ i ][ "impl" ].className = "weekend";
					}

					// Highlight today's date.  It will be overriden by a different highlight
					// if it's also the currently selected date
					if( (today.getFullYear().toString() +
						today.getMonth().toString() +
						today.getDate().toString() ) 
						== (dt.getFullYear().toString() +
						dt.getMonth().toString() +
						dt.getDate().toString() ) ) {

						c[ "month" ][ i ][ "impl" ].className = "today";
					}

					// Highlight the current date
					if ( (i + 1 - offset) == d ) {

						c[ "month" ][ i ][ "impl" ].className = "current-date";	
					}

					// box the anchor element to map it to an actual date - dt
					if ( x$.box ) {

						var idBx = new x$.box( c[ "month" ][ i ][ "a" ], {getData:getData, setData:setData} );

						idBx.setData( dt );

						_boxesM[ i + 1 - offset ] = idBx;
					}

					c[ "month" ][ i ][ "a" ].appendChild( document.createTextNode( i  + 1 - offset ) );
					c[ "month" ][ i ][ "impl" ].appendChild( c[ "month" ][ i ][ "a" ]  );
				} else {

					// Use unicode character for non-breaking space(&nbsp;)
					c[ "month" ][ i ][ "impl" ].appendChild( document.createTextNode( "\u00a0") );
				}

				c[ "month" ][ "impl" ].appendChild( c[ "month" ][ i ][ "impl" ] );
			}

			cDiv.appendChild( c[ "month" ][ "impl" ] );

			// function to be used by boxing object to set the data
			function setData( o, v ) {

				o[ "date" ] = v;
			}

			// function to get the data in the boxing object
			function getData( o ) {

				return o;
			}
		}
		// Generate the month header with information Month, Year
		function composeMHeader( ) {

			var dt = dtP.getDate( ),
				cDiv = _widget[ "content" ][ "impl" ],
				c = _widget[ "content" ];

			if ( ! c.hasOwnProperty("header") ) {

				c[ "header" ] = { };
				c[ "header" ][ "impl" ] = document.createElement( "div" );
				c[ "header" ][ "impl" ].className = "header";

				cDiv.appendChild( c[ "header" ][ "impl" ] );
			}

			if ( ! c["header"].hasOwnProperty("prev") ) {

				c[ "header" ][ "prev" ] = { };

				c[ "header" ][ "prev" ][ "impl"] = document.createElement( "a" );
				c[ "header" ][ "prev" ][ "impl" ].className = "prev";

				c[ "header" ][ "prev" ][ "impl" ].setAttribute( "href", "javascript:;" );
				c[ "header" ][ "prev" ][ "impl" ].setAttribute( "title", "Previous Month" );

				c[ "header" ][ "prev" ][ "text" ] = document.createTextNode( "prev" );

				c[ "header" ][ "prev" ][ "impl" ].appendChild( c[ "header" ][ "prev" ][ "text" ] );
				c[ "header" ][ "impl" ].appendChild( c[ "header" ][ "prev" ][ "impl" ] );
			}

			if ( ! c["header"].hasOwnProperty("text") ) {

				c[ "header" ][ "text" ] =document.createElement("span");
				c[ "header" ][ "impl" ].appendChild( c["header"]["text"] );
			}

			c[ "header" ][ "text" ].innerHTML = dtP.getMonthName( dt.getMonth() ) + ", " + dt.getFullYear( );

			if ( ! c["header"].hasOwnProperty("next") ) {

				c[ "header" ][ "next" ] = { };

				c[ "header" ][ "next" ][ "impl"] = document.createElement( "a" );
				c[ "header" ][ "next" ][ "impl" ].className = "next";

				c[ "header" ][ "next" ][ "impl" ].setAttribute( "href", "javascript:;" );
				c[ "header" ][ "next" ][ "impl" ].setAttribute( "title", "Next Month" );

				c[ "header" ][ "next" ][ "text" ] = document.createTextNode( "next" );

				c[ "header" ][ "next" ][ "impl" ].appendChild( c[ "header" ][ "next" ][ "text" ] );
				c[ "header" ][ "impl" ].appendChild( c[ "header" ][ "next" ][ "impl" ] );
			}
		}

		function composeTextBox( ) {

			var cDiv = _widget[ "content" ][ "impl" ],
				c = _widget[ "content" ],
				tw = undefined,
				txtW = undefined,
				dt = dtP.getDate( );

			if ( ! c.hasOwnProperty("textbox") ) {

				tw = document.createElement( "div" );

				tw.setAttribute( "class", "textwidget" );
				tw.setAttribute( "prompt", "MM/DD/YYYY" );
				tw.setAttribute( "valid-ptn", "^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$" );

				c[ "textbox" ] = {};
				c[ "textbox" ][ "impl" ] = tw;

				cDiv.appendChild( c["textbox"][ "impl" ] );
	
				if ( _dataBind != undefined ) {
					
					c[ "textbox" ][ "impl" ].setAttribute( "data-bind", _dataBind );
				}

				c[ "textbox" ][ "content" ] = new TextWidget( tw, {mode:"entry"} );

				c[ "textbox" ][ "content" ].setValue( ( dt.getMonth( )+1 ) + "/" + dt.getDate( ) + "/" + dt.getFullYear( ) );

				x$.bind( c[ "textbox" ][ "content" ] .getNode( ), "click",  txtBoxClick );
				x$.bind( c[ "textbox" ][ "content" ] .getNode( ), "change",  txtBoxChange );
			}
		}

		// Generate the unordered list to display the weekdays Sunday to Monday		
		function composeWDList( ) {

			var cDiv = _widget[ "content" ][ "impl" ],
				c = _widget[ "content" ],
				wd = __dfltWd,
				node;

			if ( ! c.hasOwnProperty("week") ) {

				c[ "week" ]	 = { };
				c[ "week" ][ "impl" ] = document.createElement( "ul" );

				for( var i = 0; i < 7; i++ ) {
					
					node = document.createTextNode( wd[i].substring(0, 3) );
					c[ "week" ][ i ] = document.createElement( "li" );

					if( i == 0 || i == 6) {

						c[ "week" ][ i ] .className = "weekend";
					}

					c[ "week" ][ i ] .appendChild( node );

					c[ "week" ][ "impl" ].appendChild( c[ "week" ][ i ]  );
				}

				c[ "week" ][ "impl" ].className = "week";

				cDiv.appendChild( c[ "week" ][ "impl" ] );
			}
		}

		function isDescendant( parent, child ) {

		     var node = child.parentNode;

		     while ( node != null ) {

		         if ( node == parent ) {

		             return true;
		         }

		         node = node.parentNode;
		     }

		     return false;
		}

		function isValidDate(  dt ) {

			if ( Object.prototype.toString.call(dt) === "[object Date]" ) {

				// it is a date
				if ( isNaN( dt.getTime() ) ) {  
			    		
			    		return false;
			  	}
			  	else {
			    		
			    		return true;
			  	}
			}
			else {
			 	
			 	return false;
			}		
		}

		this. getDate = function( ) {

			return dtP.getDate( );
		}

		this.onChangeDate = function( ) {

			updateCalendar(  );

			resetVisibility( );
		}

		this.onChangeMonth = function( ) {

			updateCalendar( );

			resetVisibility( );
		}

		this.setDate = function ( d ) {
			
			dtP.setDate( d );

			return this;
		}

		// Hide the calendar widget
		function hideCalendar( ) {

			var c = _widget[ "content" ];

			c[ "header" ][ "impl" ].className = "invisible";
			c[ "week" ][ "impl" ].className = "invisible";
			c[ "month" ][ "impl" ].className = "invisible";			

			if ( ! _cCache.hasOwnProperty("header") ) {

				_cCache[ "header" ] = { };
				_cCache[ "week" ] = { };
				_cCache[ "month" ] = { };
			}

			_cCache[ "header" ][ "class" ] = "invisible";
			_cCache[ "week" ][ "class" ] = "invisible";
			_cCache[ "month" ][ "class" ] = "invisible";
		}
		
		// Set the visibility of the controls to it's previous value :- after updating the calendar.
		function resetVisibility( ) {

			var c = _widget[ "content" ];

			c[ "header" ][ "impl" ].className = _cCache[ "header" ][ "class" ];
			c[ "week" ][ "impl" ].className = _cCache[ "week" ][ "class" ];
			c[ "month" ][ "impl" ].className = _cCache[ "month" ][ "class" ];			
		}

		// Update the calendar widget
		function updateCalendar( ) {

			composeTextBox( );
			composeMHeader( );
			composeWDList( );
			composeCalendar( );

			elem.className = "datewidget small";

			x$.triggerHandler( _that, "updateCalendar", true, { days:_widget["content"]["month"]["impl"], weekdays:_widget["content"]["week"]["impl"] } );
		}

		// Render the calendar widget
		function showCalendar( ) {

			var c = _widget[ "content" ];

			c[ "header" ][ "impl" ].className = "header";
			c[ "week" ][ "impl" ].className = "week";
			c[ "month" ][ "impl" ].className = "month";

			if ( ! _cCache.hasOwnProperty("header") ) {

				_cCache[ "header" ] = { };
				_cCache[ "week" ] = { };
				_cCache[ "month" ] = { };
			}

			_cCache[ "header" ][ "class" ] = "header";
			_cCache[ "week" ][ "class" ] = "week";
			_cCache[ "month" ][ "class" ] = "month";
		}

		function documentBodyClick( evt ) {

			var node = evt.target ? evt.target : undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			// hide calendar if the clicked element is a part of the widget
			if (  ! isDescendant(elem, node) && ! (node == elem) ) {

				hideCalendar( );
			}
		}

		function documentKeyDown( e ) {
		
		    if ( !e ) {

		        e = event;    
		    }

		    if ( e.keyCode == 27 ) {

		        hideCalendar( );
		    }					
		}		

		function txtBoxClick( o ) {
			
			showCalendar( )
		}

		function txtBoxChange( evt ) {
			
			var node = evt.target ? evt.target : undefined,	
				dt;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			setDateFromInput( node );
		}

		function setDateFromInput( inpt ) {

			dt = inpt.value == "" ? new Date( ) : new Date( inpt.value );

			if ( isValidDate( dt ) ) {

				inpt.value = ( dt.getMonth( )+1 ) + "/" + dt.getDate( ) + "/" + dt.getFullYear( );

				dtP.setDate( new Date(dt) );

			} else {

				inpt.value  = "invalid date";
			}
		}

		// When the user clicks on a date
		function selectDate( evt ) {

			var node = evt.target ? evt.target : undefined,
				dt = undefined,
				m = false;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );
			
			if( node.tagName === "A" ) {

				switch( node.className ) {
					case "next":

						dt = dtP.nextMonth( 1 );
						m = true;

						break;
					case "prev":

						dt = dtP.nextMonth( -1 );
						m = true;

						break;
					default:

						dt =  _boxesM[node.text].getData( )[ "date" ] ;

						_that.setDate( dt );
					
						break;					
				}

				var txtBox = _widget[ "content" ][ "textbox" ][ "content" ];

				txtBox.setValue( ( dt.getMonth()+1 ) + "/" + dt.getDate() + "/" + dt.getFullYear() );
	
				// If user is not navigating through months, hide the widget
				if( ! m ) {
					
					hideCalendar( );
				}

				stopBubble( evt );
			}
		}

		_widget[ "impl" ] = elem;
		_widget[ "content" ] = { };
		_widget[ "content" ][ "impl" ] = document.createElement( "div" );
		_widget[ "impl" ].appendChild( _widget[ "content" ][ "impl" ] );

		if ( dtP.addConsumer != undefined ) {

			dtP.addConsumer( "changeDate", _that.onChangeDate );
			dtP.addConsumer( "changeMonth", _that.onChangeMonth );
		}

		updateCalendar( );

		hideCalendar( )

		x$.bind( elem, "click", selectDate );
		x$.bind( document.body, "click", documentBodyClick );
		x$.bind( document, "keydown", documentKeyDown );

		return this;
	}

	o.MonthCalendar = o.MonthCalendar || mc;
	
} ( window ) );