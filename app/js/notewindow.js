function notewindow()
{
	this.node = createNote();
	this.node.draggable({
		containment : "parent"
	});
	this.node.dblclick(function(){
		$(this).draggable({ disabled: false });
	});
	this.node.click(function(){
		$(this).draggable({ disabled: true });
	});
}

function createNote() {
	var html = '<span class="title" contentEditable ></span>';
	html += '<ul class="myUL">';
	html += '<li class="edit-list" contentEditable >test content</li>';
	html += '</ul>';
	var node = $('<div>').addClass('draggablenote').html(html);
	$(node).find('li').each(function(){
		$(this).click(function(ev){
			$(this).focus();
		})
	});
	
	return node;
	
	
}

module.exports = notewindow;
