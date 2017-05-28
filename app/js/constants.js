/**
 * http://usejsdoc.org/
 */


'use strict'

let KEY_TAB = 9;
let KEY_ENTER = 13;
let KEY_ESCAPE = 27;
let KEY_SPACE = 32;
let KEY_LEFT = 37;
let KEY_UP = 38;
let KEY_RIGHT = 39;
let KEY_DOWN = 40;
let KEY_B = 66;
let KEY_D = 68;
let KEY_H = 72;
let KEY_M = 77;

function isCmdOrCtrl(e)
{
	return e.ctrlKey || isCommandPressed(e);
}

function isCommandPressed(event) 
{
	return event.metaKey && ! event.ctrlKey;
}