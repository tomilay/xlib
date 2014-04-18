//************************************************************************ 
//	EXTEND x$ TO SUPPORT BLOGS
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdtemplates.js, mdverticalbar.js
//************************************************************************ 	

(function(o) {
	
	var cache = {};
	
	function preventDefault ( e ) {

		if ( e.preventDefault ) e.preventDefault( );

		e.returnValue = false;
	}	

	var e = function( elem, options ) {

		var 
			_data = {},
			_formSel = ".editcomponent>form";
			_tmpData = undefined,
			_vb = new x$.verticalBar( x$(".listmenu", elem).getNode() )
			_boxes = undefined,
			_cache = { };

			_cache[ "editcommmentnode" ] = x$( "#tmpltEditComment", elem ).getNode( ).cloneNode( true );

			x$( "#tmpltEditComment", elem ).remove( );

			x$.bind( x$(".editcomponent", elem).getNode(), "click", userClick );

		function userClick( evt ) {

			id = evt.target ? evt.target.id : undefined;

			id = id || ( evt.srcElement ? evt.srcElement.id : undefined );

			switch( id ) {

				case "btn_submit":

					submit( );

					preventDefault( evt );

					break;
			}
		}

		function removeComment ( id ) {

			var data = { blog_comment_id:id }; 
			
			_tmpData = _boxes[ id ].getData()[ "blog_comment" ];

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

			// var tmpltNode = x$( "#tmpltEditComment" ).getNode( );
			
			alert("Inside updateComment");

			preventDefault( evt );
		}

		function editComment ( id ) {

			var node = _boxes[ id ].getData( )[ "node" ],
				tmpltNode = _cache[ "editcommmentnode" ].cloneNode(true); 

			node = x$( "#edit", node ).getNode( );
			var child = x$( "#tmpltEditComment", node ).getNode( );

			if ( child )
				x$.unbindHandler( child, "click", updateComment );

			emptyNode( node );

			// var nodes = x$( "#edit", elem ).getNode( );

			// if ( nodes ) {
			// 	if( x$.isArray( nodes )) {
					
			// 		x$( nodes ).each( function ( i, v ) {

			// 			var child = x$( "#tmpltEditComment", v ).getNode( );

			// 			if ( child )
			// 				x$.unbindHandler( child, "click", updateComment );

			// 			emptyNode( v );

			// 			// alert(v);
			// 		} );
			// 	}
			// 	else {

			// 		var child = x$( "#tmpltEditComment", nodes ).getNode( );

			// 		if ( child )
			// 			x$.unbindHandler( child, "click", updateComment );

			// 		emptyNode( nodes );
			// 	}
			// }
			node.appendChild( tmpltNode );

			var tmplt = new x$.template( tmpltNode );

			x$.bind( tmplt, "bindSingle", bindHandler);

			function bindHandler ( args ) { 

				x$.unbindHandler( x$("#btn_submit", args[1]).getNode(), "click", updateComment );
				x$.bind( x$("#btn_submit", args[1]).getNode(), "click", updateComment );
			}
			_tmpData = _boxes[ id ].getData( )[ "blog_comment" ];

			tmplt.applyBindings( _tmpData );
		};

		function submit ( ) {
			
			if( options.beforeSubmit ) {
				
				options.beforeSubmit( );
			}
			
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

			var data = _data[ "comments" ];

			for( var i = 0; i < data.length; i++ ) {

				if( data[i] === _tmpData ) {

					data.splice( i, 1 );

					break;
				}
			}

			updateCommentList( );
		}

		function submitCallback ( o ) {
			// var data = x$.extend{ {user_id:key["user_id"]}, JSON.parse(o) };
			
			_data.comments[ _data.comments.length ] = x$.extend(_tmpData, JSON.parse(o) );

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

	            var t = new x$.template( node, {key:"blog_comment_id", getData:getData, setData:setData} );
	        
	            _boxes = t.applyBindings( data );
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
			editComment: editComment,
			setUser : setUser,
			setBlog : setBlog
		};
	};

	o.blogviewwidget = o.blogviewwidget || e;
}(x$));