// TextWidget
( function( o ) {

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

	var tb = function( elem, options ) {

		if  ( elem == undefined ) return false;

		var _that = this,
			_dataBind = undefined, // captures the data-bind attribute of the widget container
			_prompt = undefined,
			_widget = {},
			_stateEnum = { prompt:1, entry:2 },
			_state = _stateEnum[ "prompt" ],
			_emptyPtn = /^(\s+|\B)$/, // Empty regular expression pattern
			_validPtn = /./;  

		if ( elem.getAttributeNode("data-bind") ) {
			
			_dataBind = elem.getAttribute( "data-bind" );

			elem.removeAttribute( "data-bind" );
		}

		if ( elem.getAttributeNode("prompt") ) {
			
			_prompt = elem.getAttribute( "prompt" );

			elem.removeAttribute( "prompt" );
		}

		if ( elem.getAttributeNode("valid-ptn") ) {
			
			_validPtn = new RegExp( elem.getAttribute("valid-ptn") );

			elem.removeAttribute( "valid-ptn" );
		}

		// Generate the text box 
		function composeTextBox( ) {

			_widget[ "impl" ] = elem;
			_widget[ "content" ] = { };

			_widget[ "content" ][ "impl" ] = document.createElement( "input" );

			_widget[ "content" ][ "impl" ].setAttribute( "type", "text" );
			_widget[ "impl" ].appendChild( _widget[ "content" ][ "impl" ] );			


			if ( _dataBind != undefined ) {
				
				_widget[ "content" ][ "impl" ].setAttribute( "data-bind", _dataBind );
			}

			if ( _prompt != undefined ) {
				
				if ( _state ==  _stateEnum["prompt"] ) {

					_widget[ "content" ][ "impl" ].className = "prompt";
					_widget[ "content" ][ "impl" ].setAttribute( "value", _prompt );
				}
			}

			if ( options && options.mode && options.mode == "entry" ) {

				_state = _stateEnum[ "entry" ];
				_widget[ "content" ][ "impl" ].className = "entry";

				if ( _widget["content"]["impl"].value == _prompt ) {

					_widget["content"]["impl"].value = "";
				}
			}

			x$.bind( _widget[ "content" ]["impl"], "blur",  onTxtBoxChange );
			x$.bind( _widget[ "content" ]["impl"], "change",  onTxtBoxChange );
			x$.bind( _widget[ "content" ]["impl"], "focus",  onWidgetClick );
		}

		// This function validates against the pattern _validPtn
		function isValid( ) {

			if ( _widget[ "content" ][ "impl" ].value.match(_validPtn) ) {

				return true;
			}

			return false;
		}

		// Retrieve the underlying text nodeof the widget
		function getNode( ) {

			return _widget[ "content" ][ "impl" ];
		}

		// Retrieve the underlying value of the widget
		function getValue( ) {

			return _widget[ "content" ][ "impl" ].value;
		}

		// Dynamically set the underlying value of the widget
		function setValue( value ) {

			_state = _stateEnum[ "entry" ];
			_widget[ "content" ][ "impl" ].className = "entry";
			_widget[ "content" ][ "impl" ].value = value;

			if ( ! isValid() ) {

				_widget[ "content" ][ "impl" ].className = "invalid";
			}

			return _that;	
		}

		// Event handlers
		function onDocumentBodyClick( evt ) {

			var node = evt.target ? evt.target : undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			// if no part of the widget is clicked 
			if (  ! isDescendant(elem, node) && ! (node == elem) ) {

				if ( _widget[ "content" ][ "impl" ].value.match(_emptyPtn) ) {
					
					_state = _stateEnum[ "prompt" ];
					_widget[ "content" ][ "impl" ].className = "prompt";
					_widget[ "content" ][ "impl" ].value = _prompt;
				}
			}
		}

		function onTxtBoxChange( evt ) {
			
			var node = evt.target ? evt.target : undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );

			if ( node.tagName == "INPUT" ) {

				if ( ! (_widget[ "content" ][ "impl" ].value.match(_emptyPtn)  || _state == _stateEnum["prompt"]) ) {
					
					if ( ! isValid() ) {

						_widget[ "content" ][ "impl" ].className = "invalid";
					}
				} else {

					_state = _stateEnum[ "prompt" ];
					_widget[ "content" ][ "impl" ].className = "prompt";
					_widget[ "content" ][ "impl" ].value = _prompt;
				}
			}
		}

		// When the user clicks on the widget
		function onWidgetClick( evt ) {

			var node = evt.target ? evt.target : undefined;

			node = node || ( evt.srcElement ? evt.srcElement : undefined );
			
			if( node.tagName === "INPUT" ) {

				if ( _state == _stateEnum["prompt"] ) {

					node.value = "";

					_state = _stateEnum[ "entry" ];
					node.className = "entry"; 
				} else {

					_state = _stateEnum[ "entry" ];
					node.className = "entry"; 
				}
			}
		}

		composeTextBox( );

		x$.bind( elem, "click", onWidgetClick );
		x$.bind( document.body, "click", onDocumentBodyClick );

		this.getNode = getNode;
		this.getValue = getValue;
		this.setValue = setValue;

		return this;
	}

	o.TextWidget = o.TextWidget || tb;
	
} ( window ) );