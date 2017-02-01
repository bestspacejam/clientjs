(function(window)
{
	try { new MouseEvent('test'); }
	catch(e) { return false; }

	// Polyfills DOM4 CustomEvent
	function MouseEvent(eventType, params)
	{
		params = params || { bubbles: false, cancelable: false };
		var mouseEvent = document.createEvent('MouseEvent');
		mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		return mouseEvent;
	}

	MouseEvent.prototype = Event.prototype;
	window.MouseEvent = MouseEvent;
})(window);

(function($)
{
	/*
	* GlobalHover plugin v2017-01-30
	* Проверялось на JQuery 3.1.1
	*/
	
	let global_dispatch_enabled = true;
	
	$.fn.globalHover = function(in_handler, out_handler)
	{
		return this.each(function()
		{
			let self = $(this);
			// console.log(this);
			
			let top    = self.offset().top;
			let left   = self.offset().left;
			let bottom = top + self.height();
			let right  = left + self.width();
			
			let element = this;
			
			let prev_mouseover = false;
			let is_mouseover   = false;
			
			if (in_handler)
				element.addEventListener("global-mouseenter", in_handler);
			
			if (out_handler)
				element.addEventListener("global-mouseleave", out_handler);
			
			$(document).mousemove(function(e)
			{
				// $element.text(e.pageX + " " + e.pageY);
				if (!global_dispatch_enabled) return false;
				
				is_mouseover = (e.pageY >= top && e.pageY <= bottom && e.pageX >= left && e.pageX <= right);
				
				if (prev_mouseover != is_mouseover)
				{
					// console.log(e);
					let event_name = is_mouseover
						? "global-mouseenter"
						: "global-mouseleave";
					
					element.dispatchEvent(new MouseEvent(event_name, {bubbles: false, cancelable: true}));
				}
				
				prev_mouseover = is_mouseover;
			});
		});
	};
	
	$.fn.globalHover.disableDispatch = function()
	{
		global_dispatch_enabled = false;
	};
	
	$.fn.globalHover.enableDispatch = function()
	{
		global_dispatch_enabled = true;
	};
}(jQuery));