function notewindow()
{
	this.node = createNote();
	this.node.draggable({
		containment : "parent"
	});
	this.node.dblclick(function(){
		$(this).draggable({ disabled: false });
	});
	this.node.click(function(){
		$(this).draggable({ disabled: true });
	});
}

function createNote() {
	var $span = $('<span>').addClass('title').attr('contentEditable', true);
	var $ul = $('<ul>').addClass('myUL').append(getLi());

	var node = $('<div>').addClass('draggablenote').append($span).append($ul);
	return node;


}


module.exports = notewindow;
