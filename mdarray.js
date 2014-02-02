//************************************************************************ 
//	EXTEND x$ TO SUPPORT ARRAYS 
//	This is useful for traversing data that is stored in arrays
//	with next, previous and current functions
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {

	function isArray( o ) {

		return x$.isArray( o );
	}

	function currentPage( row, size ) {
		// ( CR % PS ) + ( CR div PS )
		return ( (row+1) % size ) + Math.floor( (row+1) / size )
	}

	function totalPages( totalSize, pageSize) {

		return ( Math.floor( totalSize / pageSize ) + ( ( totalSize % pageSize ) > 0 ? 1 : 0 ) )
	}
	
	function rowsOnCurrentPage ( page, pageSize, totalSize ) {

		var rows = 0
			,totPages = totalPages( totalSize, pageSize );

		if ( page < 1 ) return 0;

		if ( totPages > page ) {
			rows = pageSize;
		} else if ( totPages = page ) {
			rows = pageSize - ( (totPages*pageSize) % totalSize );
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

	var e = new function() {
		this._curRow = undefined
			, this._pageSize = 0
			, this._totalSize = undefined;
	};

	// Initialize the array
	e.initArray = function ( size ) {

		if ( isArray( this.elem ) ) {

			this._pageSize = size ? size 
						: this._pageSize;

			this._totalSize = this.elem.length;

			if ( !this._curRow )
				this._curRow = 0;
		}

		return this;
	};

	// Move the row pointer <<size>> rows forward
	e.next = function( size ) {

		this._curRow = updateCurRow( this._curRow, "next", size, this._totalSize );

		return this;
	};

	// Move the row pointer <<size>> rows backward
	e.previous = function( size ) {

		this._curRow = updateCurRow( this._curRow, "previous", size, this._totalSize );

		return this;
	};

	e.first = function ( size ) { 

		this._curRow = updateCurRow( this._curRow, "first", size, this._totalSize );

		return this;
	};

	e.last = function ( size ) {

		this._curRow = updateCurRow( this._curRow, "last", size, this._totalSize );

		return this;
	};

	// Returns the array with the data of specified size at the current row pointer
	e.current = function( size ) {

		return this.elem.slice( this._curRow, this._curRow + this._pageSize );
	};

	// Returns the zero-based current position of the row pointer
	e.currentRow = function( ) {

		return this._curRow;
	};	

	// Returns the total numbers of rows in the array
	e.totalRows = function	( ) {

		return this._totalSize;
	};

	// Returns the currently set maximum number of rows per page
	e.pageSize = function ( ) {

		return this._pageSize;
	};

	// Returns the total numbers of rows in the array
	e.totalPages =  function ( ) {

		return  totalPages( this._totalSize, this._pageSize );
	};

	// Return the current page in the array
	e.currentPage = function ( ) {

		return currentPage( this._curRow, this._pageSize );
	};

	// Return the number of rows on the current array page
	e.rowsOnCurrent = function ( ) {

		return rowsOnCurrentPage( currentPage(this._curRow, this._pageSize), this._pageSize, this._totalSize );
	};

	o.extend(o.fn, e);
}(x$));