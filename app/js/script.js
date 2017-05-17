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

	if (keyCode == 13) 
	{
		var $newLi = getLi();
		$(this).parent('li').after($newLi);
		$newLi.children('span').focus();
		return false;
	}
	if (keyCode == 9) 
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
	ipcRenderer,
	remote
}  = require('electron');

ipcRenderer.on('global-shortcut', function(arg) {
    saveData();
});

var fs = require("fs");
var path = remote.app.getPath("home") + '/todo-app.txt';


function saveData()
{
	console.log('first reached');
	var notesJsonData = [];
	$('.draggablenote').each(function(e){
		console.log('reached');
		console.log($(this).position());
		var jsonData = {};
		jsonData['position'] = {'left' : $(this).position().left,
								'right': $(this).position().top};
		jsonData['data'] = getData($(this).children('ul'));
		notesJsonData.push(jsonData);
	});
	var data = JSON.stringify(notesJsonData);
	fs.writeFile(path, data, function(error) {
	     if (error) {
	       console.error("write error:  " + error.message);
	     } else {
	       console.log("Successful Write to " + path);
	     }
	});
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
		returnArray.push(liJson);
	});
	return returnArray;
}

function loadFile()
{
	fs.readFile(path, 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  console.log(data);
		});
}