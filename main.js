'use strict';

const {
	app,
	BrowserWindow,
	ipcMain
}  = require('electron');

const electronLocalshortcut = require('electron-localshortcut');

app.on('ready', createWindow);
//app.on('before-quit', saveData);

let mainWindow;

function createWindow(){
	mainWindow = new BrowserWindow({width: 800, height:600});
	mainWindow.loadURL('file://' + __dirname + '/app/main.html');
	
	electronLocalshortcut.register(mainWindow,'ctrl+S', () => {
	    mainWindow.webContents.send('global-shortcut', 'saveData');
	  }) 
	mainWindow.webContents.openDevTools();
}