function notewindow(isempty)
{
	this.node = createNote(isempty);
	this.node.draggable({
		containment : "parent"
	});
	this.node.dblclick(function(){
		$(this).draggable({ disabled: false });
		$(this).css( 'cursor', 'move' );
	});
	this.node.click(function(){
		$(this).draggable({ disabled: true });
		$(this).css( 'cursor', 'text' );
	});
}

function createNote(isempty) {
	var $span = $('<span>').addClass('title').attr('contentEditable', true);
	var node = $('<div>').addClass('draggablenote').append($span);

	if(!isempty)
	{
		var $ul = $('<ul>').addClass('myUL').append(getLi());
		node = node.append($ul);
	}

	return node;


}


module.exports = notewindow;
