'use strict';

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
	
	let $icon = $('<span>').addClass('subtask-icon');
	$li.append($icon).append($span);
	return $li;
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
		if(liData['isDone'])
		{
			markTaskDone($li);
		}
		let $innerULObj = getDataHtml(innerUL);
		if($innerULObj)
		{			
			$li.append($innerULObj);
			addSubTaskMarker($li);
		}
		$ul.append($li);
	}
	return $ul;
}

notewindow.getSerialized = function($noteWindowObj)
{
	var jsonData = {};
	jsonData['position'] = {'left' : $noteWindowObj.position().left,
							'top': $noteWindowObj.position().top};
	jsonData['title'] = $noteWindowObj.children('span').text();
	jsonData['data'] = getData($noteWindowObj.children('ul'));
	return jsonData;
}

function getData($ulObj)
{
	var returnObj = getLiListData($ulObj.children('li'));
	return returnObj;
}

function getLiListData($liList)
{	var returnArray = [];
	$liList.each(function(e){
		var liJson = {};
		liJson['text'] = $(this).children('span').text();
		liJson['data'] = getData($(this).children('ul'));
		if($(this).data('done'))
		{
			liJson['isDone'] = true;
		}
		returnArray.push(liJson);
	});
	return returnArray;
}

module.exports = notewindow;



$(document).on('keydown', '.title', function(e) {
	var keyCode = e.keyCode || e.which;
	if(keyCode == KEY_DOWN && e.ctrlKey)
	{
		$(this).next('ul').children('li').first().children('span').focus();
	}
	else if (keyCode == KEY_ESCAPE) //escape
	{
		$(this).blur();
		$(this).closest('.draggablenote').focus();
		return false;
	}
});

function taskHasSibling($task)
{
	if($task.parent('li').siblings('li').length != 0)
		return true;
	return false;
}

$(document).on('keydown', '.edit-list-span', function(e) {

	var keyCode = e.keyCode || e.which; 
	
	if(keyCode >= KEY_LEFT && keyCode <= KEY_DOWN) //arrows
	{
		e.stopPropagation();
		handleKeyPress.call(this, e);
	}
	
	else if (keyCode == KEY_ESCAPE) //escape
	{
		$(this).blur();
		$(this).closest('.draggablenote').focus();
		return false;
	}

	else if (keyCode == KEY_ENTER) //enter
	{
		if(e.ctrlKey)
		{
			var $newLi = getLi();
			$(this).parent('li').after($newLi);
			$newLi.children('span').focus();
			return false;
		}
		else if(e.shiftKey)
		{
			let $parLi = $(this).parent('li');
			toggleSubTaskMarker($parLi);
			return false;
		}
	}
	else if (keyCode == KEY_TAB) //tab
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
	else if(keyCode == KEY_D && e.ctrlKey)
	{
		focusPrevious.call(this);
		if($(this).siblings().length == 0)
		{
			$(this).parent('li').parent('ul').remove();
		}
		else
		{
			$(this).parent('li').remove();
		}
	}
	else if(keyCode == KEY_SPACE && e.ctrlKey)
	{
		markTaskDone($(this).parent('li'));
	}
});

function toggleSubTaskMarker($li)
{
	if($li.children('ul').length == 0)
		return;
	if($li.children('.subtask-icon').hasClass('expand-icon'))
	{
		removeSubTaskMarker($li);
		addSubTaskMarker($li, 'right');
		$li.children('ul').hide();
	}
	else if($li.children('.subtask-icon').hasClass('collapse-icon'))
	{
		removeSubTaskMarker($li);
		addSubTaskMarker($li, 'down');
		$li.children('ul').show();
	}
}

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
		
		if(keyCode >= KEY_LEFT && keyCode <= KEY_DOWN)
		{
			if(e.ctrlKey)
			{
				let offset = 15;
				if(keyCode == KEY_LEFT)
				{
					$(this).css('left', '-=' + offset)
				}
				else if(keyCode == KEY_UP)
				{
					$(this).css('top', '-=' + offset)
				}
				else if(keyCode == KEY_RIGHT)
				{
					$(this).css('left', '+=' + offset)
				}
				else if(keyCode == KEY_DOWN)
				{
					$(this).css('top', '+=' + offset)
				}
			}
			return false;
		}
		else if (keyCode == KEY_TAB) //tab
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
		
		else if(keyCode == KEY_ENTER)
		{		
			$(this).children('.title').focus();
			return false;
		}
		
		else if(keyCode == KEY_D) //d
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
		addSubTaskMarker($prev);
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
	{
		removeSubTaskMarker($parLI);
		$parUL.remove();
	}
}

function removeSubTaskMarker($li)
{
	$li.children('.subtask-icon').removeClass('expand-icon').empty();
}

function addSubTaskMarker($li, direction)
{
	if(direction === 'right')
	{
		$li.children('.subtask-icon').removeClass('expand-icon').addClass('collapse-icon').append(getImg('right'));
	}
	else
	{
		$li.children('.subtask-icon').removeClass('collapse-icon').addClass('expand-icon').append(getImg('down'));
	}
}

function getImg(direction)
{
	if(direction === 'down')
		return $('<img>').addClass('expand-image').attr('src', 'images/down.png');
	else
		return $('<img>').addClass('expand-image').attr('src', 'images/right.png');
}

function handleKeyPress(e)
{
	var keyCode = e.keyCode || e.which;
	
	if(e.ctrlKey && e.shiftKey)
	{
		if(keyCode == KEY_DOWN)
		{
			shiftDown($(this).parent('li'));
		}
		else if(keyCode == KEY_UP)
		{
			shiftUp($(this).parent('li'));
		}
	}
	else if(e.ctrlKey)
	{
		if(keyCode == KEY_DOWN)
		{
			let $nextLi = getNextList($(this).parent('li'), false);
			console.log($nextLi);
			if($nextLi)
			{
				$nextLi.children('span').focus();
			}
		}
		else if(keyCode == KEY_UP)
		{
			focusPrevious.call(this)
		}
	}
}

function focusPrevious()
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

function markTaskDone($parentLi)
{
	if(!$parentLi.data('done'))
	{
		$parentLi.css('color', '#888888').css('text-decoration', 'line-through');
		$parentLi.data('done', true)
	}
	else
	{
		$parentLi.removeAttr('style');
		$parentLi.removeData('done');
	}
}