"use strict";
(function(){

var Div = function(args) {
	//	A widget that renders a <div> with a background color. It is draggable and resizable.
	//
	//	args.color: String
	//		A CSS-compatible color value.
	//	args.position: Array[integer, integer]
	//		The initial absolute position in pixels (x, y).
	
	// Handle arguments.
	this.color = args.color
	this.position = args.position
	
	// Create main element and add style.
	var node = this.node = document.createElement("DIV")
	var styles = {
		position: 'absolute',
		left: this.position[0] + 'px',
		top: this.position[1] + 'px',
		width: '30px',
		height: '30px',
		background: this.color
	}
	for (var property in styles) {
		node.style[property] = styles[property]
	}

	// Make draggable.
	var downEventHandler = function(evt) {
		evt.preventDefault()  // no native dragging
		var offset = null
		var moveEventHandler = function(evt) {
			offset = offset || [evt.clientX - node.offsetLeft, evt.clientY - node.offsetTop]
			node.style.left = (evt.clientX - offset[0]) + 'px'
			node.style.top = (evt.clientY - offset[1]) + 'px'
		}
		var dropEventHandler = function(evt) {
			document.removeEventListener('mousemove', moveEventHandler)
			offset = null
			document.removeEventListener('mouseup', dropEventHandler)
		}
		document.addEventListener('mousemove', moveEventHandler)
		document.addEventListener('mouseup', dropEventHandler)
	}
	node.addEventListener('mousedown', downEventHandler)
	
	// Add close button.
	var closeNode = document.createElement('DIV')
	closeNode.setAttribute('style', 'position:absolute;top:-4px;left:-4px;width:11px;height:11px;background:black;')
	var self = this
	closeNode.addEventListener('click', function() {
		document.body.removeChild(node)
	})
	node.appendChild(closeNode)
	
	return this
}

// test
document.addEventListener('DOMContentLoaded', function() {
	document.body.appendChild((new Div({color: 'blue', position: [50, 50]})).node)
})

})()
