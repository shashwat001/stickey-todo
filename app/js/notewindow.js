function notewindow()
{
	this.node = createNote();
	this.node.draggable({
		containment : "parent"
	});
}

function createNote() {
	var html = '<ul id="myUL">';
	html += '<li onclick="this.focus();" contentEditable >test content</li>';
	html += '</ul>';
	var node = $('<div>').addClass('draggablenote').html(html);
	
	return node;
}

module.exports = notewindow;
