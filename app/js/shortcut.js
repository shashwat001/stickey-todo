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
	$('form').submit(function(){
		let settings = $(this).serializeArray();
		let jsonData = {}
		for(let pair of settings)
		{
			jsonData[pair['name']] = pair['value'];
		}
		let saveSettingsDir = jsonData['path'] + '/.todoconfig';
		
		if (!fs.existsSync(saveSettingsDir)){
		    fs.mkdirSync(saveSettingsDir, function(error){
		    	if(error)
	    		{
		    		console.error('cannot create dir');
	    		}
		    });
		}
		
		fs.writeFile(saveSettingsDir + '/settings.json', JSON.stringify(jsonData), function(error) {
		     if (error) {
		       console.error("write error:  " + error.message);
		     } else {
		     }
		});
		
		
	});
});