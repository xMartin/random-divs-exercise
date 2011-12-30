"use strict";
(function() {

var myLib = (function() {
	var isTouchDevice = 'ontouchstart' in window
	var events = {
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
			return null
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
	
	// Handle arguments.
	this.size = args.size
	this.position = args.position
	this.color = args.color
	
	// Create main element and add style.
	var node = this.node = document.createElement("DIV")
	node.className = 'draggable'
	node.style.position = 'absolute'
	node.style.left = this.position[0] + 'px'
	node.style.top = this.position[1] + 'px'
	node.style.width = this.size[0] + 'px'
	node.style.height = this.size[1] + 'px'
	node.style.background = this.color
	
	// Make draggable.
	myLib.on(node, 'press', function(evt) {
		evt.preventDefault()  // no native dragging
		node.style.zIndex = Div.zIndex++
		var clientPosition = myLib.getClientPosition(evt)
		var offset = [clientPosition[0] - node.offsetLeft, clientPosition[1] - node.offsetTop]
		var moveEventHandler = function(evt) {
			var clientPosition = myLib.getClientPosition(evt)
			node.style.left = (clientPosition[0] - offset[0]) + 'px'
			node.style.top = (clientPosition[1] - offset[1]) + 'px'
		}
		var dropEventHandler = function(evt) {
			myLib.off(document, 'move', moveEventHandler)
			myLib.off(document, 'release', dropEventHandler)
		}
		myLib.on(document, 'move', moveEventHandler)
		myLib.on(document, 'release', dropEventHandler)
	})
	
	// Add close button.
	var closeNode = document.createElement('DIV')
	closeNode.className = 'close'
	closeNode.addEventListener('click', function() {
		node.parentNode.removeChild(node)
	})
	// Stop propagation of the touchstart event here as it seems to mask the click event.
	closeNode.addEventListener('touchstart', function(evt) {
		evt.stopPropagation()
	})
	closeNode.addEventListener('mousedown', function(evt) {
		evt.stopPropagation()  // no dragging here
	})
	node.appendChild(closeNode)
	
	// Add resize handle.
	var resizeNode = document.createElement('DIV')
	resizeNode.className = 'resize'
	myLib.on(resizeNode, 'press', function(evt) {
		evt.preventDefault()  // no native dragging
		evt.stopPropagation()  // no widget dragging
		node.style.zIndex = Div.zIndex++
		var startPosition = myLib.getClientPosition(evt)
		var startDimensions = [node.clientWidth, node.clientHeight]
		var moveEventHandler = function(evt) {
			var clientPosition = myLib.getClientPosition(evt)
			node.style.width = (startDimensions[0] + clientPosition[0] - startPosition[0]) + 'px'
			node.style.height = (startDimensions[1] + clientPosition[1] - startPosition[1]) + 'px'
		}
		var dropEventHandler = function(evt) {
			myLib.off(document, 'move', moveEventHandler)
			myLib.off(document, 'release', dropEventHandler)
		}
		myLib.on(document, 'move', moveEventHandler)
		myLib.on(document, 'release', dropEventHandler)
	})
	node.appendChild(resizeNode)
	
	return this
}
Div.zIndex = 1

var controller = (function() {
	var boxSize = [30, 30]
	var addBox = function() {
		var position = [
			Math.floor(Math.random() * (window.innerWidth - boxSize[0])),
			Math.floor(Math.random() * (window.innerHeight - boxSize[1]))
		]
		for (var color = [], i = 0; i < 3; color.push(Math.floor(Math.random() * 255)), ++i);
		var cssColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'
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
