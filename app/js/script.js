'use strict';

var Board = require('./js/board');

var $currentBoard;

$('document').ready(function() 
{
	loadFile();
//	createNewBoard();
	$('#plus').click(function() 
	{
		$currentBoard.addNewNote();
	});
});

function createNewBoard()
{
	$currentBoard = new Board();
	$('#boards').append($currentBoard.$dom);
}

const {
	ipcRenderer,
	remote
}  = require('electron');

ipcRenderer.on('saveData', function(arg) {
    saveData();
});

ipcRenderer.on('open-new-note', function(arg) {
    $('#plus').trigger('click');
});

var fs = require("fs");

function printMessage(message)
{
	$('#message-box').text(message).fadeIn('slow');;
	$('#message-box').delay(2000).fadeOut('slow');
}

function getSaveFilePath()
{
	let path;
	if(remote.getGlobal('settings') && remote.getGlobal('settings').path)
	{
		path = remote.getGlobal('settings').path + '/todo-app.json';
	}
	else
	{
		path = remote.getGlobal('settingspath') + '/todo-app.json';
	}
	return path;
}

function saveData()
{
	
	var boardsJsonData = [];
// $('.draggablenote').each(function(e){
// let jsonData = notewindow.getSerialized($(this));
// boardsJsonData.push(jsonData);
// });
	boardsJsonData.push($currentBoard.getSerializedData())
	
	var data = JSON.stringify(boardsJsonData);
	fs.writeFile(getSaveFilePath(), data, function(error) {
	     if (error) {
	       console.error("write error:  " + error.message);
	     } else {
	    	 printMessage('Successfully Saved');;
	     }
	});
}

function loadFile()
{
	fs.readFile(getSaveFilePath(), 'utf8', function (err,data) 
	{
		if (err) 
		{
		    console.log(err);
		    createNewBoard();
		    return;
		}
		var jsonObj = JSON.parse(data);
		console.log(jsonObj);

		for(let boardData of jsonObj)
  		{
			console.log(boardData)
  			$currentBoard = new Board(boardData);
			$('#boards').append($currentBoard.$dom);
  		}
	});
}



