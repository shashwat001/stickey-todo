function notewindow()
{
	this.node = createNote();
	this.node.draggable({
		containment : "parent"
	});
}

function createNote() {
	return $('<div>').addClass('draggablenote');
}

module.exports = notewindow;
