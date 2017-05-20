var notewindow = require('./js/notewindow');

function isEmpty( el ){
	return !$.trim(el.text())
}



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
var path = remote.app.getPath("home") + '/todo-app.txt';


function saveData()
{
	var notesJsonData = [];
	$('.draggablenote').each(function(e){
		var jsonData = {};
		jsonData['position'] = {'left' : $(this).position().left,
								'top': $(this).position().top};
		jsonData['title'] = $(this).children('span').text();
		jsonData['data'] = getData($(this).children('ul'));
		notesJsonData.push(jsonData);
	});
	var data = JSON.stringify(notesJsonData);
	fs.writeFile(path, data, function(error) {
	     if (error) {
	       console.error("write error:  " + error.message);
	     } else {
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
		  var jsonObj = JSON.parse(data);

		  for(let noteData of jsonObj)
	  		{
	  			let noteDiv = new notewindow(noteData).node
  				$('#notes').append(noteDiv);
	  		}

		});

}



