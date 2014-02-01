//************************************************************************ 
//	EXTEND x$ TO SUPPORT ARRAYS 
//	This is useful for traversing data that is stored in arrays
//	with next, previous and current functions
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {
	var curRow = undefined;
	var pageSize = 1;

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
		// Move the row pointer <<size>> rows forward
		next: function( size ) {

			updateCurRow.call( this.elem, true, size );

			return this;
		},

		// Move the row pointer <<size>> rows backward
		previous: function( size ) {

			updateCurRow.call( this.elem, false, size );

			return this;
		},

		// Returns the array with the data of specified size at the current row pointer
		current: function( size ) {

			if ( isArray( this.elem ) ) {

				pageSize = size ? size 
							: pageSize;

				if ( !curRow )
					curRow = 0;

				return this.elem.slice( curRow, curRow + pageSize );
			}
		},	

		// Returns the total numbers of rows in the array
		totalRows: function	( ) {

			if ( isArray( this.elem ) ) {
				
				return this.elem.length;
			}
			return undefined;
		},

		// Returns the currently set maximum number of rows per page
		pageSize: function ( ) {
			return pageSize;
		},

		// Returns the total numbers of rows in the array
		totalPages:  function ( ) {
			if ( isArray( this.elem ) ) {

				return ( Math.floor( this.elem.length / pageSize ) + ( ( this.elem.length % pageSize ) > 0 ? 1 : 0 ) );
			}
			return undefined;
		},

		// Return the current page in the array
		currentPage: function( ) {
			// ( CR % PS ) + ( CR div PS )
			return ( (curRow+1) % pageSize ) + Math.floor( (curRow+1) / pageSize );
		},

		// Return the number of rows on the current array page
		rowsOnCurrent: function ( ) {
			return this.elem.slice( curRow, curRow + pageSize ).length;
		}
	};

	o.extend(o.fn, e);
}(x$));