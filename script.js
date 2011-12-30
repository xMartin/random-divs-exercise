"use strict";
(function(){

var Div = function(args) {
	//	A widget that renders a <div> with a background color. It is draggable and resizable.
	//
	//	args.size: Array[integer, integer]
	//		The dimension of the widget in pixels (x, y).
	//	args.position: Array[integer, integer]
	//		The initial absolute position in pixels (x, y).
	//	args.color: String
	//		A CSS-compatible color value.
	
	// Handle arguments.
	this.size = args.size
	this.position = args.position
	this.color = args.color
	
	// Create main element and add style.
	var node = this.node = document.createElement("DIV")
	node.className = 'draggable'
	var styles = {
		position: 'absolute',
		left: this.position[0] + 'px',
		top: this.position[1] + 'px',
		width: this.size[0] + 'px',
		height: this.size[1] + 'px',
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
	closeNode.className = 'close'
	closeNode.addEventListener('click', function() {
		node.parentNode.removeChild(node)
	})
	node.appendChild(closeNode)
	
	return this
}

var controller = (function() {
	
	var boxSize = [30, 30]
	
	var init = function() {
		var button = document.createElement('BUTTON')
		button.appendChild(document.createTextNode('add box'))
		button.addEventListener('click', addBox)
		document.body.appendChild(button)
	}
	
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
		init: init
	}
})()

document.addEventListener('DOMContentLoaded', controller.init)

})()
