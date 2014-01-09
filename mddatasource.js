/**
 * DEPENDS ON mdajax.js
 */
(function(o) {
	
	var dataSource = function (obj){
		var _data, _ptr = 0;
		_self = this;
	};
	
	function prvPtr(items){
		if(!((_ptr - items) < 0)) {
			_ptr -= items;
		} else {
			_ptr = 0;
		}
	}

	function nxtPtr(items){
		var l = _data.length;
		
		if(!((_ptr + items) > l)) {
			_ptr += items;
		}
	}
	
	dataSource.prototype.get = function(options){
		if(typeof options.callback !== 'function')
			options.callback = this.dataReceived;
		
		x$.simplePost(options);
		
	    return this;
	};
	
	dataSource.prototype.fetchNext = function(items) {
		nxtPtr(items);

		var ret = _data.slice(_ptr, items + _ptr);

		return ret;
	};
	
	dataSource.prototype.fetchPrevious = function(items) {
		prvPtr(items);

		var ret = _data.slice(_ptr, items + _ptr);

		return ret;
	};
	
	dataSource.prototype.dataReceived = function(data){
		_data = JSON.parse(data);
		_ptr = 0;
		
		x$(document).raiseEvent("dataLoaded");
	};
	
	var e = {
			datasource :  function() { 
				return new dataSource(this); 
			} 
	}
	x$.extend(o.fn, e);
	
	o.datasource = dataSource.prototype;
}(x$));