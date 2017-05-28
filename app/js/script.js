'use strict';

var Board = require('./js/board');

let boards = [];
let currIndex = 0;

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

$(document).on('keydown','body', function(e)
{
	let keyCode = e.keyCode || e.which;
	if(e.ctrlKey && keyCode == KEY_B)
	{
		console.log('new board request');
		let newboard = createNewBoard();
	}
	
	else if(e.ctrlKey && e.altKey && keyCode ==  KEY_RIGHT)
	{
		showNextBoard();
	}
});

function createNewBoard()
{	
	let newBoard = createBoard();
	displayBoard(newBoard);
}

function displayBoard(boardToShow)
{
	for(let i = 0;i < boards.length;i++)
	{
		let board = boards[i];
		if(boardToShow == board)
		{
			board.show();
			$currentBoard = board;
			currIndex = i;
		}
		else
		{
			board.hide();
		}
	}
}

function showNextBoard()
{
	$currentBoard.hide();
	currIndex = (currIndex + 1)%boards.length;
	$currentBoard = boards[currIndex];
	$currentBoard.show();
}

function showPreviousBoard()
{
	$currentBoard.hide();
	currIndex = (currIndex - 1 + boards.length)%boards.length;
	$currentBoard = boards[currIndex];
	$currentBoard.show();
}

function createBoard(boardData)
{
	let newBoard = new Board(boardData);
	boards.push(newBoard);
	$('#boards').append(newBoard.$dom);
	return newBoard;
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
	for(let board of boards)
	{		
		boardsJsonData.push(board.getSerializedData())
	}
	
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
  			createBoard(boardData);
  		}
		initParameters();
	});
}

function initParameters()
{
	for(let i = 0;i < boards.length;i++)
	{
		let board = boards[i];
		if(board.isShown() == true)
		{
			board.show();
			$currentBoard = board;
			currIndex = i;
		}
		else
		{
			board.hide();
		}
	}

}


