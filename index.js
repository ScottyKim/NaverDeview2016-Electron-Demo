'use strict';
const electron = require('electron');

const app = electron.app;
const ipc = electron.ipcMain;

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 800
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	try{
		// 좀 허접하게 처리 했습니다. -ㅁ-);;;
		require('devtron').install();
	}catch(error){
		// 예제니깐..후후훗.
	}

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

ipc.on('deview-2016-hello', (event, arg) => {
	event.sender.send('deview-2016-print', 'Hello Deview 2016! IPC Example');
});

class RectCommand {
	constructor(){}
	execute (commandObj){
		commandQueue.insert({
			'command' : this,
			'executeValue': commandObj
		});
		let executeValue = {id: commandObj.id ,
					parameter: commandObj.parameter, value: commandObj.newValue};
		return executeValue;
	}
	undo (commandObj){
		let executeValue = {id: commandObj.id ,
					parameter: commandObj.parameter, value: commandObj.oldValue};
		return executeValue;
	}
}

class CommandQueue {
	constructor(){
		this.queue = [];
	}
	insert(commandObj){
		this.queue.push(commandObj);
	}
	delete(){
		let lastCommand = this.queue[this.queue.length-1];
		this.queue.pop();
		return lastCommand.command.undo(lastCommand.executeValue);
	}
}

let deviewDemoCommand = new RectCommand;
let commandQueue = new CommandQueue;
ipc.on('rect-add', (event, arg) => {
	event.sender.send('add-canvas-rect', deviewDemoCommand.execute(arg));
});
ipc.on('rect-delete', (event, arg) => {
	event.sender.send('delete-canvas-rect', deviewDemoCommand.execute(arg));
});
ipc.on('edit-rect', (event, arg) => {
	event.sender.send('edit-canvas-rect', deviewDemoCommand.execute(arg));
});
ipc.on('move-undo', (event, arg) => {
	event.sender.send('edit-canvas-rect', commandQueue.delete());

});
