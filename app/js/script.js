var notewindow = require('./js/notewindow');

function isEmpty( el ){
	return !$.trim(el.text())
}

function getLi()
{
	return $('<li>').addClass('edit-list')
	.attr('contentEditable', true);
}


$('document').ready(function() {
	$('#plus').click(function() {
		$('#notes').append(new notewindow().node);
	});

});

$(document).on('keydown', '.edit-list', function(e) {

	var keyCode = e.keyCode || e.which; 

	if (keyCode == 13) {
		var $newLi = getLi();
		$(this).after($newLi);
		$newLi.focus();
		return false;
	}
	if (keyCode == 9) {
		if(e.shiftKey)
		{
			console.log('shift tab ');
			console.log(this);
			console.log(e.target);
			moveAfterParent($(this));
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

$(document).on('focusout', '.edit-list', function(e) {
		e.stopPropagation();
		e.preventDefault();
		console.log('focusout');
		if(isEmpty($(this)) && $(this).siblings().size() != 0)
		{
			$(this).remove();
		}
		return false;
});

$(document).on('click', '.edit-list', function(e) {
		$(this).focus();
});

function moveInsidePrevSibling($obj)
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
	
	// $obj.appendTo($ul);
	$ul.append($obj);
	
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

