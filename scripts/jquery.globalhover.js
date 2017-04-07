// Полифил для MouseEvent
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
	/**
	* GlobalHover plugin v2017-01-30
	* Проверялось на JQuery 3.1.1
	*/
	let watchlist = [];
	let global_dispatch_enabled = true;
	
	let $prev_hovered_element;
	
	let $findHoveredElement = function(mouse_event)
	{
		let e = mouse_event;
		let $hovered_element;
		
		watchlist.forEach(function($element)
		{
			let top    = $element.offset().top;
			let left   = $element.offset().left;
			let bottom = top + $element.height();
			let right  = left + $element.width();
			
			let is_mouseover = (e.pageY >= top && e.pageY <= bottom && e.pageX >= left && e.pageX <= right);
			
			if (is_mouseover)
			{
				$hovered_element = $element;
				return;
			}
		});
		
		return $hovered_element;
	};
	
	
	$(document).mousemove(function(e)
	{
		let $hovered_element = $findHoveredElement(e);
		
		if (global_dispatch_enabled && $hovered_element !== $prev_hovered_element)
		{
			if ($hovered_element)
				$hovered_element[0].dispatchEvent(new MouseEvent("global-mouseenter", { bubbles: false, cancelable: true }));
			
			if ($prev_hovered_element)
				$prev_hovered_element[0].dispatchEvent(new MouseEvent("global-mouseleave", { bubbles: false, cancelable: true }));
		}
		
		$prev_hovered_element = $hovered_element;
	});
	
	
	
	$.fn.globalHover = function(in_handler, out_handler)
	{
		return this.each(function()
		{
			if (in_handler)
				this.addEventListener("global-mouseenter", in_handler);
			
			if (out_handler)
				this.addEventListener("global-mouseleave", out_handler);
			
			watchlist.push($(this));
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