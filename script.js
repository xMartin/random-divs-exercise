"use strict";
(function() {

// A single page javascript app that does the following:
//
// - With a button the user can add 30x30px divs files with a random color in a random position on the screen.
// - The user can drag around these boxes on the page, resize and delete them.
// - Supports Chrome, Safari, FF and IE9
//
// The user interface is optimized for mouse use but iOS touch input is also supported.

var myLib = (function() {
	// Little library of three functions helping to handle events coming from mouse or touch input
	// in a unified way. Three abstract event types ("press", "move", "release") are defined that are
	// mapped to their corresponding input type native event by the wrapper functions "on" and "off"
	// that wrap the native "addEventListener" and "removeEventListener" methods. Additionally
	// there's the function "getClientPosition" that returns the current position of either the mouse
	// cursor or the first touch.
	
	var isTouchDevice = 'ontouchstart' in window,
		events = {
			'press': isTouchDevice ? 'touchstart' : 'mousedown',
			'move': isTouchDevice ? 'touchmove' : 'mousemove',
			'release': isTouchDevice ? 'touchend' : 'mouseup'
		}
	
	return {
		getClientPosition: function(evt) {
			// mouse
			if (evt.clientX !== undefined) {
				return [evt.clientX, evt.clientY]
			}
			// touch
			if (evt.changedTouches) {
				return [evt.changedTouches[0].clientX, evt.changedTouches[0].clientY]
			}
			throw new Error('Unsupported environment: Cannot determine the position of the cursor or the finger on the screen.')
		},
		on: function(/*DOMNode*/ node, /*String*/ event, /*Function*/ handler) {
			if (event in events) {
				event = events[event]
			}
			return node.addEventListener(event, handler)
		},
		off: function(/*DOMNode*/ node, /*String*/ event, /*Function*/ handler) {
			if (event in events) {
				event = events[event]
			}
			return node.removeEventListener(event, handler)
		}
	}
})()

var Div = function(args) {
	//	A widget that renders a <div> with a background color. It is draggable and resizable.
	//
	//	args.size: Array[integer, integer]
	//		The dimension of the widget in pixels (x, y).
	//	args.position: Array[integer, integer]
	//		The initial absolute position in pixels (x, y).
	//	args.color: String
	//		A CSS-compatible color value.
	//
	//	returns itself, holding the main DOM element as the property `node` so we can append it to the document
	
	var node, closeNode, resizeNode
	
	// Handle arguments.
	this.size = args.size
	this.position = args.position
	this.color = args.color
	
	// Create main element and add style.
	node = this.node = document.createElement("DIV")
	node.className = 'draggable'
	node.style.position = 'absolute'
	node.style.left = this.position[0] + 'px'
	node.style.top = this.position[1] + 'px'
	node.style.width = this.size[0] + 'px'
	node.style.height = this.size[1] + 'px'
	node.style.background = this.color
	
	// Make draggable.
	myLib.on(node, 'press', function(evt) {
		var clientPosition = myLib.getClientPosition(evt),
			offset = [clientPosition[0] - node.offsetLeft, clientPosition[1] - node.offsetTop],
			moveEventHandler = function(evt) {
				var clientPosition = myLib.getClientPosition(evt)
				node.style.left = (clientPosition[0] - offset[0]) + 'px'
				node.style.top = (clientPosition[1] - offset[1]) + 'px'
			},
			dropEventHandler = function(evt) {
				myLib.off(document, 'move', moveEventHandler)
				myLib.off(document, 'release', dropEventHandler)
			}
		
		evt.preventDefault()  // no native dragging
		node.style.zIndex = Div.zIndex++
		
		myLib.on(document, 'move', moveEventHandler)
		myLib.on(document, 'release', dropEventHandler)
	})
	
	// Add close button.
	closeNode = document.createElement('DIV')
	closeNode.className = 'close'
	// Register click event handler for close button. "Click" works on iOS, too.
	closeNode.addEventListener('click', function() {
		node.parentNode.removeChild(node)
	})
	myLib.on(closeNode, 'press', function(evt) {
		evt.stopPropagation()  // no dragging here
	})
	node.appendChild(closeNode)
	
	// Add resize handle.
	resizeNode = document.createElement('DIV')
	resizeNode.className = 'resize'
	myLib.on(resizeNode, 'press', function(evt) {
		var startPosition = myLib.getClientPosition(evt),
			startDimensions = [node.clientWidth, node.clientHeight],
			moveEventHandler = function(evt) {
				var clientPosition = myLib.getClientPosition(evt)
				node.style.width = (startDimensions[0] + clientPosition[0] - startPosition[0]) + 'px'
				node.style.height = (startDimensions[1] + clientPosition[1] - startPosition[1]) + 'px'
			},
			dropEventHandler = function(evt) {
				myLib.off(document, 'move', moveEventHandler)
				myLib.off(document, 'release', dropEventHandler)
			}
		
		evt.preventDefault()  // no native dragging
		evt.stopPropagation()  // no widget dragging
		node.style.zIndex = Div.zIndex++
		
		myLib.on(document, 'move', moveEventHandler)
		myLib.on(document, 'release', dropEventHandler)
	})
	node.appendChild(resizeNode)
	
	return this
}
Div.zIndex = 1

var controller = (function() {
	var boxSize = [30, 30],
		addBox = function() {
			var position = [
					Math.floor(Math.random() * (window.innerWidth - boxSize[0])),
					Math.floor(Math.random() * (window.innerHeight - boxSize[1]))
				],
				color = function() {
					return Math.floor(Math.random() * 255)
				},
				cssColor = 'rgb(' + color() + ',' + color() + ',' + color() + ')'
			
			document.body.appendChild((new Div({size: boxSize, position: position, color: cssColor})).node)
		}
	
	return {
		init: function() {
			var button = document.createElement('BUTTON')
			button.appendChild(document.createTextNode('add box'))
			button.addEventListener('click', addBox)
			document.body.appendChild(button)
		}
	}
})()

document.addEventListener('DOMContentLoaded', controller.init)

})()
