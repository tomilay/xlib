//************************************************************************ 
//EXTEND x$ TO SUPPORT FORMS FUNCTIONALITY
//	While this code is written for form elements, with the exception of  
//  postFormIFrame and postForm JSON, will work just fine with divs and 
//	other container elements
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js
//************************************************************************ 		
(function(o) {
	function _bind(elem, data, map, id) {
		if (elem.hasChildNodes()) { // A compound element such as SELECT or array of check/radio boxes
			for(var name in map) {
				var o = x$(map[name], elem);
				o.setValue(data[name]);

				if(id != undefined){
					o.setName(o.getName()+id);
				}
			}
		} else {
			var o = x$(elem);
			o.setValue(data);
		}
	}
	var e = { 
			//************************************************************************ 
			// RETRIEVE THE DATA FROM THE FORM CONTROLS AND RETURN AN OBJECT DATA CONTAINER
			//************************************************************************ 					
			getData: function () {
				var data = {}, lm = this.elem;
				
				if (lm instanceof HTMLFormElement) {
					this.each(get);
				}

				function get(index, value) {
					
					var elem = value;
					
					if(elem && elem.name){
						node = x$("[name='"+elem.name+"']", lm);
						data[elem.name] = node.getValue();
						
						if (node.elem instanceof Array) {
							return {"inc":node.elem.length-1};
						}
					}
				}
				return data;
			},
			
			//************************************************************************ 
			// GET ALL FORM ELEMENTS IN THEIR RAW FORM
			//************************************************************************ 					
			getElements: function () {
				if (this.elem instanceof HTMLFormElement) {
					return this.elem.elements;
				}
			},

			//************************************************************************ 
			// RESET THE FORM ELEMENTS
			//************************************************************************ 					
			reset : function () {
				if (this.elem instanceof HTMLFormElement) {
					this.elem.reset();
				}
				return this;
			},

			//************************************************************************ 
			// GET THE VALUE OF THE FORM METHOD
			//************************************************************************ 					
			getMethod: function () {
				if (this.elem instanceof HTMLFormElement) {
					return this.elem.method;
				}
			},
			
			//************************************************************************ 
			// SET THE VALUE OF THE FORM METHOD
			//************************************************************************ 					
			setMethod: function (val) {
				if (this.elem instanceof HTMLFormElement) {
					this.elem.method = val;
				}
				return this;
			},

			//************************************************************************ 
			// GET THE VALUE OF THE FORM ACTION
			//************************************************************************ 					
			getAction: function () {
				if (this.elem instanceof HTMLFormElement) {
					return this.elem.action;
				}
			},
			
			//************************************************************************ 
			// SET THE VALUE OF THE FORM ACTION
			//************************************************************************ 					
			setAction: function (val) {
				if (this.elem instanceof HTMLFormElement) {
					this.elem.action = val;
				}
				return this;
			},

			//************************************************************************ 
			// POST FORM DATA TO THE SERVER AS JSON OBJECT
			//************************************************************************ 					
			postFormJSON: function (cb) {
				var options = {
						method: this.getMethod(),
						url: this.getAction(),
						data: this.getData(),
						format:"JSON",
						callback: cb
				};
				x$.ajax(options);
			},
			
			//************************************************************************ 
			// POST FORM DATA TO THE SERVER IN AN IFRAME
			//************************************************************************ 					
			postFormIFrame: function (cb) {
				var options = {
						method: this.getMethod(),
						url: this.getAction(),
						callback: cb
				};
				x$.ajaxIFrame(this.elem, options);
			},
			
			//*********************************************************************************** 
			// BIND FORM TO DATA SOURCE obj WITH MULTIPLE ROWS USING map FOR BINDING INFORMATION
			//*********************************************************************************** 					
			bindRows:function(data, map, className) {
				
				var elem = this.elem.cloneNode(true);
				
				var obj =  undefined;    
				var name = elem.getAttribute("name");
				
				refresh();
				
				this.appendBefore(elem);

				var rows = 0;
				
				for(row in data) {
					var oldElem = elem;
					
					if(rows > 0) {
						elem = this.elem.cloneNode(true);
						x$(oldElem).appendAfter(elem);
					}
					elem.setAttribute("id",name+rows);
					elem.setAttribute("name",name);

					obj = data[row];
					
					_bind(elem, obj, map, rows);
					
					if (className){
						elem.className = className;
					}
					rows++;
				}
				
				// Clear any pre-existing binds.  The template node has id=name
				function refresh(){
					var rows = x$("[name='" + name + "']").getNode();

					if(rows[0]){
						for(var row = 0; row < rows.length; row++){
							node = rows[row];

							if(node.getAttribute("id")!= name){
								if (node.parentNode)
									   node.parentNode.removeChild(node);
							}
						}
					}
				}
				return this;
			},

			//**************************************************************************** 
			// BIND FORM TO DATA SOURCE obj(SINGLE ROW) USING map FOR BINDING INFORMATION
			//**************************************************************************** 					
			bindRow: function (data, map, className) {
				_bind(this.elem, data, map, undefined);
					
				if (className){
					this.elem.className = className;
				}
				return this;
			},

			//************************************************************************ 
			// BIND LIST CONTROL(SELECT) WITH NEW DATA
			//************************************************************************ 					
			populateList: function(data, id, name, className) {
				if(this.elem instanceof HTMLSelectElement) {
					var d = x$(data);
					var lm = this.elem;
					
					lm.options.length = 0;
					
					function setvalue(index, value){
						lm.options.add(new Option(x$.titleCase(value[name]), value[id]));
					}
					d.each(setvalue);
				}
				
				if (className){
					this.elem.className = className;
				}
				return this;
			}
	};
	x$.extend(o.fn, e);
}(x$));