function notewindow()
{
	this.node = createNote();
	this.node.draggable({
		containment : "parent"
	});
}

function createNote() {
	var html = '<ul id="myUL">';
	html += '<li>test content</li>';
	html += '</ul>';
	var node = $('<div>').addClass('draggablenote').html(html);
	
	var myNodelist = node[0].getElementsByTagName("LI");
	var i;
	for (i = 0; i < myNodelist.length; i++) {
	  var span = document.createElement("SPAN");
	  var txt = document.createTextNode("\u00D7");
	  span.className = "close";
	  span.appendChild(txt);
	  myNodelist[i].appendChild(span);
	  myNodelist[i].onclick = function()
	  {
		  console.log(this);
		  $(this).focus();
		  this.setAttribute('contenteditable', true);
	  }
	}

	// Click on a close button to hide the current list item
	var close = node[0].getElementsByClassName("close");
	var i;
	for (i = 0; i < close.length; i++) {
	  close[i].onclick = function() {
	    var div = this.parentElement;
	    div.style.display = "none";
	  }
	}
	
	return node;
}

module.exports = notewindow;
