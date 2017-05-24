'use strict';

var notewindow = require('./js/notewindow');

$('document').ready(function() {
	loadFile();
	$('#plus').click(function() {
		let $node = new notewindow().node
		$('#notes').append($node);
		$node.focus();
	});
});

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

let webContents = remote.getCurrentWebContents();

function printMessage(message)
{
	$('#message-box').text(message).fadeIn('slow');;
	$('#message-box').delay(2000).fadeOut('slow');
}

$(document).on('keydown', 'body', function(e) {
	let keyCode = e.keyCode || e.which;
	if(keyCode == KEY_F && e.ctrlKey)
	{
		$('#search-input').focus();
	}
	console.log(webContents.findInPage('SSL'));
});

webContents.on('found-in-page', (event, result) => {
		console.log(result.selectionArea.height)
		console.log(result.selectionArea.width)
		console.log(result.selectionArea.x)
		console.log(result.selectionArea.y)
	  if (result.finalUpdate) webContents.stopFindInPage('clearSelection')
})


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
	
	var notesJsonData = [];
	$('.draggablenote').each(function(e){
		let jsonData = notewindow.getSerialized($(this));
		notesJsonData.push(jsonData);
	});
	var data = JSON.stringify(notesJsonData);
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
	fs.readFile(getSaveFilePath(), 'utf8', function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  var jsonObj = JSON.parse(data);

		  for(let noteData of jsonObj)
	  		{
	  			let noteDiv = new notewindow(noteData).node
  				$('#notes').append(noteDiv);
	  		}

		});

}



