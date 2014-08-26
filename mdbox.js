//************************************************************************ 
//	EXTEND x$ TO SUPPORT BOXING OF OBJECTS(DOM/non-DOM)
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdtemplates.js??
// Expects: an object.  getData function of type fn( obj )
//						setData function of type fn( obj, val )
//************************************************************************ 	

( function( o ){

	function _getData( data ) {

		return data;
	}

	function _setData( data, val ) {

		data[ val ] = val;
	}

	function boxArray( arr ) {
		
		var _boxes = {};
		
		for( i = 0; i < arr.length; i++ ) {

			var idBx = new _e( arr[i] );

			idBx.setData( arr[i] );

			_boxes[ arr[i] ] = idBx;
		}

		return _boxes;
	}

	function boxOptions( arr ) {

		var _boxes = {};

		for( i = 0; i < arr.length; i++ ) {

			var idBx = new _e( arr[i] );

			idBx.setData( arr[i].value );

			_boxes[ arr[i].value ] = idBx;
		}

		return _boxes;
	}

	// _e uses non-customizable setters
	var _e = function( o ) {

		var _data = { };

		_data[ "node" ] = o;

		function getData( ) {

			return _getData( _data );
		}

		function setData( v ) {

			_setData( _data, v );

			return this;
		}

		function isBox( ) {

			return true;
		}

		function getElem(  ) {

			return _data[ "node" ];
		}

		return {
			getData	: getData,
			setData	: setData,
			isBox 	: isBox,
			getElem	: getElem
		};
	};

	// Customizable version.  It lets the user decide the setters and getters
	var e = function( o, options ) {

		var _data = { };

		_data[ "node" ] = o;

		function getData( ) {

			if ( options.getData ) 
				return options.getData( _data );

			return "n/a";
		}

		function setData( v ) {

			if( options.setData )
				options.setData( _data, v );

			return this;
		}

		function isBox( ) {

			return ( options.getData && options.setData );
		}

		function getElem(  ) {

			return _data[ "node" ];
		}

		return {
			getData	: getData,
			setData	: setData,
			isBox 	: isBox,
			getElem	: getElem
		};
	};

	o.box = o.box || e;
	o.boxArray = o.boxArray || boxArray;
	o.boxOptions = o.boxOptions || boxOptions;
}(x$) );