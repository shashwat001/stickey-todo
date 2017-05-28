/**
 * http://usejsdoc.org/
 */
'use strict';

var notewindow = require('./notewindow');

function Board(savedData)
{
	this.$dom = $('<div>').addClass('board');
	this.$notes = [];
	if(saveData)
	{
		for(let noteData of savedData)
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

Board.prototype.getSerializedData = function()
{
	let boardJsonData = [];
	for(let $note of this.$notes)
	{
		let jsonData = $note.getSerialized();
		boardJsonData.push(jsonData);
	}
	
	return boardJsonData;
}

module.exports = Board;