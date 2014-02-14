//************************************************************************ 
//	EXTEND x$ TO SUPPORT ITERATION THROUGH ARRAYS 
//	This is useful for traversing data that is stored in arrays
//	with next, previous and current functions
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {

	var e = function( arr, size ) {
		
		var _curRow = undefined;

		function isArray( o ) {

			return x$.isArray( o );
		}

		function currentPage( row, size ) {
			// ( CR % PS ) + ( CR div PS )
			return ( (row+1) % size ) + Math.floor( (row+1) / size )
		}

		function totalPages( totalSize, pageSize) {

			return ( Math.floor(totalSize / pageSize) + ((totalSize % pageSize) > 0 ? 1 : 0) )
		}
		
		function rowsOnCurrentPage ( page, pageSize, totalSize ) {

			var rows = 0
				,totPages = totalPages( totalSize, pageSize );

			if ( page < 1 ) return 0;

			if ( totPages > page ) {
				rows = pageSize;
			} else if ( totPages === page ) {
				rows = pageSize - ( (totPages * pageSize) % totalSize );
			} 
			return rows;
		}

		function updateCurRow( curRow, next, size, totalSize ) {

			if ( !size ) {
				size = 1;
			}

			if ( curRow === undefined ) {
				curRow = 0;
			} else {
				switch( next ) {
					case "next":
						if( curRow + size <= totalSize -1 ) {
							curRow += size;
						}
						break;
					case "previous":
						if ( curRow - size < 0) {
							curRow = 0;
						} else {
							curRow -= size;
						}
						break;
					case "last":
						curRow = totalPages( totalSize, size ) * size - size;
						break;
					case "first":
						curRow = 0;
						break;
				}
			}

			return curRow;
		}

		// Move the row pointer <<size>> rows forward
		var next = function( size ) {

			_curRow = updateCurRow( _curRow, "next", size, arr.length );

			x$.triggerHandler( this, "next", true, {curRow: _curRow, data: this } );

			return this;
		};

		// Move the row pointer <<size>> rows backward
		var previous = function( size ) {

			_curRow = updateCurRow( _curRow, "previous", size, arr.length );

			x$.triggerHandler( this, "previous", true, {curRow: _curRow, data: this } );

			return this;
		};

		// Move the row pointer to the first record of the first page
		var first = function ( size ) { 

			_curRow = updateCurRow( _curRow, "first", size, arr.length );

			x$.triggerHandler( this, "first", true, {curRow: _curRow, data: this } );

			return this;
		};

		// Move the row pointer to the first record of the last page
		var last = function ( size ) {

			_curRow = updateCurRow( _curRow, "last", size, arr.length );

			x$.triggerHandler( this, "last", true, {curRow: _curRow, data: this } );

			return this;
		};

		// Move the row pointer to the first record of the the given page
		var gotoPage = function ( page ) {

			if( page > 0 && page <= totalPages( arr.length, size ) ) {

				_curRow = page * size - size;
			}

			return this;
		};

		// Move the row pointer to the given row - 1 based ordering is assumed
		var gotoRow = function ( row ) {

			if( row > 0 && row <= arr.length ) {

				_curRow = row - 1;
			}

			return this;
		};

		// Returns the array with the data of specified size at the current row pointer
		var getCurrentData = function( ) {

			return arr.slice( _curRow, _curRow + size );
		};

		// Returns the zero-based current position of the row pointer
		var getCurrentRow = function( ) {

			return _curRow;
		};	

		// Returns the total numbers of rows in the array
		var getTotalRows = function	( ) {

			return arr.length;
		};

		// Returns the currently set maximum number of rows per page
		var getPageSize = function ( ) {

			return size;
		};

		// Returns the total numbers of rows in the array
		var getTotalPages =  function ( ) {

			return totalPages( arr.length, size );
		};

		// Return the current page in the array
		var getCurrentPage = function ( ) {

			return currentPage( _curRow, size );
		};

		var getRowsOnCurrentPage = function ( ) {

			return rowsOnCurrentPage( getCurrentPage(_curRow, size), size, arr.length );
		};

		if ( isArray( arr ) ) {

			if ( size < 0 ) 
				size = 0;

			_curRow = 0;
		}

		return {
			getCurrentData: getCurrentData,
			getCurrentPage: getCurrentPage,
			getCurrentRow: getCurrentRow,
			first: first,
			gotoPage: gotoPage,
			gotoRow: gotoRow,
			last: last,
			next: next,
			getPageSize: getPageSize,
			previous: previous,
			getRowsOnCurrentPage: getRowsOnCurrentPage,
			getTotalPages: getTotalPages,
			getTotalRows: getTotalRows
		}
	};

	o.iterator = o.iterator || e;
}( x$ ));