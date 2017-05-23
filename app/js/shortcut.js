/**
 * http://usejsdoc.org/
 */
'use strict';

const {
	ipcRenderer,
	remote
}  = require('electron');

const fs = require('fs');

$(document).ready(function(){	
	$( "#tabs" ).tabs();
	
	loadSettings();
	
	$('form').submit(function(){
		let settings = $(this).serializeArray();
		let jsonData = {}
		for(let pair of settings)
		{
			jsonData[pair['name']] = pair['value'];
		}
		
		
		let saveSettingsFilePath = remote.getGlobal('settingsfilepath');
		
		fs.writeFile(saveSettingsFilePath, JSON.stringify(jsonData), function(error) {
		     if (error) {
		       console.error("write error:  " + error.message);
		     } else {
		    	 ipcRenderer.send('load-settings');
		     }
		});
		
		
	});
	
	$('form input[name=path]').dblclick(function(){
		let dir = remote.dialog.showOpenDialog({properties: ['openDirectory']});
		$(this).val(dir);
	})
	.click(function(){
		$(this).select();
	})
});

function loadSettings()
{
	let json = remote.getGlobal('settings');
	for(let key in json)
	{
		$('form input[name=' + key + ']').val(json[key]);
	}
}

ipcRenderer.on('settings-loaded', (event, arg) => {
	loadSettings();
});