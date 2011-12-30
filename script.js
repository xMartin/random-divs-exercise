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
	node.style.position = 'absolute'
	node.style.left = this.position[0] + 'px'
	node.style.top = this.position[1] + 'px'
	node.style.width = this.size[0] + 'px'
	node.style.height = this.size[1] + 'px'
	node.style.background = this.color
	
	// Make draggable.
	node.addEventListener('mousedown', function(evt) {
		evt.preventDefault()  // no native dragging
		node.style.zIndex = Div.zIndex++
		var offset = [evt.clientX - node.offsetLeft, evt.clientY - node.offsetTop]
		var moveEventHandler = function(evt) {
			node.style.left = (evt.clientX - offset[0]) + 'px'
			node.style.top = (evt.clientY - offset[1]) + 'px'
		}
		var dropEventHandler = function(evt) {
			document.removeEventListener('mousemove', moveEventHandler)
			document.removeEventListener('mouseup', dropEventHandler)
		}
		document.addEventListener('mousemove', moveEventHandler)
		document.addEventListener('mouseup', dropEventHandler)
	})
	
	// Add close button.
	var closeNode = document.createElement('DIV')
	closeNode.className = 'close'
	closeNode.addEventListener('click', function() {
		node.parentNode.removeChild(node)
	})
	closeNode.addEventListener('mousedown', function(evt) {
		evt.stopPropagation()  // no dragging here
	})
	node.appendChild(closeNode)
	
	// Add resize handle.
	var resizeNode = document.createElement('DIV')
	resizeNode.setAttribute('style', 'position:absolute;bottom:-3px;right:-3px;width:7px;height:7px;cursor:se-resize;')
	resizeNode.addEventListener('mousedown', function(evt) {
		evt.preventDefault()  // no native dragging
		evt.stopPropagation()  // no widget dragging
		var startPosition = [evt.clientX, evt.clientY]
		var startDimensions = [node.clientWidth, node.clientHeight]
		var moveEventHandler = function(evt) {
			node.style.width = (startDimensions[0] + evt.clientX - startPosition[0]) + 'px'
			node.style.height = (startDimensions[1] + evt.clientY - startPosition[1]) + 'px'
		}
		var dropEventHandler = function(evt) {
			document.removeEventListener('mousemove', moveEventHandler)
			document.removeEventListener('mouseup', dropEventHandler)
		}
		document.addEventListener('mousemove', moveEventHandler)
		document.addEventListener('mouseup', dropEventHandler)
	})
	node.appendChild(resizeNode)
	
	return this
}
Div.zIndex = 1

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
