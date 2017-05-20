

function notewindow(savedData)
{
	if(savedData)
	{
		this.node = createNote(true);
		populateNode.call(this,savedData);
	}
	else
	{
		this.node = createNote();
	}
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

function getLi(text)
{
	var $li = $('<li>').addClass('edit-list');
	var $span = $('<span>').addClass('edit-list-span')
	.attr('contentEditable', true);
	if(text)
	{
		$span = $span.text(text);
	}
	
	return $li.append($span);
}


function populateNode(noteData)
{
	let noteDiv = this.node;
	noteDiv.append(getDataHtml(noteData['data']));
	noteDiv.children('span').text(noteData['title']);
	noteDiv.css({
		top: noteData['position']['top'],
		left:noteData['position']['left']
	});

}

function getDataHtml(ulDataArray)
{
	if(ulDataArray.length == 0)
		return;
	let $ul = $('<ul>').addClass('myUL');
	for(let liData of ulDataArray)
	{
		let text = liData['text'];
		let innerUL = liData['data'];
		let $li = getLi(text);
		$li.append(getDataHtml(innerUL));
		$ul.append($li);
	}
	return $ul;
}


module.exports = notewindow;



$(document).on('keydown', '.title', function(e) {
	var keyCode = e.keyCode || e.which;
	if(keyCode == 40 && e.ctrlKey)
	{
		$(this).next('ul').children('li').first().children('span').focus();
	}
	else if (keyCode == 27) //escape
	{
		$(this).blur();
		$(this).closest('.draggablenote').focus();
		return false;
	}
});

$(document).on('keydown', '.edit-list-span', function(e) {

	var keyCode = e.keyCode || e.which; 
	
	if(keyCode >= 37 && keyCode <= 40) //arrows
	{
		e.stopPropagation();
		handleKeyPress.call(this, e);
	}
	
	if (keyCode == 27) //escape
	{
		$(this).blur();
		$(this).closest('.draggablenote').focus();
		return false;
	}

	if (keyCode == 13) //enter
	{
		if(e.ctrlKey)
		{
			var $newLi = getLi();
			$(this).parent('li').after($newLi);
			$newLi.children('span').focus();
			return false;
		}
	}
	if (keyCode == 9) //tab
	{
		if(e.shiftKey)
		{
			moveAfterParent($(this));
			$(this).focus();
			return false;
		}
		else
		{	
			moveInsidePrevSibling($(this));
			$(this).focus();
			return false;
		}
	}
});

$(document).on('click', '.edit-list-span', function(e) {
	$(this).focus();
});

$(document).on('dblclick', '.edit-list-span, .title', function(e) {
	$(this).focus();
	e.stopPropagation();
});

$(document).on('click', '.draggablenote', function(e) {
	$(this).draggable({ disabled: true });
	$(this).css( 'cursor', 'text' );
});

$(document).on('dblclick', '.draggablenote', function(e) {
	$(this).draggable({ disabled: false });
	$(this).css( 'cursor', 'move' );
});

$(document).on('keydown', '.draggablenote', function(e) {

	if(this == e.target)
	{
		var keyCode = e.keyCode || e.which; 
		
		if(keyCode >= 37 && keyCode <= 40)
		{
			if(e.ctrlKey)
			{
				let offset = 15;
				if(keyCode == 37)
				{
					$(this).css('left', '-=' + offset)
				}
				else if(keyCode == 38)
				{
					$(this).css('top', '-=' + offset)
				}
				else if(keyCode == 39)
				{
					$(this).css('left', '+=' + offset)
				}
				else if(keyCode == 40)
				{
					$(this).css('top', '+=' + offset)
				}
			}
			return false;
		}
		else if (keyCode == 9) //tab
		{
			if(e.shiftKey)
			{
				$(this).prev('.draggablenote').focus();
				return false;
			}
			else
			{	
				$(this).next('.draggablenote').focus();
				return false;
			}
		}
		
		else if(keyCode == 13)
		{		
			$(this).children('.title').focus();
			return false;
		}
		
		else if(keyCode == 68) //d
		{
			if(e.ctrlKey)
			{
				$(this).remove();
				$('.draggablenote').first().focus();
				return false;
			}
		}
	}
});

function moveInsidePrevSibling($obj)
{
	var $prev = $obj.parent('li').prev();
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
	
	 $obj.parent('li').appendTo($ul);
	
}

function moveAfterParent($obj)
{
	var $parUL = $obj.parent('li').parent('ul');
	var $parLI = $parUL.parent('li');
	
	if($parLI.length == 0)
		return;
	
	$obj.parent('li').insertAfter($parLI);
	if($parUL.children('li').length == 0)
		$parUL.remove();
}

function handleKeyPress(e)
{
	var keyCode = e.keyCode || e.which;
	
	if(e.ctrlKey && e.shiftKey)
	{
		if(keyCode == 40)
		{
			shiftDown($(this).parent('li'));
		}
		else if(keyCode == 38)
		{
			shiftUp($(this).parent('li'));
		}
	}
	else if(e.ctrlKey)
	{
		if(keyCode == 40)
		{
			let $nextLi = getNextList($(this).parent('li'), false);
			console.log($nextLi);
			if($nextLi)
			{
				$nextLi.children('span').focus();
			}
		}
		else if(keyCode == 38)
		{
			let $prevLi = getPreviousList($(this).parent('li'), false);
			console.log($prevLi);
			if($prevLi.length != 0)
			{
				$prevLi.children('span').focus();
			}
			else
			{
				$(this).parent('li').parent('ul').prev('span').focus();
			}
		}
	}
}

function getNextList($li, moveUp)
{
	if(!moveUp && $li.children('ul').length != 0)	
	{
		return $li.children('ul').children('li').first();
	}

	else if($li.next('li').length != 0)
	{
		return $li.next('li');
	}
	else if($li.parent('ul').parent('li').length != 0)
	{
		return getNextList($li.parent('ul').parent('li'), true);
	}
	return ;
}

function getPreviousList($li, moveDown)
{

	if(moveDown)
	{
		if($li.children('ul').length != 0)
		{
			return getPreviousList($li.children('ul').children('li').last(), true);
		}
		return $li;
	}

	if($li.prev('li').length != 0)
	{
		return getPreviousList($li.prev('li'), true);
	}
	else
	{
		return $li.parent('ul').parent('li');
	}
}

function shiftUp($li)
{
	if($li.prev().length != 0)
	{
		$li.insertBefore($li.prev());
	}
	$li.children('span').focus();
}

function shiftDown($li)
{
	if($li.next().length != 0)
	{
		$li.insertAfter($li.next());
	}
	$li.children('span').focus();
}