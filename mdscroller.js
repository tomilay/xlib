(function(o) {
	var doc = window.document;
	var e = {
			scroller: function(left, right, options) {
			    var self = this;
			    this.l = left;
			    this.r = right;
			    
			    // Define how to scroll
			    this.sID = 0; // Scroll ID so they don't fight eachother

			    this.prettyScroll = function(sto, sid){
			        var mid = sid || ++this.sID,
			            c = self.elem,
			            w = c.scrollWidth,
			            x = c.scrollLeft,
			            t = (sto===undefined?x:sto),
			            dx = 10;
			        
			        if(mid !== self.sID) return;
			        
			        if(t > w) 
			        	t = w;
			        else if (t < 0) 
			        	t = 0;
			        
			        if(Math.abs(t - x) <= dx) 
			        	return c.scrollLeft = t;
			        
			        if(t > x) 
			        	c.scrollLeft = x + dx;
			        else 
			        	c.scrollLeft = x - dx;
			        
			        setTimeout(function(){self.prettyScroll(t, mid)},options && options.interval || 20);
			    };
			    
			    // Add functions to left&right buttons
			    if(document.addEventListener){
				    left.addEventListener('click',function(){
				        var w = self.elem.offsetWidth;
				        self.prettyScroll(self.elem.scrollLeft - w);
				    },false);
	
				    right.addEventListener('click',function(){
				        var w = self.elem.offsetWidth;
				        self.prettyScroll(self.elem.scrollLeft + w);
				    },false);
			    } else {
				    left.attachEvent('click',function(){
				        var w = self.elem.offsetWidth;
				        self.prettyScroll(self.elem.scrollLeft - w);
				    });
	
				    right.attachEvent('click',function(){
				        var w = self.elem.offsetWidth;
				        self.prettyScroll(self.elem.scrollLeft + w);
				    });
			    }
			    return this;
			}
	};
	x$.extend(o.fn, e);
}(x$));