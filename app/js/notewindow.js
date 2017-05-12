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

function getLi()
{
	return $('<li>').addClass('edit-list')
	.attr('contentEditable', true)
	.click(function(ev){
		$(this).focus();
	}).bind("keypress", function(e) {
		if (e.keyCode == 13) {
			var $newLi = getLi();
			$(this).after($newLi);
			$newLi.focus();
			return false; // ignore default event
		}
	}).focusout(function(e) {
		if(isEmpty($(this)))
		{
			$(this).remove();
		}
	});
}

function isEmpty( el ){
    return !$.trim(el.text())
}

module.exports = notewindow;
