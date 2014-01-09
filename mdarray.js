//************************************************************************ 
//	EXTEND x$ TO SUPPORT ARRAYS 
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {
	var curRow = undefined;
	var pageSize = undefined;

	function isArray( o ) {

		return x$.isArray( o );
	}

	function updateCurRow( next, size ) {

		if ( isArray( this ) ) {

			if ( !size ) {
				size = 1;
			}

			if ( curRow === undefined ) {
				curRow = 0;
			} else {
				if( next ) {
					if( curRow + size <= this.length -1 ) {
						curRow += size;
					}
				} else {
					if ( curRow - size < 0) {
						curRow = 0;
					} else {
						curRow -= size;
					}
				}
			}

			pageSize = size;
		}
	}

	var e = {
		next: function( size ) {

			updateCurRow.call( this.elem, true, size );

			return this;
		},

		previous: function( size ) {

			updateCurRow.call( this.elem, false, size );

			return this;
		},

		current: function( size ) {

			if ( isArray( this.elem ) ) {

				pageSize = size ? size 
							: pageSize;

				if ( !curRow )
					curRow = 0;

				return this.elem.slice( curRow, curRow + pageSize );
			}
		}		
	};

	o.extend(o.fn, e);
}(x$));