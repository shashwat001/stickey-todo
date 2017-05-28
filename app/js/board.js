/**
 * http://usejsdoc.org/
 */
'use strict';

var notewindow = require('./notewindow');

function Board(savedData)
{
	this.$dom = $('<div>').addClass('board');
	this.$notes = [];
	if(savedData)
	{
		if(savedData['show'] == true)
		{
			this.show();
		}
		else
		{
			this.hide();
		}
		for(let noteData of savedData['data'])
		{
			addNote.call(this, noteData);
		}
	}
}

Board.prototype.addNewNote = function(noteData)
{
	let $node = addNote.call(this);
	$node.focus();
}

function addNote(noteData)
{
	let note = new notewindow(noteData);
	this.$notes.push(note);
	this.$dom.append(note.node);
	return note.node	;
}

Board.prototype.show = function()
{
	this.shown = true;
	this.$dom.show();
}

Board.prototype.isShown = function()
{
	return this.shown;
}

Board.prototype.hide = function()
{
	this.shown = false;
	this.$dom.hide();
}

Board.prototype.getSerializedData = function()
{
	let boardJsonData = {};
	if(this.isShown() == true)
	{
		boardJsonData['show'] = true;
	}
	let notesJsonData = [];
	for(let $note of this.$notes)
	{
		let jsonData = $note.getSerialized();
		notesJsonData.push(jsonData);
	}
	boardJsonData['data'] = notesJsonData;
	return boardJsonData;
}

module.exports = Board;