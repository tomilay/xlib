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
}(x$) );