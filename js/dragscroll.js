/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 0.0.8
 *
 * @license MIT, see http://github.com/asvd/dragscroll
 * @copyright 2015 asvd <heliosframework@gmail.com>
 *
 * ER - Edited to disable links if scrolled
 */

// Couldn't think of a better way to disable links other than a global variable
var DS = {dragged: 0};
$(document).ready(function() {
	$(".dragscroll").find("a").on('click', function(e) {
		if (DS.dragged) {
			e.preventDefault();
			return false;
		}
	});
});

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports'], factory);
	} else if (typeof exports !== 'undefined') {
		factory(exports);
	} else {
		factory((root.dragscroll = {}));
	}
}(this, function (exports) {
	var _window = window;
	var _document = document;
	var mousemove = 'mousemove';
	var mouseup = 'mouseup';
	var mousedown = 'mousedown';
	var EventListener = 'EventListener';
	var addEventListener = 'add'+EventListener;
	var removeEventListener = 'remove'+EventListener;
	var newScrollX, newScrollY;
	var draggedBuffer = 40;

	var dragged = [];
	var reset = function(i, el) {
		for (i = 0; i < dragged.length;) {
			el = dragged[i++];
			el = el.container || el;
			el[removeEventListener](mousedown, el.md, 0);
			_window[removeEventListener](mouseup, el.mu, 0);
			_window[removeEventListener](mousemove, el.mm, 0);
		}

		// cloning into array since HTMLCollection is updated dynamically
		dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
		for (i = 0; i < dragged.length;) {
			(function(el, lastClientX, lastClientY, pushed, scroller, cont, initialX){
				(cont = el.container || el)[addEventListener](
					mousedown,
					cont.md = function(e) {
						if (!el.hasAttribute('nochilddrag') ||
							_document.elementFromPoint(
								e.pageX, e.pageY
							) == cont
						) {
							pushed = 1;
							DS.dragged = 0;
							lastClientX = e.clientX;
							lastClientY = e.clientY;
							initialX = e.clientX;

							e.preventDefault();
						}
					}, 0
				);

				_window[addEventListener](
					mouseup,
					cont.mu = function() {
						pushed = 0;
					}, 0
				);

				_window[addEventListener](
					mousemove,
					cont.mm = function(e) {
						if (pushed) {
							(scroller = el.scroller||el).scrollLeft -=
								newScrollX = (- lastClientX + (lastClientX=e.clientX));
							scroller.scrollTop -=
								newScrollY = (- lastClientY + (lastClientY=e.clientY));

							if (DS.dragged === 0 && Math.abs(initialX - lastClientX) > draggedBuffer) {
								DS.dragged = 1;
							}

							if (el == _document.body) {
								(scroller = _document.documentElement).scrollLeft -= newScrollX;
								scroller.scrollTop -= newScrollY;
							}
						}
					}, 0
				);
			})(dragged[i++]);
		}
	}


	if (_document.readyState == 'complete') {
		reset();
	} else {
		_window[addEventListener]('load', reset, 0);
	}

	exports.reset = reset;
}));

