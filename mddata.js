//************************************************************************ 
//	EXTEND x$ TO SUPPORT DATA MANIPULATION
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// 	Dependency: mdcore.js
//	
//	This module borrows heavily from jQuery's caching and data 
//	functionality
//************************************************************************ 		
(function(o) {
	// checks a cache object for emptiness
	function isEmptyDataObject( obj ) {
		for ( var name in obj ) {

			// if the public data object is empty, the private is still empty
			if ( name === "data" && x$.isEmptyObject( obj[name] ) ) {
				continue;
			}
			if ( name !== "toJSON" ) {
				return false;
			}
		}

		return true;
	}

	var doc = window.document;
	var rspace = /\s+/;

	var e = {
		data: function( key, value ) {
			var parts, attr, name,
				data = null;

			if ( typeof key === "undefined" ) {
				if ( this.elem ) {
					data = x$.data( this.elem );
				}

				return data;
			} else if ( typeof key === "object" ) {
				return this.each(function() {
					x$.data( this, key );
				});
			}

			parts = key.split( "." );
			parts[ 1 ] = parts[ 1 ] ? "." + parts[ 1 ] : "";

			if ( value === undefined ) {
				this.triggerHandler("getData", true, [ parts[0] ]);

				// Try to fetch any internally stored data first
				if ( data === null && this.elem ) {
					data = x$.data( this.elem, key );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;

			} else {
				args = [ parts[0], value ];

				this.triggerHandler("setData", true, args );

				ret = x$.data( this.elem, key, value );

				this.triggerHandler("changeData", true, args);

				return ret;
			}
		},

		removeData: function( key ) {
			return 	x$.removeData( this.elem, key );
		},

		hasData: function( selector ) {
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

	o.cache = {};

	o.noData = {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	};

	// A method for determining if a DOM node can handle the data expando
	o.acceptData = function( elem ) {
			if ( elem.nodeName ) {
				var match = x$.noData[ elem.nodeName.toLowerCase() ];

				if ( match ) {
					return !(match === true || elem.getAttribute("classid") !== match);
				}
			}

			return true;
		};

	o.isEmptyObject = function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	};

	o.data = function( elem, name, data, pvt /* internal use*/ ) {
		if ( !x$.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = x$.expando,
			getByName = typeof name === "string",

		// DOM nodes and JS objects handled separately because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// DOM nodes need the global x$ cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? x$.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ x$.expando ] : elem[ x$.expando ] && x$.expando,
		isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ x$.expando ] = id = ++x$.uuid;
			} else {
				id = x$.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};
		}

		// An object can be passed to x$.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = x$.extend( cache[ id ], name );
			} else {
				cache[ id ].data = x$.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// x$ data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ x$.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using x$.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ x$.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	};

	o.removeData = function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !x$.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = x$.expando,

			isNode = elem.nodeType,

			// See x$.data for more information
			cache = isNode ? x$.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ x$.expando ] : x$.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support space separated names
				if ( x$.isArray( name ) ) {
					name = name;
				} else if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces
					name = x$.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : x$.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See x$.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		// if ( jQuery.support.deleteExpando || !cache.setInterval ) {
		delete cache[ id ];
		// } else {
			// cache[ id ] = null;
		// }

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			// if ( x$.support.deleteExpando ) {
				delete elem[ x$.expando ];
			// } else if ( elem.removeAttribute ) {
				// elem.removeAttribute( x$.expando );
			// } else {
				// elem[ x$.expando ] = null;
			// }
		}
	};

	o.extend(o.fn, e);
}(x$));