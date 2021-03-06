// x$Lib JavaScript library v1.0.0
// (c) Thomas Nyongesa
// License:  MIT 

// ************************************************************************
// PROTOTYPE INHERITANCE FUNCTION
// ************************************************************************
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var f = function () {};
        f.prototype = o;
        return new f();
    };
}

// Object.prototype.extend = function(x) {
//   var ret = Object.create(this);

//   for(i in x) 
//     ret[i] = x[i];

//   return ret;
// };

(function(window) { 
	var document = window.document,
	readyBound = false,
	isReady = false,
	readyList = [],
	
	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,
	trim = String.prototype.trim,
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Used by x$.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// ************************************************************************
	// NODE TYPES ENUM
	// ************************************************************************
	Node = { 
			ELEMENT_NODE: 1,
			ATTRIBUTE_NODE: 2, 
			TEXT_NODE: 3,
			CDATA_SECTION_NODE: 4,
			ENTITY_REFERENCE_NODE: 5,
			ENTITY_NODE: 6,
			PROCESSING_INSTRUCTION_NODE: 7,
			COMMENT_NODE: 8,
			DOCUMENT_NODE: 9,
			DOCUMENT_TYPE_NODE: 10,
			DOCUMENT_FRAGMENT_NODE: 11,
			NOTATION_NODE: 12
			};
	
	// ************************************************************************
	// BASE WRAPPER CLASS CONSTRUCTOR FOR DOM ELEMENTS
	// ************************************************************************
	var f$ = function (o, context) {
		// ************************************************************************
		// SET THE VALUE OF THE UNDERLYING DOM ELEMENT
		// ************************************************************************
		this.elem = x$.resolveNode(o, context);
		x$.clearWhiteSpace(this.elem);
		return this;
	};

	f$.prototype = {
			constructor: f$,
			
			// ************************************************************************
			// GET/SET THE VALUE OF THE ATTRIBUTE ON UNDERLYING NODE
			// ************************************************************************
			attr: function ( tagName, value ) {
				var elem = this.elem;

				if( elem ) {
					if( elem.nodeType && elem.nodeType === Node.ELEMENT_NODE ) {
						if( value === undefined ) {
							return elem[ tagName ];
						} else {
							this.elem[tagName] = value;
						}
					}
					return this;
				}
			},

			// ************************************************************************
			// GET THE VALUE OF THE UNDERLYING NODE
			// ************************************************************************
			getNode: function () {
				return this.elem;
			},

			// ************************************************************************
			// SET THE VALUE OF THE UNDERLYING NODE
			// ************************************************************************
			setNode: function (elem) {
				this.elem = elem;
				return this;
			},

			// ************************************************************************
			// GET THE NAME OF THE UNDERLYING NODE
			// ************************************************************************
			getName: function () {
				var name = null;
				
				if (!this.elem.length) {
					name = this.elem.getAttribute("name");
				} else {
					if(this.elem.childNodes)
					{
						name = this.elem.getAttribute("name");
					} else {
						name = this.elem[0].getAttribute("name");
					}
				}
				return name;
			},

			// ************************************************************************
			// GET THE ID OF THE UNDERLYING NODE
			// ************************************************************************
			getId: function () {
				var name = null;
				
				if (!this.elem.length) {
					name = this.elem.getAttribute("id");
				} else {
					if(this.elem.childNodes)
					{
						name = this.elem.getAttribute("id");
					} else {
						name = this.elem[0].getAttribute("id");
					}
				}
				return name;
			},

			// ************************************************************************
			// SET THE NAME OF THE UNDERLYING NODE
			// ************************************************************************
			setName: function (val) {
				var name = null;
				
				if (!this.elem.length) {
					this.elem.setAttribute("name", val);
				} else {
					if(this.elem.childNodes)
					{
						this.elem.setAttribute("name", val);
					} else {
						for(i in this.elem) {
							this.elem[i].setAttribute("name", val);
						}
					}
				}
				return this;
			},

			// ************************************************************************
			// CONVERT DOM NODE TO ITS STRING EQUIVALENT
			// ************************************************************************
			getStr: function () { 
				var node = null;
				
				// ************************************************************************
				// HTML ELEMENT NODE TYPE
				// ************************************************************************
				if (this.elem && this.elem.nodeType === Node.ELEMENT_NODE) {
					node = this.elem;
				}

				// ************************************************************************
				// XML DOCUMENT NODE TYPE
				// ************************************************************************
				if (this.elem && this.elem.nodeType === Node.DOCUMENT_NODE) {
					node = this.elem.documentElement;
				}
				return (!window.ActiveXObject && node && (new XMLSerializer()).serializeToString(node)) 
				|| node && (node.xml || node.outerHTML) || null;
			},
			
			// ************************************************************************
			// UNWRAP A PARENT NODE FROM ITS CHILD NODES AND RETURN THE STRING OF THE
			// RESULTANT NODE
			// ************************************************************************
			unwrapStr: function () {
				var str = null, node = null;
				
				// ************************************************************************
				// HTML ELEMENT NODE TYPE
				// ************************************************************************
				if (this.elem && this.elem.nodeType === Node.ELEMENT_NODE) {
					node = this.elem.firstChild || null;
				}
				
				// ************************************************************************
				// XML DOCUMENT NODE TYPE
				// ************************************************************************
				if (this.elem && this.elem.nodeType === Node.DOCUMENT_NODE) {
					node = this.elem.documentElement.firstChild || null;
				}
				curNode = node;
				while(curNode) {
					str = str && (str + x$(curNode).getStr()) || x$(curNode).getStr();
					curNode = curNode.nextSibling;
				}
				return str;
			},
			
			// ************************************************************************
			// APPEND A NODE BEFORE THE UNDERLYING NODE FOR THIS OBJECT
			// ************************************************************************
			appendBefore: function (node) {
				if( node ) {
					if(this.elem && this.elem.parentNode) {
						this.elem.parentNode.insertBefore(node, this.elem);
					}
				}
				return this;
			},

			// ************************************************************************
			// APPEND A NODE AT THE BEGINNING OF THE UNDERLYING NODE FOR THIS OBJECT
			// ************************************************************************
			insertFirst: function (node) {
				if( node ) {
					if(this.elem && this.elem !== node) {
						this.elem.insertBefore(node, this.elem.firstChild);
					}
				}
				return this;
			},

			// ************************************************************************
			// APPEND A NODE AT THE END OF THE UNDERLYING NODE FOR THIS OBJECT
			// ************************************************************************
			insertLast: function (node){
				if( node ) {
					if(this.elem && this.elem !== node) {
						this.elem.appendChild(node);
					}
				}
				return this;
			},

			// ************************************************************************
			// APPEND A NODE AFTER THE DOM ELEMENT THAT CONTAINS THIS OBJECT
			// ************************************************************************
			appendAfter: function (node){
				if( node ) {
					if(this.elem && this.elem.parentNode){
						if(this.elem.nextSibling) {
							this.elem.parentNode.insertBefore(node, this.elem.nextSibling);
						} else {
							this.elem.parentNode.appendChild(node);
						}
					}
				}
				return this;
			},
			
			// ************************************************************************
			// REMOVE THE NODE FROM THE UNDERLYING NODE THIS OBJECT
			// ************************************************************************
			removeNode: function(node) {
				if( node ) {
					if(this.elem){
						if(node.removeNode){
							node.removeNode(true);
						} else
						if(this.elem.removeChild){
							this.elem.removeChild(node);
						}
					}
				}
				return this;
			},
			
			// ************************************************************************
			// REMOVE THE UNDERLYING NODE FOR THIS OBJECT
			// ************************************************************************
			remove: function() {
				if(this.elem){
					if(this.elem.removeNode && this.elem.parentNode){
						this.elem.removeNode(true);
					} else
					if(this.elem.removeChild && this.elem.parentNode){
						this.elem.parentNode.removeChild(this.elem);
					}
				}
				return this;
			},

			// ************************************************************************
			// BIND AN EVENT TO A HANDLER
			// ************************************************************************
			bind: function( type, handler ) {
				if( this.elem ) {
					x$.bind( this.elem, type, handler );
				}
			},

			// ************************************************************************
			// TRIGGER AN EVENT HANDLER
			// ************************************************************************
			triggerHandler: function( type, async, args ) {
				x$.triggerHandler( this.elem, type, async, args )
			},

			// ************************************************************************
			// REMOVE AN EVENT HANDLER
			// ************************************************************************
			unbindHandler: function( type, handler ) {
				x$.unbindHandler( this.elem, type, handler );
			},

			// ************************************************************************
			// REMOVE AN EVENT TYPE
			// ************************************************************************
			unbindType: function( type ) {
				if( this.elem ) {
					x$.unbindType( this.elem, type );
				}
			},

			// ************************************************************************
			// REPLACE THE toString() FUNCTION OF THE PARENT OBJECT
			// ************************************************************************
			toString: function( ) { 
				var str = "{";
				for( x in this ) {
					str += "(" + typeof this[x]+")" + x + ":" + this[x] + ",";
				};
				str = str.replace( /,$/,"" ) + "}";
				return str;
			},
			
			// ************************************************************************
			// EACH FUNCTION - INSPIRED BY jQuery's each
			// ************************************************************************
			each: function ( callback, childNodes ) {
				return x$.each( this.elem, callback, childNodes );
			},

			// ************************************************************************
			// HIDE THE ELEMENT(S)
			// ************************************************************************
			hide: function(){
				this.each(function(index, value){
					if(this.style)
						this.style.cssText += "visibility:none";
				});
				return this;
			},

			// ************************************************************************
			// SHOW THE ELEMENT(S)
			// ************************************************************************
			show: function(visibility){
				if(this.elem && this.elem.style)
					this.elem.style.visibility = visibility;
				
				return this;
			},
	};

	// ************************************************************************
	//  SPINNER
	// ************************************************************************
	/**
	 * Copyright (c) 2011-2014 Felix Gnass
	 * Licensed under the MIT license
	 */
	(function(root, factory) {

	  /* CommonJS */
	  if (typeof exports == 'object')  module.exports = factory()

	  /* AMD module */
	  else if (typeof define == 'function' && define.amd) define(factory)

	  /* Browser global */
	  else root.Spinner = factory()
	}
	(this, function() {
	  "use strict";

	  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
	    , animations = {} /* Animation rules keyed by their name */
	    , useCssAnimations /* Whether to use CSS animations or setTimeout */

	  /**
	   * Utility function to create elements. If no tag name is given,
	   * a DIV is created. Optionally properties can be passed.
	   */
	  function createEl(tag, prop) {
	    var el = document.createElement(tag || 'div')
	      , n

	    for(n in prop) el[n] = prop[n]
	    return el
	  }

	  /**
	   * Appends children and returns the parent.
	   */
	  function ins(parent /* child1, child2, ...*/) {
	    for (var i=1, n=arguments.length; i<n; i++)
	      parent.appendChild(arguments[i])

	    return parent
	  }

	  /**
	   * Insert a new stylesheet to hold the @keyframe or VML rules.
	   */
	  var sheet = (function() {
	    var el = createEl('style', {type : 'text/css'})
	    ins(document.getElementsByTagName('head')[0], el)
	    return el.sheet || el.styleSheet
	  }())

	  /**
	   * Creates an opacity keyframe animation rule and returns its name.
	   * Since most mobile Webkits have timing issues with animation-delay,
	   * we create separate rules for each line/segment.
	   */
	  function addAnimation(alpha, trail, i, lines) {
	    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
	      , start = 0.01 + i/lines * 100
	      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
	      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
	      , pre = prefix && '-' + prefix + '-' || ''

	    if (!animations[name]) {
	      sheet.insertRule(
	        '@' + pre + 'keyframes ' + name + '{' +
	        '0%{opacity:' + z + '}' +
	        start + '%{opacity:' + alpha + '}' +
	        (start+0.01) + '%{opacity:1}' +
	        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
	        '100%{opacity:' + z + '}' +
	        '}', sheet.cssRules.length)

	      animations[name] = 1
	    }

	    return name
	  }

	  /**
	   * Tries various vendor prefixes and returns the first supported property.
	   */
	  function vendor(el, prop) {
	    var s = el.style
	      , pp
	      , i

	    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
	    for(i=0; i<prefixes.length; i++) {
	      pp = prefixes[i]+prop
	      if(s[pp] !== undefined) return pp
	    }
	    if(s[prop] !== undefined) return prop
	  }

	  /**
	   * Sets multiple style properties at once.
	   */
	  function css(el, prop) {
	    for (var n in prop)
	      el.style[vendor(el, n)||n] = prop[n]

	    return el
	  }

	  /**
	   * Fills in default values.
	   */
	  function merge(obj) {
	    for (var i=1; i < arguments.length; i++) {
	      var def = arguments[i]
	      for (var n in def)
	        if (obj[n] === undefined) obj[n] = def[n]
	    }
	    return obj
	  }

	  /**
	   * Returns the absolute page-offset of the given element.
	   */
	  function pos(el) {
	    var o = { x:el.offsetLeft, y:el.offsetTop }
	    while((el = el.offsetParent))
	      o.x+=el.offsetLeft, o.y+=el.offsetTop

	    return o
	  }

	  /**
	   * Returns the line color from the given string or array.
	   */
	  function getColor(color, idx) {
	    return typeof color == 'string' ? color : color[idx % color.length]
	  }

	  // Built-in defaults

	  var defaults = {
	    lines: 12,            // The number of lines to draw
	    length: 7,            // The length of each line
	    width: 5,             // The line thickness
	    radius: 10,           // The radius of the inner circle
	    rotate: 0,            // Rotation offset
	    corners: 1,           // Roundness (0..1)
	    color: '#000',        // #rgb or #rrggbb
	    direction: 1,         // 1: clockwise, -1: counterclockwise
	    speed: 1,             // Rounds per second
	    trail: 100,           // Afterglow percentage
	    opacity: 1/4,         // Opacity of the lines
	    fps: 20,              // Frames per second when using setTimeout()
	    zIndex: 2e9,          // Use a high z-index by default
	    className: 'spinner', // CSS class to assign to the element
	    top: '50%',           // center vertically
	    left: '50%',          // center horizontally
	    position: 'absolute'  // element position
	  }

	  /** The constructor */
	  function Spinner(o) {
	    this.opts = merge(o || {}, Spinner.defaults, defaults)
	  }

	  // Global defaults that override the built-ins:
	  Spinner.defaults = {}

	  merge(Spinner.prototype, {

	    /**
	     * Adds the spinner to the given target element. If this instance is already
	     * spinning, it is automatically removed from its previous target b calling
	     * stop() internally.
	     */
	    spin: function(target) {
	      this.stop()

	      var self = this
	        , o = self.opts
	        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
	        , mid = o.radius+o.length+o.width

	      css(el, {
	        left: o.left,
	        top: o.top
	      })
	        
	      if (target) {
	        target.insertBefore(el, target.firstChild||null)
	      }

	      el.setAttribute('role', 'progressbar')
	      self.lines(el, self.opts)

	      if (!useCssAnimations) {
	        // No CSS animation support, use setTimeout() instead
	        var i = 0
	          , start = (o.lines - 1) * (1 - o.direction) / 2
	          , alpha
	          , fps = o.fps
	          , f = fps/o.speed
	          , ostep = (1-o.opacity) / (f*o.trail / 100)
	          , astep = f/o.lines

	        ;(function anim() {
	          i++;
	          for (var j = 0; j < o.lines; j++) {
	            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

	            self.opacity(el, j * o.direction + start, alpha, o)
	          }
	          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
	        })()
	      }
	      return self
	    },

	    /**
	     * Stops and removes the Spinner.
	     */
	    stop: function() {
	      var el = this.el
	      if (el) {
	        clearTimeout(this.timeout)
	        if (el.parentNode) el.parentNode.removeChild(el)
	        this.el = undefined
	      }
	      return this
	    },

	    /**
	     * Internal method that draws the individual lines. Will be overwritten
	     * in VML fallback mode below.
	     */
	    lines: function(el, o) {
	      var i = 0
	        , start = (o.lines - 1) * (1 - o.direction) / 2
	        , seg

	      function fill(color, shadow) {
	        return css(createEl(), {
	          position: 'absolute',
	          width: (o.length+o.width) + 'px',
	          height: o.width + 'px',
	          background: color,
	          boxShadow: shadow,
	          transformOrigin: 'left',
	          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
	          borderRadius: (o.corners * o.width>>1) + 'px'
	        })
	      }

	      for (; i < o.lines; i++) {
	        seg = css(createEl(), {
	          position: 'absolute',
	          top: 1+~(o.width/2) + 'px',
	          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
	          opacity: o.opacity,
	          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
	        })

	        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
	        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
	      }
	      return el
	    },

	    /**
	     * Internal method that adjusts the opacity of a single line.
	     * Will be overwritten in VML fallback mode below.
	     */
	    opacity: function(el, i, val) {
	      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
	    }

	  })


	  function initVML() {

	    /* Utility function to create a VML tag */
	    function vml(tag, attr) {
	      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
	    }

	    // No CSS transforms but VML support, add a CSS rule for VML elements:
	    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

	    Spinner.prototype.lines = function(el, o) {
	      var r = o.length+o.width
	        , s = 2*r

	      function grp() {
	        return css(
	          vml('group', {
	            coordsize: s + ' ' + s,
	            coordorigin: -r + ' ' + -r
	          }),
	          { width: s, height: s }
	        )
	      }

	      var margin = -(o.width+o.length)*2 + 'px'
	        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
	        , i

	      function seg(i, dx, filter) {
	        ins(g,
	          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
	            ins(css(vml('roundrect', {arcsize: o.corners}), {
	                width: r,
	                height: o.width,
	                left: o.radius,
	                top: -o.width>>1,
	                filter: filter
	              }),
	              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
	              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
	            )
	          )
	        )
	      }

	      if (o.shadow)
	        for (i = 1; i <= o.lines; i++)
	          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

	      for (i = 1; i <= o.lines; i++) seg(i)
	      return ins(el, g)
	    }

	    Spinner.prototype.opacity = function(el, i, val, o) {
	      var c = el.firstChild
	      o = o.shadow && o.lines || 0
	      if (c && i+o < c.childNodes.length) {
	        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
	        if (c) c.opacity = val
	      }
	    }
	  }

	  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

	  if (!vendor(probe, 'transform') && probe.adj) initVML()
	  else useCssAnimations = vendor(probe, 'animation')

	  return Spinner

	}));

	// ************************************************************************
	// THE x$ CLASS ALLOWS ACCESS TO THE f$ WITH CONVENIENT x$() SYNTAX
	// ************************************************************************
	var x$ = function (o, context) {
		return new f$(o, context);
	};

	// ************************************************************************
	// CREATE A NODE OF TYPE tagName
	// ************************************************************************
	x$.createElement = function(tagName, doc) {

		var lm = (doc.nodeName && doc.nodeName === "#document")?doc.createElement(tagName):document.createElement(tagName);

		return lm;
	}

	// ************************************************************************
	// BIND AN EVENT OF TYPE type TO A HANDLER handler
	// ************************************************************************
	x$.bind = function( elem, type, handler ) {

		addEvent( elem, type, handler );
	};

	// ************************************************************************
	//  GENERATE A RANDOM STRING
	// ************************************************************************
	x$.randomString = function ( length, chars ) {
			
		var result = '';

		for ( var i = length; i > 0; --i ) 
			result += chars[ Math.round(Math.random() * (chars.length - 1)) ];
		
		return result;
	};

	
	// ************************************************************************
	//  SPINNER
	// ************************************************************************
	x$.Spinner = Spinner;
	
	// ************************************************************************
	// TRIGGER AN EVENT HANDLER OF TYPE type
	// ************************************************************************
	x$.triggerHandler = function( elem, type, async, args ) {

		if ( async ) {

			setTimeout( function() { triggerEvent.call( elem, type, args ); }, 0 )
		} else {

			triggerEvent.call( elem, type, args );
		}
	};

	// ************************************************************************
	// UNBIND AN EVENT HANDLER handler
	// ************************************************************************
	x$.unbindHandler = function( elem, type, handler ) {

		removeHandler( elem, type, handler );
	};

	// ************************************************************************
	// REMOVE WHITESPACE CHILD NODES FROM THE GIVEN NODE
	// ************************************************************************
	x$.clearWhiteSpace = function ( node ) {
		var curNode = node && node.firstChild;
		
		while (curNode) {
			var nextSibling = curNode.nextSibling;
			if ( curNode.nodeType === Node.TEXT_NODE && !/\S/.test(curNode.nodeValue) ) {
				node.removeChild(curNode);
			}
			if ( curNode.nodeType === Node.ELEMENT_NODE ) {
				x$.clearWhiteSpace( curNode );
			}
			curNode = nextSibling;
		}
		return node;
	};

	// ************************************************************************
	// FIND AND RETURN DOM ELEMENT FROM THE GIVEN PARAMETER
	// ************************************************************************
	x$.resolveNode = function ( expr, context, isXML ) {

		if( expr && typeof expr !== "string" ) {
			return expr;
		}
		
		var result = x$.find( expr, context, isXML );
		
		if( result.length <= 1 ) {
			return result[ 0 ];
		} else {
			return result;
		}
	};
	
	// ************************************************************************
	// CONVERT STRING TO TITLE CASE
	// ************************************************************************
	x$.titleCase = function toTitleCase( str )
	{
	    return str.replace( /\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();} );
	};
	
	// ************************************************************************
	// STATIC EACH FUNCTION - INSPIRED BY jQuery's each
	// ************************************************************************
	x$.each = function (lm, callback, childNodes) {
		var object = lm, name, i = 0;
		var	length = object ? object.length : undefined,
			isObj = length === undefined || typeof object === 'function';

		if (isObj) {
			for (name in object) {
				if (callback.call(object[name], name, object[name]) === false) {
					break;
				}
				if(childNodes){
					if(object[name].childNodes)
						x$.each(object[name].childNodes, callback, childNodes);
				}
			}
		} else {
			for (; i < length;) {
				var result = callback.call(object[i], i, object[i++]);
				
				if (result === false) {
					break;
				}
				
				if(childNodes){
					if(object[i-1].childNodes)
						x$.each(object[i-1].childNodes, callback, childNodes);
				}

				// this permits a change in the increment/step of the loop
				if (typeof result  === 'object') {
					i += result.inc;
				}
			}
		}
		return object;
	};
	
	// ************************************************************************
	// GET FILE SIZE
	// ************************************************************************
	x$.fileSize = function ( fNode ) {

		var size;

		if( typeof FileReader !== "undefined" ) {
			
			size = fNode.files[ 0 ].size;

			return size; 
		}

		if( ActiveXObject ) {

			var fso = new ActiveXObject( "Scripting.FileSystemObject" ),
				fp = fNode.value,
	    			thefile = fso.getFile( fp );
	     		
	     		size = thefile.size;

	     		return size;
	     	} 		
	};

	// ************************************************************************
	// PRE-LOAD IMAGE
	// ************************************************************************
	x$.preLoadImage = function ( url ) {

		var img = new Image( );

		img.src = url;

		var x = 1;
	};

	// ************************************************************************
	// TEST FOR ARRAY
	// ************************************************************************
	x$.isArray = function ( o ) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};

	// ************************************************************************
	// TEST FOR OBJECT
	// ************************************************************************
	x$.isObject = function ( o ) {
		return o.length === undefined || typeof o === 'function';
	};

	// ************************************************************************
	// TEST FOR EMPTYOBJECT
	// ************************************************************************
	x$.isEmpty = function ( obj ) {

	    // null and undefined are "empty"
	    if ( obj == null ) return true;

	    // Assume if it has a length property with a non-zero value
	    // that that property is correct.
	    if ( obj.length > 0 )    return false;
	    if ( obj.length === 0 )  return true;

	    // Otherwise, does it have any properties of its own?
	    // Note that this doesn't handle
	    // toString and valueOf enumeration bugs in IE < 9
	    for ( var key in obj ) {

	        if ( Object.prototype.hasOwnProperty.call(obj, key) ) return false;
	    }

	    return true;
	};

	// ************************************************************************
	// EXTEND FUNCTION. THIS FUNCTION WILL OVERWRITE EXISTING PROTOTYPE MEMBERS
	// ************************************************************************
	x$.extend = function (o, x) {
		if(o && x && typeof o === "object" && (typeof o === typeof x || typeof x === "function") ){
			for(i in x) {
				o[i] = x[i];
			}
		}
		return o;
	};

	// ************************************************************************
	// CLONE OBJECT USING QUICK AND DIRTY JSON.parse AND JSON.stringify
	// ************************************************************************
	x$.clone = function ( o ) {
		return JSON.parse( JSON.stringify(o) );
	};
	
	// ************************************************************************
	// EXPOSE THE f$.prototype TO FACILITATE EXTENSIBILITY
	// ************************************************************************
	x$.fn = f$.prototype;

	// ************************************************************************
	// CURRENT VERSION OF x$
	// ************************************************************************
	x$.version = "1.0.0";

	// ************************************************************************
	// CACHE
	// ************************************************************************
	x$.cache = {};

	x$.uuid = 0;

	x$.expando = "x$" + ( x$.version + Math.random() ).replace( /\D/g, "" );

	// Convert dashed to camelCase; presently used by the data module
	x$.camelCase = function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	};

	// ************************************************************************
	// TRIM A STRING - USES EXISTING FUNCTIONALITY IF IT EXISTS
	// ************************************************************************
	x$.trim =  trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		};

	// ************************************************************************
	// MAP FUNCTION - MAP A FUNCTION TO A CONTAINER(ARRAY, OBJECT)
	// ************************************************************************
	x$.map = function ( obj, func ) {
		var result = x$.isArray(obj) ? new Array():
			{};

		x$.each( obj, function( iter, value ) {
			result[ iter ] = func( value );
		}, false );

		return result;
	};

	// ************************************************************************
	// FILTER FUNCTION - FILTER A CONTAINER(ARRAY...) ACCORDING TO A FUNCTION
	// ************************************************************************
	x$.filter = function ( obj, func ) {
		// This function currently only works for arrays.  
		var result = x$.isArray( obj ) ? obj.slice( 0 ):
			x$.clone( obj ),
			idx = 0;

		x$.each( obj, function( iter, value ) {
			if ( x$.isArray(obj) ) { //}
				var val = func( value );

				if ( ! val ) {
					result.splice( idx, 1 );
				} else {
					idx += 1;
				}
			} else {
				var val = func( value );

				if ( ! val ) {
					delete result[ iter ];
				}
			}
		}, false );

		return result;
	};

	// ************************************************************************
	// ANIMATE FUNCTION - TAKES {delay, duration, delta, step} AS opts
	// ************************************************************************
	x$.animate = function ( opts ) {
   
  		var start = new Date() ,
  			id = setInterval( function() {

		    		var timePassed = new Date - start,
		    			progress = timePassed / opts.duration;
		 
		    		if ( progress > 1 ) progress = 1;
		     
		    		var delta = opts.delta( progress );
					
		    		opts.step( delta );
		     
		    		if ( progress == 1 ) {

		      			clearInterval( id );
		    		}
	  		}, opts.delay || 10 );
	};

	// **********************************************************************************************
	// A Ready function for DOMContentLoaded 
	// **********************************************************************************************
	x$.ready = function( fn, dc ) {
		/*!
		* Lifted from Diego Perini's contentloaded.js
		*
		*/

		// @win window reference
		// @fn function reference
		function contentLoaded( win, fn ) {

			var done = false, top = true,

			doc = dc || win.document, root = doc.documentElement,

			add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
			rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
			pre = doc.addEventListener ? '' : 'on',

			init = function ( e ) {

				if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
				
				(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
				
				if (!done && (done = true)) fn.call(win, e.type || e);
			},

			poll = function( ) {

				try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
					init('poll');
			};

			if (doc.readyState == 'complete') fn.call(win, 'lazy');
			else {
			
				if (doc.createEventObject && root.doScroll) {
					
					try { top = !win.frameElement; } catch(e) { }
					if (top) poll();
				}
		
				doc[add](pre + 'DOMContentLoaded', init, false);
				doc[add](pre + 'readystatechange', init, false);
				win[add](pre + 'load', init, false);
			}
		}

		contentLoaded( window, fn );
	};

	var isEventSupported = ( function ( ) {

	    var TAGNAMES = {
	    	'select':'input','change':'input',
	      	'submit':'form','reset':'form',
	      	'error':'img','load':'img','abort':'img'
	    }

	    function isEventSupported( eventName ) {

	      	var elem = document.createElement(TAGNAMES[eventName] || 'div');
	      	eventName = 'on' + eventName;
	      	var isSupported = ( eventName in elem );
	      
	      	if ( ! isSupported ) {

	        elem.setAttribute( eventName, 'return;' );

	        isSupported = typeof elem[eventName] == 'function';
	      }

	      elem = null;

	      return isSupported;
	    }

	    return isEventSupported;
	  } )( );

	// borrowed heavily from Dean Edward's addEvent function.  A beauty.
	function addEvent( element, type, handler ) {

		if( isEventSupported (type) ) {
	
		  	if ( document.addEventListener ) {

		  		// Add event listener - event bubbling is the default behavior
		  		element.addEventListener( type, handler, false );
		  	}

		  	if ( document.attachEvent ) {

		  		type = "on" + type

		      	// Because the attachEvent uses the window object to add the event and we don't want to polute it.
		      	var boundedHandler = function() {

		        	return handler.apply( element, arguments );
		      	};
		      
		      	element.attachEvent( type, boundedHandler );
		  	}
		}

		handler.$$guid = handler.$$guid || ++x$.uuid;
		element.events = element.events || {};
		handlers = element.events[ type ] || ( element.events[ type ] = {} );

	  	// store the event handler in the hash table
	  	handlers[ handler.$$guid ] = handler;
	};

	function removeHandler( element, type, handler ) {
	  
		if( isEventSupported (type) ) {
	
		  	if ( document.addEventListener ) {

			  	if ( element.events && element.events[ type ] ) {

			   		element.removeEventListener( type, element.events[ type ][ handler.$$guid ], false );
	   				
	   				delete element.events[ type ][ handler.$$guid ];
			  	}
		  	}

		  	if ( document.attachEvent ) {

		      	type = "on" + type;
		      	
			  	if ( element.events && element.events[ type ] ) {

			      	element.detachEvent( type, element.events[ type ][ handler.$$guid ] );
			    }
		  	}
		} 
		 
	  	// delete the event handler from the hash table - for custom event types
	  	if ( element.events && element.events[ type ] ) {

	   		delete element.events[ type ][ handler.$$guid ];
	  	}
	};

	function triggerEvent( type, args ) {

	  	var returnValue = true;
	  
	  	// get a reference to the hash table of event handlers
		var handlers = this.events ? this.events[ type ] : {};
	  
	  	// assemble the arguments
	  	var args = [type, args];
	  
	  	// execute each event handler
	  	for ( var i in handlers ) {
	  
		    	this.$$handleEvent = handlers[ i ];
		  
		    	if ( this.$$handleEvent.call( this, args ) === false ) {
		  
		      		return returnValue = false;
		    	}
	  	}

	  	return returnValue;
	};

	// ************************************************************************
	// INCLUDE SIZZLE FUNCTIONALITY
	// ************************************************************************
	/*
	 * ! Sizzle CSS Selector Engine Copyright 2011, The Dojo Foundation Released
	 * under the MIT, BSD, and GPL Licenses. More information:
	 * http://sizzlejs.com/
	 */
	(function(){

	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
		expando = "sizcache" + (Math.random() + '').replace('.', ''),
		done = 0,
		toString = Object.prototype.toString,
		hasDuplicate = false,
		baseHasDuplicate = true,
		rBackslash = /\\/g,
		rReturn = /\r\n/g,
		rNonWord = /\W/;

	// Here we check if the JavaScript engine is using some sort of
	// optimization where it does not always call our comparision
	// function. If that is the case, discard the hasDuplicate value.
	// Thus far that includes Google Chrome.
	[0, 0].sort(function() {
		baseHasDuplicate = false;
		return 0;
	});

	var Sizzle = function( selector, context, results, seed ) {
		results = results || [];
		context = context || document;

		var origContext = context;

		if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
			return [];
		}

		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		var m, set, checkSet, extra, ret, cur, pop, i,
			prune = true,
			contextXML = Sizzle.isXML( context ),
			parts = [],
			soFar = selector;

		// Reset the position of the chunker regexp (start from head)
		do {
			chunker.exec( "" );
			m = chunker.exec( soFar );

			if ( m ) {
				soFar = m[3];

				parts.push( m[1] );

				if ( m[2] ) {
					extra = m[3];
					break;
				}
			}
		} while ( m );

		if ( parts.length > 1 && origPOS.exec( selector ) ) {

			if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
				set = posProcess( parts[0] + parts[1], context, seed );

			} else {
				set = Expr.relative[ parts[0] ] ?
					[ context ] :
					Sizzle( parts.shift(), context );

				while ( parts.length ) {
					selector = parts.shift();

					if ( Expr.relative[ selector ] ) {
						selector += parts.shift();
					}

					set = posProcess( selector, set, seed );
				}
			}

		} else {
			// Take a shortcut and set the context if the root selector is an ID
			// (but not if it'll be faster if the inner selector is an ID)
			if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
					Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

				ret = Sizzle.find( parts.shift(), context, contextXML );
				context = ret.expr ?
					Sizzle.filter( ret.expr, ret.set )[0] :
					ret.set[0];
			}

			if ( context ) {
				ret = seed ?
					{ expr: parts.pop(), set: makeArray(seed) } :
					Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

				set = ret.expr ?
					Sizzle.filter( ret.expr, ret.set ) :
					ret.set;

				if ( parts.length > 0 ) {
					checkSet = makeArray( set );

				} else {
					prune = false;
				}

				while ( parts.length ) {
					cur = parts.pop();
					pop = cur;

					if ( !Expr.relative[ cur ] ) {
						cur = "";
					} else {
						pop = parts.pop();
					}

					if ( pop == null ) {
						pop = context;
					}

					Expr.relative[ cur ]( checkSet, pop, contextXML );
				}

			} else {
				checkSet = parts = [];
			}
		}

		if ( !checkSet ) {
			checkSet = set;
		}

		if ( !checkSet ) {
			Sizzle.error( cur || selector );
		}

		if ( toString.call(checkSet) === "[object Array]" ) {
			if ( !prune ) {
				results.push.apply( results, checkSet );

			} else if ( context && context.nodeType === 1 ) {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
						results.push( set[i] );
					}
				}

			} else {
				for ( i = 0; checkSet[i] != null; i++ ) {
					if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
						results.push( set[i] );
					}
				}
			}

		} else {
			makeArray( checkSet, results );
		}

		if ( extra ) {
			Sizzle( extra, origContext, results, seed );
			Sizzle.uniqueSort( results );
		}

		return results;
	};

	Sizzle.uniqueSort = function( results ) {
		if ( sortOrder ) {
			hasDuplicate = baseHasDuplicate;
			results.sort( sortOrder );

			if ( hasDuplicate ) {
				for ( var i = 1; i < results.length; i++ ) {
					if ( results[i] === results[ i - 1 ] ) {
						results.splice( i--, 1 );
					}
				}
			}
		}

		return results;
	};

	Sizzle.matches = function( expr, set ) {
		return Sizzle( expr, null, null, set );
	};

	Sizzle.matchesSelector = function( node, expr ) {
		return Sizzle( expr, null, null, [node] ).length > 0;
	};

	Sizzle.find = function( expr, context, isXML ) {
		var set, i, len, match, type, left;

		if ( !expr ) {
			return [];
		}

		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];

			if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
				left = match[1];
				match.splice( 1, 1 );

				if ( left.substr( left.length - 1 ) !== "\\" ) {
					match[1] = (match[1] || "").replace( rBackslash, "" );
					set = Expr.find[ type ]( match, context, isXML );

					if ( set != null ) {
						expr = expr.replace( Expr.match[ type ], "" );
						break;
					}
				}
			}
		}

		if ( !set ) {
			set = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( "*" ) :
				[];
		}

		return { set: set, expr: expr };
	};

	Sizzle.filter = function( expr, set, inplace, not ) {
		var match, anyFound,
			type, found, item, filter, left,
			i, pass,
			old = expr,
			result = [],
			curLoop = set,
			isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

		while ( expr && set.length ) {
			for ( type in Expr.filter ) {
				if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
					filter = Expr.filter[ type ];
					left = match[1];

					anyFound = false;

					match.splice(1,1);

					if ( left.substr( left.length - 1 ) === "\\" ) {
						continue;
					}

					if ( curLoop === result ) {
						result = [];
					}

					if ( Expr.preFilter[ type ] ) {
						match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

						if ( !match ) {
							anyFound = found = true;

						} else if ( match === true ) {
							continue;
						}
					}

					if ( match ) {
						for ( i = 0; (item = curLoop[i]) != null; i++ ) {
							if ( item ) {
								found = filter( item, match, i, curLoop );
								pass = not ^ found;

								if ( inplace && found != null ) {
									if ( pass ) {
										anyFound = true;

									} else {
										curLoop[i] = false;
									}

								} else if ( pass ) {
									result.push( item );
									anyFound = true;
								}
							}
						}
					}

					if ( found !== undefined ) {
						if ( !inplace ) {
							curLoop = result;
						}

						expr = expr.replace( Expr.match[ type ], "" );

						if ( !anyFound ) {
							return [];
						}

						break;
					}
				}
			}

			// Improper expression
			if ( expr === old ) {
				if ( anyFound == null ) {
					Sizzle.error( expr );

				} else {
					break;
				}
			}

			old = expr;
		}

		return curLoop;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Utility function for retreiving the text value of an array of DOM nodes
	 * 
	 * @param {Array|Element}
	 *            elem
	 */
	var getText = Sizzle.getText = function( elem ) {
	    var i, node,
			nodeType = elem.nodeType,
			ret = "";

		if ( nodeType ) {
			if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
				// Use textContent || innerText for elements
				if ( typeof elem.textContent === 'string' ) {
					return elem.textContent;
				} else if ( typeof elem.innerText === 'string' ) {
					// Replace IE's carriage returns
					return elem.innerText.replace( rReturn, '' );
				} else {
					// Traverse it's children
					for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText( elem );
					}
				}
			} else if ( nodeType === 3 || nodeType === 4 ) {
				return elem.nodeValue;
			}
		} else {

			// If no nodeType, this is expected to be an array
			for ( i = 0; (node = elem[i]); i++ ) {
				// Do not traverse comment nodes
				if ( node.nodeType !== 8 ) {
					ret += getText( node );
				}
			}
		}
		return ret;
	};

	var Expr = Sizzle.selectors = {
		order: [ "ID", "NAME", "TAG" ],

		match: {
			ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
			TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},

		leftMatch: {},

		attrMap: {
			"class": "className",
			"for": "htmlFor"
		},

		attrHandle: {
			href: function( elem ) {
				return elem.getAttribute( "href" );
			},
			type: function( elem ) {
				return elem.getAttribute( "type" );
			}
		},

		relative: {
			"+": function(checkSet, part){
				var isPartStr = typeof part === "string",
					isTag = isPartStr && !rNonWord.test( part ),
					isPartStrNotTag = isPartStr && !isTag;

				if ( isTag ) {
					part = part.toLowerCase();
				}

				for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
					if ( (elem = checkSet[i]) ) {
						while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

						checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
							elem || false :
							elem === part;
					}
				}

				if ( isPartStrNotTag ) {
					Sizzle.filter( part, checkSet, true );
				}
			},

			">": function( checkSet, part ) {
				var elem,
					isPartStr = typeof part === "string",
					i = 0,
					l = checkSet.length;

				if ( isPartStr && !rNonWord.test( part ) ) {
					part = part.toLowerCase();

					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
						}
					}

				} else {
					for ( ; i < l; i++ ) {
						elem = checkSet[i];

						if ( elem ) {
							checkSet[i] = isPartStr ?
								elem.parentNode :
								elem.parentNode === part;
						}
					}

					if ( isPartStr ) {
						Sizzle.filter( part, checkSet, true );
					}
				}
			},

			"": function(checkSet, part, isXML){
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
			},

			"~": function( checkSet, part, isXML ) {
				var nodeCheck,
					doneName = done++,
					checkFn = dirCheck;

				if ( typeof part === "string" && !rNonWord.test( part ) ) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
			}
		},

		find: {
			ID: function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			},

			NAME: function( match, context ) {
				if ( typeof context.getElementsByName !== "undefined" ) {
					var ret = [],
						results = context.getElementsByName( match[1] );

					for ( var i = 0, l = results.length; i < l; i++ ) {
						if ( results[i].getAttribute("name") === match[1] ) {
							ret.push( results[i] );
						}
					}

					return ret.length === 0 ? null : ret;
				}
			},

			TAG: function( match, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( match[1] );
				}
			}
		},
		preFilter: {
			CLASS: function( match, curLoop, inplace, result, not, isXML ) {
				match = " " + match[1].replace( rBackslash, "" ) + " ";

				if ( isXML ) {
					return match;
				}

				for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
					if ( elem ) {
						if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
							if ( !inplace ) {
								result.push( elem );
							}

						} else if ( inplace ) {
							curLoop[i] = false;
						}
					}
				}

				return false;
			},

			ID: function( match ) {
				return match[1].replace( rBackslash, "" );
			},

			TAG: function( match, curLoop ) {
				return match[1].replace( rBackslash, "" ).toLowerCase();
			},

			CHILD: function( match ) {
				if ( match[1] === "nth" ) {
					if ( !match[2] ) {
						Sizzle.error( match[0] );
					}

					match[2] = match[2].replace(/^\+|\s*/g, '');

					// parse equations like 'even', 'odd', '5', '2n', '3n+2',
					// '4n-1', '-n+6'
					var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
						match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
						!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

					// calculate the numbers (first)n+(last) including if they
					// are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}
				else if ( match[2] ) {
					Sizzle.error( match[0] );
				}

				// TODO: Move to normal caching system
				match[0] = done++;

				return match;
			},

			ATTR: function( match, curLoop, inplace, result, not, isXML ) {
				var name = match[1] = match[1].replace( rBackslash, "" );

				if ( !isXML && Expr.attrMap[name] ) {
					match[1] = Expr.attrMap[name];
				}

				// Handle if an un-quoted value was used
				match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

				if ( match[2] === "~=" ) {
					match[4] = " " + match[4] + " ";
				}

				return match;
			},

			PSEUDO: function( match, curLoop, inplace, result, not ) {
				if ( match[1] === "not" ) {
					// If we're dealing with a complex expression, or a simple
					// one
					if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
						match[3] = Sizzle(match[3], null, null, curLoop);

					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

						if ( !inplace ) {
							result.push.apply( result, ret );
						}

						return false;
					}

				} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
					return true;
				}

				return match;
			},

			POS: function( match ) {
				match.unshift( true );

				return match;
			}
		},

		filters: {
			enabled: function( elem ) {
				return elem.disabled === false && elem.type !== "hidden";
			},

			disabled: function( elem ) {
				return elem.disabled === true;
			},

			checked: function( elem ) {
				return elem.checked === true;
			},

			selected: function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			parent: function( elem ) {
				return !!elem.firstChild;
			},

			empty: function( elem ) {
				return !elem.firstChild;
			},

			has: function( elem, i, match ) {
				return !!Sizzle( match[3], elem ).length;
			},

			header: function( elem ) {
				return (/h\d/i).test( elem.nodeName );
			},

			text: function( elem ) {
				var attr = elem.getAttribute( "type" ), type = elem.type;
				// IE6 and 7 will map elem.type to 'text' for new HTML5 types
				// (search, etc)
				// use getAttribute instead to test this case
				return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
			},

			radio: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
			},

			checkbox: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
			},

			file: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
			},

			password: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
			},

			submit: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "submit" === elem.type;
			},

			image: function( elem ) {
				return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
			},

			reset: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "reset" === elem.type;
			},

			button: function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && "button" === elem.type || name === "button";
			},

			input: function( elem ) {
				return (/input|select|textarea|button/i).test( elem.nodeName );
			},

			focus: function( elem ) {
				return elem === elem.ownerDocument.activeElement;
			}
		},
		setFilters: {
			first: function( elem, i ) {
				return i === 0;
			},

			last: function( elem, i, match, array ) {
				return i === array.length - 1;
			},

			even: function( elem, i ) {
				return i % 2 === 0;
			},

			odd: function( elem, i ) {
				return i % 2 === 1;
			},

			lt: function( elem, i, match ) {
				return i < match[3] - 0;
			},

			gt: function( elem, i, match ) {
				return i > match[3] - 0;
			},

			nth: function( elem, i, match ) {
				return match[3] - 0 === i;
			},

			eq: function( elem, i, match ) {
				return match[3] - 0 === i;
			}
		},
		filter: {
			PSEUDO: function( elem, match, i, array ) {
				var name = match[1],
					filter = Expr.filters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );

				} else if ( name === "contains" ) {
					return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

				} else if ( name === "not" ) {
					var not = match[3];

					for ( var j = 0, l = not.length; j < l; j++ ) {
						if ( not[j] === elem ) {
							return false;
						}
					}

					return true;

				} else {
					Sizzle.error( name );
				}
			},

			CHILD: function( elem, match ) {
				var first, last,
					doneName, parent, cache,
					count, diff,
					type = match[1],
					node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;

					case "nth":
						first = match[2];
						last = match[3];

						if ( first === 1 && last === 0 ) {
							return true;
						}

						doneName = match[0];
						parent = elem.parentNode;

						if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
							count = 0;

							for ( node = parent.firstChild; node; node = node.nextSibling ) {
								if ( node.nodeType === 1 ) {
									node.nodeIndex = ++count;
								}
							}

							parent[ expando ] = doneName;
						}

						diff = elem.nodeIndex - last;

						if ( first === 0 ) {
							return diff === 0;

						} else {
							return ( diff % first === 0 && diff / first >= 0 );
						}
				}
			},

			ID: function( elem, match ) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},

			TAG: function( elem, match ) {
				return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
			},

			CLASS: function( elem, match ) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ")
					.indexOf( match ) > -1;
			},

			ATTR: function( elem, match ) {
				var name = match[1],
					result = Sizzle.attr ?
						Sizzle.attr( elem, name ) :
						Expr.attrHandle[ name ] ?
						Expr.attrHandle[ name ]( elem ) :
						elem[ name ] != null ?
							elem[ name ] :
							elem.getAttribute( name ),
					value = result + "",
					type = match[2],
					check = match[4];

				return result == null ?
					type === "!=" :
					!type && Sizzle.attr ?
					result != null :
					type === "=" ?
					value === check :
					type === "*=" ?
					value.indexOf(check) >= 0 :
					type === "~=" ?
					(" " + value + " ").indexOf(check) >= 0 :
					!check ?
					value && result !== false :
					type === "!=" ?
					value !== check :
					type === "^=" ?
					value.indexOf(check) === 0 :
					type === "$=" ?
					value.substr(value.length - check.length) === check :
					type === "|=" ?
					value === check || value.substr(0, check.length + 1) === check + "-" :
					false;
			},

			POS: function( elem, match, i, array ) {
				var name = match[2],
					filter = Expr.setFilters[ name ];

				if ( filter ) {
					return filter( elem, i, match, array );
				}
			}
		}
	};

	var origPOS = Expr.match.POS,
		fescape = function(all, num){
			return "\\" + (num - 0 + 1);
		};

	for ( var type in Expr.match ) {
		Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
		Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
	}
	// Expose origPOS
	// "global" as in regardless of relation to brackets/parens
	Expr.match.globalPOS = origPOS;

	var makeArray = function( array, results ) {
		array = Array.prototype.slice.call( array, 0 );

		if ( results ) {
			results.push.apply( results, array );
			return results;
		}

		return array;
	};

	// Perform a simple check to determine if the browser is capable of
	// converting a NodeList to an array using builtin methods.
	// Also verifies that the returned array holds DOM nodes
	// (which is not the case in the Blackberry browser)
	try {
		Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

	// Provide a fallback method if it does not work
	} catch( e ) {
		makeArray = function( array, results ) {
			var i = 0,
				ret = results || [];

			if ( toString.call(array) === "[object Array]" ) {
				Array.prototype.push.apply( ret, array );

			} else {
				if ( typeof array.length === "number" ) {
					for ( var l = array.length; i < l; i++ ) {
						ret.push( array[i] );
					}

				} else {
					for ( ; array[i]; i++ ) {
						ret.push( array[i] );
					}
				}
			}

			return ret;
		};
	}

	var sortOrder, siblingCheck;

	if ( document.documentElement.compareDocumentPosition ) {
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
				return a.compareDocumentPosition ? -1 : 1;
			}

			return a.compareDocumentPosition(b) & 4 ? -1 : 1;
		};

	} else {
		sortOrder = function( a, b ) {
			// The nodes are identical, we can exit early
			if ( a === b ) {
				hasDuplicate = true;
				return 0;

			// Fallback to using sourceIndex (in IE) if it's available on both
			// nodes
			} else if ( a.sourceIndex && b.sourceIndex ) {
				return a.sourceIndex - b.sourceIndex;
			}

			var al, bl,
				ap = [],
				bp = [],
				aup = a.parentNode,
				bup = b.parentNode,
				cur = aup;

			// If the nodes are siblings (or identical) we can do a quick check
			if ( aup === bup ) {
				return siblingCheck( a, b );

			// If no parents were found then the nodes are disconnected
			} else if ( !aup ) {
				return -1;

			} else if ( !bup ) {
				return 1;
			}

			// Otherwise they're somewhere else in the tree so we need
			// to build up a full list of the parentNodes for comparison
			while ( cur ) {
				ap.unshift( cur );
				cur = cur.parentNode;
			}

			cur = bup;

			while ( cur ) {
				bp.unshift( cur );
				cur = cur.parentNode;
			}

			al = ap.length;
			bl = bp.length;

			// Start walking down the tree looking for a discrepancy
			for ( var i = 0; i < al && i < bl; i++ ) {
				if ( ap[i] !== bp[i] ) {
					return siblingCheck( ap[i], bp[i] );
				}
			}

			// We ended someplace up the tree so do a sibling check
			return i === al ?
				siblingCheck( a, bp[i], -1 ) :
				siblingCheck( ap[i], b, 1 );
		};

		siblingCheck = function( a, b, ret ) {
			if ( a === b ) {
				return ret;
			}

			var cur = a.nextSibling;

			while ( cur ) {
				if ( cur === b ) {
					return -1;
				}

				cur = cur.nextSibling;
			}

			return 1;
		};
	}

	// Check to see if the browser returns elements by name when
	// querying by getElementById (and provide a workaround)
	(function(){
		// We're going to inject a fake input element with a specified name
		var form = document.createElement("div"),
			id = "script" + (new Date()).getTime(),
			root = document.documentElement;

		form.innerHTML = "<a name='" + id + "'/>";

		// Inject it into the root element, check its status, and remove it
		// quickly
		root.insertBefore( form, root.firstChild );

		// The workaround has to do additional checks after a getElementById
		// Which slows things down for other browsers (hence the branching)
		if ( document.getElementById( id ) ) {
			Expr.find.ID = function( match, context, isXML ) {
				if ( typeof context.getElementById !== "undefined" && !isXML ) {
					var m = context.getElementById(match[1]);

					return m ?
						m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
							[m] :
							undefined :
						[];
				}
			};

			Expr.filter.ID = function( elem, match ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}

		root.removeChild( form );

		// release memory in IE
		root = form = null;
	})();

	(function(){
		// Check to see if the browser returns only elements
		// when doing getElementsByTagName("*")

		// Create a fake element
		var div = document.createElement("div");
		div.appendChild( document.createComment("") );

		// Make sure no comments are found
		if ( div.getElementsByTagName("*").length > 0 ) {
			Expr.find.TAG = function( match, context ) {
				var results = context.getElementsByTagName( match[1] );

				// Filter out possible comments
				if ( match[1] === "*" ) {
					var tmp = [];

					for ( var i = 0; results[i]; i++ ) {
						if ( results[i].nodeType === 1 ) {
							tmp.push( results[i] );
						}
					}

					results = tmp;
				}

				return results;
			};
		}

		// Check to see if an attribute returns normalized href attributes
		div.innerHTML = "<a href='#'></a>";

		if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
				div.firstChild.getAttribute("href") !== "#" ) {

			Expr.attrHandle.href = function( elem ) {
				return elem.getAttribute( "href", 2 );
			};
		}

		// release memory in IE
		div = null;
	})();

	if ( document.querySelectorAll ) {
		(function(){
			var oldSizzle = Sizzle,
				div = document.createElement("div"),
				id = "__sizzle__";

			div.innerHTML = "<p class='TEST'></p>";

			// Safari can't handle uppercase or unicode characters when
			// in quirks mode.
			if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
				return;
			}

			Sizzle = function( query, context, extra, seed ) {
				context = context || document;

				// Only use querySelectorAll on non-XML documents
				// (ID selectors don't work in non-HTML documents)
				if ( !seed && !Sizzle.isXML(context) ) {
					// See if we find a selector to speed up
					var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

					if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
						// Speed-up: Sizzle("TAG")
						if ( match[1] ) {
							return makeArray( context.getElementsByTagName( query ), extra );

						// Speed-up: Sizzle(".CLASS")
						} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
							return makeArray( context.getElementsByClassName( match[2] ), extra );
						}
					}

					if ( context.nodeType === 9 ) {
						// Speed-up: Sizzle("body")
						// The body element only exists once, optimize finding
						// it
						if ( query === "body" && context.body ) {
							return makeArray( [ context.body ], extra );

						// Speed-up: Sizzle("#ID")
						} else if ( match && match[3] ) {
							var elem = context.getElementById( match[3] );

							// Check parentNode to catch when Blackberry 4.6
							// returns
							// nodes that are no longer in the document #6963
							if ( elem && elem.parentNode ) {
								// Handle the case where IE and Opera return
								// items
								// by name instead of ID
								if ( elem.id === match[3] ) {
									return makeArray( [ elem ], extra );
								}

							} else {
								return makeArray( [], extra );
							}
						}

						try {
							return makeArray( context.querySelectorAll(query), extra );
						} catch(qsaError) {}

					// qSA works strangely on Element-rooted queries
					// We can work around this by specifying an extra ID on the
					// root
					// and working up from there (Thanks to Andrew Dupont for
					// the technique)
					// IE 8 doesn't work on object elements
					} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
						var oldContext = context,
							old = context.getAttribute( "id" ),
							nid = old || id,
							hasParent = context.parentNode,
							relativeHierarchySelector = /^\s*[+~]/.test( query );

						if ( !old ) {
							context.setAttribute( "id", nid );
						} else {
							nid = nid.replace( /'/g, "\\$&" );
						}
						if ( relativeHierarchySelector && hasParent ) {
							context = context.parentNode;
						}

						try {
							if ( !relativeHierarchySelector || hasParent ) {
								return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
							}

						} catch(pseudoError) {
						} finally {
							if ( !old ) {
								oldContext.removeAttribute( "id" );
							}
						}
					}
				}

				return oldSizzle(query, context, extra, seed);
			};

			for ( var prop in oldSizzle ) {
				Sizzle[ prop ] = oldSizzle[ prop ];
			}

			// release memory in IE
			div = null;
		})();
	}

	(function(){
		var html = document.documentElement,
			matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

		if ( matches ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9 fails this)
			var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
				pseudoWorks = false;

			try {
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( document.documentElement, "[test!='']:sizzle" );

			} catch( pseudoError ) {
				pseudoWorks = true;
			}

			Sizzle.matchesSelector = function( node, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

				if ( !Sizzle.isXML( node ) ) {
					try {
						if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
							var ret = matches.call( node, expr );

							// IE 9's matchesSelector returns false on
							// disconnected nodes
							if ( ret || !disconnectedMatch ||
									// As well, disconnected nodes are said to
									// be in a document
									// fragment in IE 9, so check for that
									node.document && node.document.nodeType !== 11 ) {
								return ret;
							}
						}
					} catch(e) {}
				}

				return Sizzle(expr, null, null, [node]).length > 0;
			};
		}
	})();

	(function(){
		var div = document.createElement("div");

		div.innerHTML = "<div class='test e'></div><div class='test'></div>";

		// Opera can't find a second classname (in 9.6)
		// Also, make sure that getElementsByClassName actually exists
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return;
		}

		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";

		if ( div.getElementsByClassName("e").length === 1 ) {
			return;
		}

		Expr.order.splice(1, 0, "CLASS");
		Expr.find.CLASS = function( match, context, isXML ) {
			if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
				return context.getElementsByClassName(match[1]);
			}
		};

		// release memory in IE
		div = null;
	})();

	function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;

				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 && !isXML ){
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( elem.nodeName.toLowerCase() === cur ) {
						match = elem;
						break;
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
		for ( var i = 0, l = checkSet.length; i < l; i++ ) {
			var elem = checkSet[i];

			if ( elem ) {
				var match = false;

				elem = elem[dir];

				while ( elem ) {
					if ( elem[ expando ] === doneName ) {
						match = checkSet[elem.sizset];
						break;
					}

					if ( elem.nodeType === 1 ) {
						if ( !isXML ) {
							elem[ expando ] = doneName;
							elem.sizset = i;
						}

						if ( typeof cur !== "string" ) {
							if ( elem === cur ) {
								match = true;
								break;
							}

						} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
							match = elem;
							break;
						}
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	if ( document.documentElement.contains ) {
		Sizzle.contains = function( a, b ) {
			return a !== b && (a.contains ? a.contains(b) : true);
		};

	} else if ( document.documentElement.compareDocumentPosition ) {
		Sizzle.contains = function( a, b ) {
			return !!(a.compareDocumentPosition(b) & 16);
		};

	} else {
		Sizzle.contains = function() {
			return false;
		};
	}

	Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	var posProcess = function( selector, context, seed ) {
		var match,
			tmpSet = [],
			later = "",
			root = context.nodeType ? [context] : context;

		// Position selectors must be done after the filter
		// And so must :not(positional) so we move all PSEUDOs to the end
		while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
			later += match[0];
			selector = selector.replace( Expr.match.PSEUDO, "" );
		}

		selector = Expr.relative[selector] ? selector + "*" : selector;

		for ( var i = 0, l = root.length; i < l; i++ ) {
			Sizzle( selector, root[i], tmpSet, seed );
		}

		return Sizzle.filter( later, tmpSet );
	};

	// EXPOSE

	x$.find = Sizzle;

	})();
	
	// ************************************************************************
	// SCOPE THE x$ CLASS TO BE PUBLICLY ACCESSIBLE
	// ************************************************************************
	window.x$ = x$;
}(window));