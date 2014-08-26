//************************************************************************ 
//	EXTEND x$ TO SUPPORT BLOGS
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdtemplates.js, verticalbar.js
//************************************************************************ 	

( function(o) {
	
	var cache = {};
	
	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	var e = function( elem, options ) {

		var 
			_data = {}, // the blog and list of all comments
			_formSel = ".editcomponent>form";
			_tmpData = undefined,
			_vb = new x$.verticalBar( x$(".listmenu", elem).getNode() )
			_boxes = undefined,
			_cache = { };

			_cache[ "editcommmentnode" ] = x$( "#tmpltEditComment", elem ).getNode( ).cloneNode( true );

			x$( "#tmpltEditComment", elem ).remove( );

			x$.bind( x$(".editcomponent", elem).getNode(), "click", userClick );
			x$.bind( x$(".editcomponent", elem).getNode(), "focus", focusComment );

		function focusComment( evt ) {

			removeEditCommentNodes( );
		}

		function userClick( evt ) {

			var id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			switch( id ) {

				case "btn_submit":

					submitComment( );

					preventDefault( evt );

					break;
			}
		}

		function removeComment ( id ) {

			if( options.beforeRemoveComment ) {
				
				if ( ! options.beforeRemoveComment( ) ) {

					return false;
				}
			}

			var data = {};
			
			data[ options.comment_key_field ] = id;

			removeEditCommentNodes( );

			_tmpData = _boxes[ id ].getData( )[ "blog_comment" ];

			x$.ajax( 
				{
					format:"FormUrlEncoded", 
					method:"post", 
					url:options.removeurl,
					data:data,
					callback:removeCallback
				}
			);
		};

		function updateComment( evt ) {

			if( options.beforeUpdateComment ) {
				
				if ( ! options.beforeUpdateCommentComment( ) ) {

					return false;
				}
			}

			var id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			var node = x$( "#tmpltEditComment", _boxes[_tmpData[options.comment_key_field]].getData()["node"] ).getNode( );

			switch( id ) {

				case "btn_cancel":

					if ( node ) {

						x$.unbindHandler( node, "click", updateComment );
					
						x$( node ).remove( );
					}

					break;

				case "btn_submit":

					var form = x$( _formSel, _boxes[_tmpData[options.comment_key_field]].getData()["node"] ).getNode( ),
						data = new x$.template( form ).getData( ),
						bcid = _boxes[ _tmpData[options.comment_key_field] ].getData( )[ "blog_comment" ][ options.comment_key_field ];

					var x = {};
					
					x[options.comment_key_field] = bcid;

					data = x$.extend( data, x );

					x$.ajax( 
						{
							format:"FormUrlEncoded", 
							method:"post", 
							url:options.updateurl,
							data:data,
							callback:updateCallback
						} );

					break;
			}

			preventDefault( evt );
		}

		function editComment ( id ) {

			var node = _boxes[ id ].getData( )[ "node" ],
				tmpltNode = _cache[ "editcommmentnode" ].cloneNode(true); 

			node = x$( "#edit", node ).getNode( );

			removeEditCommentNodes();

			node.appendChild( tmpltNode );

			var tmplt = new x$.template( tmpltNode );

			x$.bind( tmplt, "bindSingle", bindHandler);

			function bindHandler ( args ) { 

				x$.unbindHandler( args[1], "click", updateComment );
				x$.bind( args[1], "click", updateComment );
			}

			_tmpData = _boxes[ id ].getData( )[ "blog_comment" ];

			tmplt.applyBindings( _tmpData );
		};

		function submitComment ( ) {
			
			if( options.beforeSubmitComment ) {
				
				if ( ! options.beforeSubmitComment( ) ) {

					return false;
				}
			}

			removeEditCommentNodes( );
			
			var form = x$( _formSel, elem ).getNode( );
			var data = new x$.template( form ).getData( );

			data = x$.extend( data, key );

			_tmpData = data;

			x$.ajax( 
				{
					format:"FormUrlEncoded", 
					method:"post", 
					url:options.submiturl,
					data:data,
					callback:submitCallback
				}
			);
		};

		function initializeBlogView ( options ) {
			
			x$.ajax( 
				{
					format:"JSON", 
					method:"get", 
					url:options.url, 
					callback:options.callback ? options.callback : loadData
				} 
			);
		}

		function loadData ( o ) {

			_data= JSON.parse(o);

			updateBlogContent( );
			updateCommentList( );
		}

		function removeCallback ( o ) {

			var data = _data[ "comments" ],
				node = x$( "#tmpltEditComment", _boxes[_tmpData[options.comment_key_field]].getData()["node"] ).getNode( );

			for( var i = 0; i < data.length; i++ ) {

				if( data[i] === _tmpData ) {

					data.splice( i, 1 );

					break;
				}
			}

			if( node ) {

				x$.unbindHandler( node, "click", updateComment );
				x$( node ).remove( );
			}

			updateCommentList( );
		}

		function updateCallback ( o ) {
			
			var ra = JSON.parse(o);

			var form = x$( _formSel, _boxes[_tmpData[options.comment_key_field]].getData()["node"] ).getNode( ),
						data = new x$.template( form ).getData( ),
						node = x$( "#tmpltEditComment", _boxes[_tmpData[options.comment_key_field]].getData()["node"] ).getNode( );	

			if( ra[0]["rows_affected"] == 1 ) {
			
				_tmpData[ options.comment_content_field ] = data[ options.comment_content_field ];
			}

			if( node ) {

				x$.unbindHandler( node, "click", updateComment );
				x$( node ).remove( );
			}

			updateCommentList( );

			var form = x$( _formSel, elem ).getNode( );

			form.reset( );
		}

		function submitCallback ( o ) {

			var deLink = {
				delete_link:"javascript:bvw.removeComment("+ JSON.parse(o)[options.comment_key_field] +")",
				edit_link:"javascript:bvw.editComment("+ JSON.parse(o)[options.comment_key_field] +")"
			};

			_tmpData = x$.extend(_tmpData, JSON.parse(o) );
			_tmpData = x$.extend(_tmpData, deLink );
			_data.comments[ _data.comments.length ] = x$.extend(_tmpData, deLink );

			updateCommentList( );

			var form = x$( _formSel, elem ).getNode( );

			form.reset( );
		}

		function updateBlogContent( ) {

			var data = _data[ "blog" ][ 0 ],
				node = x$(".widgetinfo", elem).getNode();

			x$.template.bindDataToNode( data, node );
			
			node = x$(".blogcomponent", elem).getNode();

			x$.template.bindDataToNode( data, node );
		}

		function updateCommentList( ) {
		    
			var data = _data[ "comments" ],
	       		node = x$( "#wul", elem ).getNode( ),
	            nPar = undefined;
	            
	        if ( ! cache["wli"] ) {
	                
	        	cache[ "wli" ] = node.firstChild.cloneNode( true );
	        }
	            
	        function getData( o ) {

	        	return o;
	        }

	        function setData( o, v ) {

	        	o["blog_comment"] = v;
	        }

	        if( node ) {
	                
	        	nPar = node; 
	            
	        	emptyNode( nPar );

	            node = cache[ "wli"].cloneNode( true );
	                
	            x$( nPar ).insertLast( node );

	            var t = new x$.template( node, {key:options.comment_key_field, getData:getData, setData:setData} );
	        
	            _boxes = t.applyBindings( data );
	        }
		}

		function removeEditCommentNodes( ) {

			var nodes = x$( "#edit", elem ).getNode( );

			// remove all existing edit comment nodes
			if ( nodes ) {
				if( x$.isArray( nodes )) {
					
					x$( nodes ).each( function ( i, v ) {

						var child = x$( "#tmpltEditComment", v ).getNode( );

						if ( child )
							x$.unbindHandler( child, "click", updateComment );

						emptyNode( v );
					} );
				}
				else {

					var child = x$( "#tmpltEditComment", nodes ).getNode( );

					if ( child )
						x$.unbindHandler( child, "click", updateComment );

					emptyNode( nodes );
				}
			}
		}

		function emptyNode( l ) {
			
			while ( l.firstChild ) {

				l.removeChild( l.firstChild );
			}
		}

		function setUser( ) {}

		function setBlog( ) {}

		return {
			initializeBlogView: initializeBlogView,
			removeComment: removeComment,
			editComment: editComment
		};
	};

	o.blogviewwidget = o.blogviewwidget || e;
}(x$) );