'use strict';

const {
	app,
	BrowserWindow,
	ipcMain
}  = require('electron');

const electronLocalshortcut = require('electron-localshortcut');

app.on('ready', createWindow);
app.on('will-quit', cleanUp);
app.on('window-all-closed', function(){
    app.quit();
});
//app.on('before-quit', saveData);

let mainWindow;

function createWindow(){
	mainWindow = new BrowserWindow();
	mainWindow.maximize();
	
	mainWindow.loadURL('file://' + __dirname + '/app/main.html');
	
	electronLocalshortcut.register(mainWindow,'ctrl+S', () => {
	    mainWindow.webContents.send('saveData');
	  }) 
	electronLocalshortcut.register(mainWindow,'ctrl+T', () => {
	    mainWindow.webContents.send('open-new-note');
	  }) 
	electronLocalshortcut.register(mainWindow,'ctrl+N', () => {
	    showShortcuts();
	  })
//	mainWindow.webContents.openDevTools();
}

function showShortcuts()
{
	let settingsWindow = new BrowserWindow({frame:false, parent: mainWindow, modal: true, show: false});
	settingsWindow.loadURL('file://' + __dirname + '/app/shortcuts.html');
	settingsWindow.once('ready-to-show', () => {
		settingsWindow.show()
		})
}


function cleanUp()
{
	electronLocalshortcut.unregisterAll();
}