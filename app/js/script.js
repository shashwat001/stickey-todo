//'use strict';

let crypto = require('crypto');

var Board = require('./js/board');

let boards = [];
let currIndex = 0;

var $currentBoard;
let lastFileReadTime, lastFileSavedTime = 0;
let lastFileReadChecksum;

$('document').ready(function() 
{
	loadFile();
	$('#plus').click(function() 
	{
		$currentBoard.addNewNote();
	});
});

$(document).on('keydown','body', function(e)
{
	let keyCode = e.keyCode || e.which;
	if(isCmdOrCtrl(e) && keyCode == KEY_B)
	{
		if(e.shiftKey)
		{
			deleteCurrentBoard();
		}
		else
		{	
			createNewBoard();
		}
	}
	
	else if(e.altKey && keyCode ==  KEY_RIGHT)
	{
		emptyMoveDropdown();
		emptyColorDropdown();
		showNextBoard();
	}
	
	else if(e.altKey && keyCode ==  KEY_LEFT)
	{
		emptyMoveDropdown();
		emptyColorDropdown()
		showPreviousBoard();
	}
});

$(document).on('keydown','#board-name', function(e)
{
	let keyCode = e.keyCode || e.which;
	if(keyCode == KEY_ENTER)
	{
		$currentBoard.setBoardName($(this).val());
		$currentBoard.newFocus();
	}
});

$(document).on('keydown','.move-option-dropdown li', function(e)
{
	let keyCode = e.keyCode || e.which;
	if(keyCode == KEY_TAB || keyCode == KEY_DOWN || keyCode == KEY_UP)
	{
		disableFocusoutMoveOption();
		if(keyCode == KEY_TAB || keyCode == KEY_DOWN)
		{
			
			if($(this).next().length != 0)
			{
				$(this).next().focus();
			}
			else
			{
				$(this).parent().children().first().focus();
			}
		}
		
		else if((e.shiftKey && keyCode == KEY_TAB) || keyCode == KEY_UP)
		{
			if($(this).prev().length != 0)
			{
				$(this).prev().focus();
			}
			else
			{
				$(this).parent().children().last().focus();
			}
		}
		enableFocusoutMoveOption();
		return false;
	}
	
	else if(keyCode == KEY_ENTER)
	{
		let $li = $(this).parent().data('li');
		let newBoardIndex = $(this).data('boardIndex');
		$li.appendTo(boards[newBoardIndex].$dom)
		displayBoard(boards[newBoardIndex]);
		$li.focus();
		return false;
	}
	
	else if(keyCode == KEY_ESCAPE)
	{
		disableFocusoutMoveOption();
		emptyMoveDropdown();
		return false;
	}
});

$(document).on('keydown','.color-option-dropdown li', function(e)
{
	let keyCode = e.keyCode || e.which;
	if(keyCode == KEY_TAB || keyCode == KEY_DOWN || keyCode == KEY_UP)
	{
		disableFocusoutColorOption();
		if(keyCode == KEY_TAB || keyCode == KEY_DOWN)
		{
			
			if($(this).next().length != 0)
			{
				$(this).next().focus();
			}
			else
			{
				$(this).parent().children().first().focus();
			}
		}
		
		else if((e.shiftKey && keyCode == KEY_TAB) || keyCode == KEY_UP)
		{
			if($(this).prev().length != 0)
			{
				$(this).prev().focus();
			}
			else
			{
				$(this).parent().children().last().focus();
			}
		}
		enableFocusoutColorOption();
		return false;
	}
	
	else if(keyCode == KEY_ENTER)
	{
		let $li = $(this).parent().data('li');
		let color = $(this).css('background');
		$li.css('background', color);
		$li.addClass('hascolor');
		$li.focus();
		emptyColorDropdown();
		return false;
	}
	
	else if(keyCode == KEY_ESCAPE)
	{
		emptyColorDropdown();
		return false;
	}
});

function enableFocusoutMoveOption()
{
	$(document).on('blur','.move-option-dropdown', emptyMoveDropdown);
}
function disableFocusoutMoveOption()
{
	$(document).off('blur','.move-option-dropdown', emptyMoveDropdown);
}

function emptyMoveDropdown()
{
	disableFocusoutMoveOption();
	$('.move-option-dropdown').removeData();
	$('.move-option-dropdown').empty();
	$('.move-option-dropdown').hide();
}

function enableFocusoutColorOption()
{
	$(document).on('blur','.color-option-dropdown', emptyColorDropdown);
}
function disableFocusoutColorOption()
{
	$(document).off('blur','.color-option-dropdown', emptyColorDropdown);
}

function emptyColorDropdown()
{
	disableFocusoutColorOption();
	$('.color-option-dropdown').removeData();
	$('.color-option-dropdown').hide();
}

function deleteCurrentBoard()
{
	if(boards.length > 1)
	{
		let boardToRemove = $currentBoard;
		for(let i = currIndex; i < boards.length - 1;i++)
		{
			boards[i] = boards[i+1];
		}
		boards.splice(-1,1);
		showPreviousBoard();
		boardToRemove.$dom.remove();
		boardToRemove = undefined;
	}
}

function createNewBoard()
{	
	let newBoard = createBoard();
	displayBoard(newBoard);
	$('#board-name').val('');
	$('#board-name').focus();
}

function showBoardSelect($li)
{
	$('.move-option-dropdown').show();
	$('.move-option-dropdown').css({top:$li.position().top, left:$li.position().left})
	for(let i = 0;i < boards.length;i++)
	{
		if(i == currIndex)
		{
			continue;
		}
		$('.move-option-dropdown').append($('<li>').attr('tabindex', '-1').text(boards[i].boardName).data('boardIndex', i));
	}
	$('.move-option-dropdown').children().first().focus();
	$('.move-option-dropdown').data('li', $li);
	enableFocusoutMoveOption();
}

function showBoardColorOptionSelect($li)
{
	let top = $li.position().top + $li.closest('.draggablenote').position().top;
	let left = $li.position().left + $li.closest('.draggablenote').position().left;
	$('.color-option-dropdown').show();
	$('.color-option-dropdown').css({top:top, left:left})
	$('.color-option-dropdown').children().first().focus();
	$('.color-option-dropdown').data('li', $li);
	enableFocusoutMoveOption();
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
	$('#board-name').val($currentBoard.boardName);
	$currentBoard.show();
	
/*	if($('.move-option-dropdown').is(":visible"))
	{
		emptyMoveDropdown();
	}*/
}

function showPreviousBoard()
{
	/*if($('.move-option-dropdown').is(":visible"))
	{
		emptyMoveDropdown();
	}*/
	$currentBoard.hide();
	currIndex = (currIndex - 1 + boards.length)%boards.length;
	$currentBoard = boards[currIndex];
	$('#board-name').val($currentBoard.boardName);
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

function saveFile(data)
{
	fs.writeFile(getSaveFilePath(), data, function(error) 
	{
	     if (error) 
	     {
	       console.error("write error:  " + error.message);
	     } 
	     else 
	     {
	    	 lastFileSavedTime = new Date();
	    	 printMessage('Successfully Saved');;
	     }
	});
}

function saveData()
{
	var boardsJsonData = [];
	for(let board of boards)
	{		
		boardsJsonData.push(board.getSerializedData())
	}
	
	var data = JSON.stringify(boardsJsonData);
	let currentChecksum = checksum(data);
	
	saveFile(data);
}

function writeFileIfNotModified(data)
{
	fs.stat(getSaveFilePath(), function(error, stats) 
	{
		if (error) 
		{
			console.error("write error:  " + error.message);
		} 
		else 
		{
			if(stats.mtime <= Math.max(lastFileReadTime, lastFileSavedTime))
			{
				
			}
			else
			{
				loadFile();
			}
		}
	});
}

function loadFile()
{
	fs.readFile(getSaveFilePath(), 'utf8', function (err,data) 
	{
		if (err) 
		{
		    createNewBoard();
		    return;
		}
		cleanUp();
		lastFileReadChecksum = checksum(data);
		var jsonObj = JSON.parse(data);

		for(let boardData of jsonObj)
  		{
  			createBoard(boardData);
  		}
		initParameters();
	});
}

function cleanUp()
{
	$('#boards').empty();
	for(let board of boards)
	{
		board = undefined;
	}
	boards.length = 0;
}

function initParameters()
{
	lastFileReadTime = new Date();
	for(let i = 0;i < boards.length;i++)
	{
		let board = boards[i];
		if(board.isShown() == true)
		{
			board.show();
			$currentBoard = board;
			currIndex = i;
			$('#board-name').val($currentBoard.boardName);
		}
		else
		{
			board.hide();
		}
	}

}

function checksum (str) 
{
    return crypto
        .createHash('sha1')
        .update(str, 'utf8')
        .digest('hex');
}