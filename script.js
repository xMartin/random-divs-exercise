;(function(){

//	Class Div
//
//	A widget that renders a <div> with a background color. It is draggable and resizable.
//
//	args.color: String
//		A CSS-compatible color value.
//	args.position: Array[integer, integer]
//		The initial absolute position in pixels (x, y).

var Div = function(args) {
	// constructor function
	
	this.color = args.color
	this.position = args.position
	this.render()
	return this
}
Div.prototype.render = function() {
	var node = this.node = document.createElement("DIV")
	var downEventHandler = function(evt){
		evt.preventDefault()
		var moveEventHandler = function(evt){
			node.style.left = evt.clientX + 'px'
			node.style.top = evt.clientY + 'px'
		}
		var dropEventHandler = function(evt){
			document.removeEventListener('mousemove', moveEventHandler)
			document.removeEventListener('mouseup', dropEventHandler)
		}
		document.addEventListener('mousemove', moveEventHandler)
		document.addEventListener('mouseup', dropEventHandler)
	}
	node.addEventListener('mousedown', downEventHandler)
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
}

// test
document.addEventListener('DOMContentLoaded', function(){
	document.body.appendChild((new Div({color: 'blue', position: [50, 50]})).node)
})

})();
