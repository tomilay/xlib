(function(o) {
	// This static variable will hold all current templates.  
	var arrTemplates = [];

	var doc = window.document;
	
	function saveTemplate(name, template){
		arrTemplates[name] = template;
	}
	
	function getTemplate(name){
		return arrTemplates[name];
	}
	function bindTemplate(datasource, rowid){
		if (this.elem !== undefined) {
			var pattern = /\{(\w+)\}/g;
			var delim = /[\{\}]/g;
			var matches=this.elem.innerHTML.match(pattern);
			
			if(matches && matches.length) {
				for(i=0; i < matches.length; i++) {
					var field = matches[i];
					var rep = datasource[matches[i].replace(delim,"")];
					this.elem.innerHTML=this.elem.innerHTML.replace(matches[i],rep === null?"":rep);
				}
			}
		}
	}
	function bindSingle(datasource, rowid){
		if (this.elem !== undefined) {
			var lm = x$(this.elem.childNodes);
			
			setValues(this.elem, false);
			
			// bind any children
			x$.each(lm.elem, function (index, value){
				setValues(this, true);
			}, true);
		}
		
		function setValues(elem, changeid){
			if(x$.hasDataBind(elem)){
				x$(elem).setValue(datasource[elem.attributes['data-bind'].value]);

				if(rowid !== undefined) {
					var field = elem.getAttribute('data-bind');
	
					if(changeid){
						elem.setAttribute('id',(elem.getAttribute('id') === null)?field+'_'+rowid:elem.getAttribute('id')+'_'+rowid);
					}
				}
			}
		}
		return this;
	}
	
	function bindRows(datasource) {
		var name= this.elem.getAttribute('name'), temp = getTemplate(name);
		
		refresh();
		
		var orig = temp?temp.cloneNode(true):this.elem.cloneNode(true),
			rows = 0,
			obj = undefined,
			curLm = undefined,
			newLm = undefined;
		
		for (row in datasource){
			obj = datasource[row];
			
			if(rows === 0) {
				if (temp === undefined){
					curLm = this.elem;
					
					saveTemplate(name, orig);
				} else {
					this.elem = temp;
					
					curLm = this.elem;
				}	
				bindSingle.call(this, obj, rows);
			} else {
				newLm = orig.cloneNode(true);
				newLm.setAttribute('id',name+rows);
				newLm.setAttribute('name',name);
				
				x$(curLm).appendAfter(newLm);
				
				bindSingle.call(x$(newLm), obj, rows);

				curLm = newLm;
			}
			
			rows++;
		}

		// Clear any pre-existing binds.  The template node has id=name
		function refresh(){
			var rows = x$("[name='" + name + "']").getNode();

			if(rows[0]){
				for(var row = 0; row < rows.length; row++){
					node = rows[row];

					if(node.getAttribute('id')!= name){
						if (node.parentNode)
							   node.parentNode.removeChild(node);
					} else {
						// replace the node with the saved template
						if (node.parentNode  && temp){
							node.parentNode.replaceChild(temp, node);
							
							// replace the template
							saveTemplate(name,temp.cloneNode(true));
						}
					}
				}
			} else {
				// replace the node with the saved template
				if (rows.parentNode  && temp){
					rows.parentNode.replaceChild(temp, rows);
					
					// replace the template
					saveTemplate(name,temp.cloneNode(true));
				}
			}
		}

		return this;
	}

	function bindTemplates(datasource) {
		var name= this.elem.getAttribute('name'), temp = getTemplate(name);
		
		refresh();
		
		var orig = temp?temp.cloneNode(true):this.elem.cloneNode(true),
			rows = 0,
			obj = undefined,
			curLm = undefined,
			newLm = undefined;
		
		for (row in datasource){
			obj = datasource[row];
			
			if(rows === 0) {
				if (temp === undefined){
					curLm = this.elem;
					
					saveTemplate(name, orig);
				} else {
					this.elem = temp;
					
					curLm = this.elem;
				}	
				bindTemplate.call(this, obj, rows);
			} else {
				newLm = orig.cloneNode(true);
				newLm.setAttribute('id',name+rows);
				newLm.setAttribute('name',name);
				
				x$(curLm).appendAfter(newLm);
				
				bindTemplate.call(x$(newLm), obj, rows);

				curLm = newLm;
			}
			
			rows++;
		}

		// Clear any pre-existing binds.  The template node has id=name
		function refresh(){
			var rows = x$("[name='" + name + "']").getNode();

			if(rows[0]){
				for(var row = 0; row < rows.length; row++){
					node = rows[row];

					if(node.getAttribute('id')!= name){
						if (node.parentNode)
							   node.parentNode.removeChild(node);
					} else {
						// replace the node with the saved template
						if (node.parentNode  && temp){
							node.parentNode.replaceChild(temp, node);
							
							// replace the template
							saveTemplate(name,temp.cloneNode(true));
						}
					}
				}
			} else {
				// replace the node with the saved template
				if (rows.parentNode  && temp){
					rows.parentNode.replaceChild(temp, rows);
					
					// replace the template
					saveTemplate(name,temp.cloneNode(true));
				}
			}
		}

		return this;
	}

	o.hasDataBind = function(lm) {
		if (lm.getAttribute)
			return lm.getAttribute('data-bind') !== null;
	}
	
	var e = {
			applyBindings: function(data){
				if(x$.isArray(data)){
					return bindRows.call(this, data)
				}else{
					return bindSingle.call(this, data);
				}
			},
			applyTemplates: function(data){
				if(x$.isArray(data)){
					return bindTemplates.call(this, data)
				}else{
					return bindTemplate.call(this, data);
				}
			},
			notifyObservers: function() {
				// Dispatch event for listeners
				if (this.elem !== undefined) {
					var lm = x$(this.elem.childNodes);
	
					x$.each(lm.elem, function (index, value){
						if(x$.hasDataBind(this)){
						}
					}, true);
				}
				return this;
			} 
	};
	x$.extend(o.fn, e);
}(x$));