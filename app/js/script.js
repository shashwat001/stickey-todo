var notewindow = require('./js/notewindow');

function isEmpty( el ){
	return !$.trim(el.text())
}

function getLi()
{
	var $li = $('<li>').addClass('edit-list');
	var $span = $('<span>').addClass('edit-list-span')
	.attr('contentEditable', true);
	
	return $li.append($span);
}


$('document').ready(function() {
	$('#plus').click(function() {
		$('#notes').append(new notewindow().node);
	});

});

$(document).on('keydown', '.edit-list-span', function(e) {

	var keyCode = e.keyCode || e.which; 

	if (keyCode == 13) {
		var $newLi = getLi();
		$(this).parent('li').after($newLi);
		$newLi.children('span').focus();
		return false;
	}
	if (keyCode == 9) {
		if(e.shiftKey)
		{
			console.log('shift tab ');
			console.log(this);
			console.log(e.target);
			moveAfterParent($(this));
			return false;
		}
		else
		{	
			console.log('tab ');
			console.log(this);
			moveInsidePrevSibling($(this));
			return false;
		}
	}
});

$(document).on('focusout', '.edit-list-span', function(e) {
		e.stopPropagation();
		e.preventDefault();
		console.log('focusout');
		if(isEmpty($(this)) && $(this).siblings().size() != 0)
		{
			$(this).remove();
		}
		return false;
});

$(document).on('click', '.edit-list-span', function(e) {
		console.log(this);
		e.stopPropagation();
//		this.contentEditable = true;
		$(this).focus();
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

const {
	ipcRenderer
}  = require('electron');

ipcRenderer.on('global-shortcut', function(arg) {
    saveData();
});

function saveData()
{
	console.log('first reached');
	$('.draggablenote').each(function(e){
		console.log('reached');
		console.log($(this).position())
		});
}