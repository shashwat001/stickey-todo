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

function printMessage(message)
{
	$('#message-box').text(message).fadeIn('slow');;
	$('#message-box').delay(2000).fadeOut('slow');
}

function saveData()
{
	var path = remote.getGlobal('settings').path + '/todo-app.json';
	var notesJsonData = [];
	$('.draggablenote').each(function(e){
		let jsonData = notewindow.getSerialized($(this));
		notesJsonData.push(jsonData);
	});
	var data = JSON.stringify(notesJsonData);
	fs.writeFile(path, data, function(error) {
	     if (error) {
	       console.error("write error:  " + error.message);
	     } else {
	    	 printMessage('Successfully Saved');;
	     }
	});
}

function loadFile()
{
	var path = remote.getGlobal('settings').path + '/todo-app.json';
	fs.readFile(path, 'utf8', function (err,data) {
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



