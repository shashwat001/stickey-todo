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
	}).bind("keydown", function(e) {
		console.log($(this)[0])
		var keyCode = e.keyCode || e.which; 

		if (keyCode == 13) {
			var $newLi = getLi();
			$(this).after($newLi);
			$newLi.focus();
			return false; // ignore default event
		}
		if (keyCode == 9) {
			e.preventDefault();
			console.log('Tab pressed: moving it');
			if(e.shiftKey)
			{
				moveAfterParent($(this));
			}
			else
			{				
				moveToParent($(this));
			}
//			$(this).appendTo($(this).prev());

			return false; // ignore default event
		}
	}).focusout(function(e) {
		e.stopPropagation();
		console.log(e.keyCode);
		console.log('focusout');
		if(isEmpty($(this)) && $(this).siblings().size() != 0)
		{
			$(this).remove();
		}
		return false;
	})
}

function moveToParent($obj)
{
	var $prev = $obj.prev();
	if($prev.length == 0)
		return;
	var $ul;
	if($prev.children('ul').length == 0)
	{		
		$ul = $('<ul>').addClass('myUL');
		$prev.append($ul);
	}
	else
	{
		$ul = $prev.children('ul')[0];
	}
	
	$obj.appendTo($ul);
	
}

function moveAfterParent($obj)
{
	var $parUL = $obj.parent('ul');
	var $parLI = $parUL.parent('li');
	
	if($parLI.length == 0)
		return;
	
	$obj.insertAfter($parLI);
	if($parUL.child('li').length == 0)
		$parUL.remove();
}

function isEmpty( el ){
	return !$.trim(el.text())
}

module.exports = notewindow;
