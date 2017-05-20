function notewindow(isempty)
{
	this.node = createNote(isempty);
	this.node.draggable({
		containment : "parent"
	});
}

function createNote(isempty) {
	var $span = $('<span>').addClass('title').attr('contentEditable', true);
	var node = $('<div>').addClass('draggablenote').attr('tabindex', '-1').append($span);

	if(!isempty)
	{
		var $ul = $('<ul>').addClass('myUL').append(getLi());
		node = node.append($ul);
	}

	return node;


}


module.exports = notewindow;
