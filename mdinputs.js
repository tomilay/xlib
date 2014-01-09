// ************************************************************************ 
// EXTEND x$ TO SUPPORT INPUT CONTROLS
//	
// 	Supported browsers: IE8, Chrome, FireFox, Safari, Opera
// 
// Dependency: mdcore.js, mdinputs.js
// ************************************************************************ 		
(function(o) {
	// ************************************************************************ 
	// WRAP OBJECT o IN STRING TAG d
	// ************************************************************************ 		
	function wrap(o,d) {
		return o && d + o.toString() + d || d+d;
	};
	
	// ************************************************************************ 
	// FUNCTION TO DETECT THE PRESENCE OF A VALUE IN AN OBJECT
	// IF val IS A MEMBER OF obj, RETURN true
	// ************************************************************************ 		
	function inObject(val, obj) {
		if( obj === val ) {
			return true;
		}
		for(var i in obj) {
			if (obj[i] === val) {
				return true;
			}
		}
		return false;
	};
	
	var options ={delim:""};
	var e = { 
			getValue: function () { 
				if(this.elem instanceof HTMLInputElement) {
					switch(this.elem.type.toUpperCase()) {
					case "TEXT":
						return wrap(this.elem.value,options.delim);
						break;
					case "FILE":
						return wrap(this.elem.value,options.delim);
						break;
					case "RADIO":
						return this.elem.checked;
						break;
					case "CHECKBOX":
						return this.elem.checked;
						break;
					}
				};
				if(this.elem instanceof HTMLSelectElement) {
					switch(this.elem.type.toUpperCase()) {
					case "SELECT-ONE":
						return wrap(this.elem.value,options.delim);
						break;
					case "SELECT-MULTIPLE":
						var obj = {};
						for(var i = 0; i < this.elem.length; i++) {
							if(this.elem[i].selected) {
								obj[i] = wrap(this.elem[i].value,options.delim);
							}
						}
						return obj;
						break;
					}
				};
				if(this.elem instanceof HTMLTextAreaElement) {
					if (this.elem.type.toUpperCase() === "TEXTAREA") {
						return wrap(this.elem.value,options.delim);
					}
				};
				if(this.elem instanceof NodeList || this.elem instanceof HTMLCollection || this.elem instanceof Array) {
					var obj = {};
					for(var i = 0; i < this.elem.length; i++) {
						if(this.elem[i].checked) {
							obj[i] = wrap(this.elem[i].value,options.delim);
						}
					}
					return obj;
				};
				if(this.elem.tagName == 'SPAN' || this.elem.tagName == 'DIV')
					return this.elem.innerHTML;

			},
			setValue: function(val) {
				if(this.elem){
					if(this.elem instanceof HTMLImageElement) {
						this.elem.src = val;
					}
					if(this.elem instanceof HTMLInputElement) {
						switch(this.elem.type.toUpperCase()) {
						case "TEXT":
							this.elem.value = val;
							break;
						case "RADIO":
							this.elem.checked = val;
							break;
						case "CHECKBOX":
							this.elem.checked = val;
							break;
						}
					};
					if(this.elem instanceof HTMLSelectElement) {
						switch(this.elem.type.toUpperCase()) {
						case "SELECT-ONE":
							this.elem.value = val;
							break;
						case "SELECT-MULTIPLE":
							for(var i = 0; i < this.elem.length; i++) {
								this.elem[i].selected = false;
								if(inObject(this.elem[i].value, val)) {
									this.elem[i].selected = true;
								}
							}
							break;
						}
					};
					if(this.elem instanceof HTMLTextAreaElement) {
						if (this.elem.type.toUpperCase() === "TEXTAREA") {
							this.elem.value = val;
						}
					};
					if(this.elem instanceof NodeList || this.elem instanceof HTMLCollection || this.elem instanceof Array || this.elem[0]) {
						for(var i =0; i < this.elem.length; i++) {
							this.elem[i].checked = inObject(this.elem[i].value, val);
						}
					};
					if(this.elem.tagName == 'SPAN' || this.elem.tagName == 'DIV')
						this.elem.innerHTML = val;
				}
				return this;
			}
	};
	x$.extend(o.fn, e);
}(x$));