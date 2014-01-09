//************************************************************************ 
//	EXTEND x$ TO SUPPORT CSS MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {
	var doc = window.document;
	var rspace = /\s+/;

	var e = {
		addClass: function( value ) {
			var classNames, i, l, elem,
				setClass, c, cl;

			if ( typeof value === "function" ) {
				return this.each(function( j ) {
					x$( this ).addClass( value.call(this, j, this.className) );
				});
			}

			if ( value && typeof value === "string" ) {
				classNames = value.split( rspace );

				elem = this.elem;

				if ( elem.nodeType && elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = setClass.trim();
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classNames, i, l, elem, className, c, cl;

			if ( typeof value === "function" ) {
				return this.each(function( j ) {
					x$( this ).removeClass( value.call(this, j, this.className) );
				});
			}

			if ( (value && typeof value === "string") || value === undefined ) {
				classNames = ( value || "" ).split( rspace );

				elem = this.elem;

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = className.trim();

					} else {
						elem.className = "";
					}
				}
			}

			return this;
		},

		hasClass: function( selector ) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			elem = this.elem;

			if ( elem.nodeType === 1 && (" " + elem.className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}

			return false;
		}		
	};

	o.extend(o.fn, e);
}(x$));