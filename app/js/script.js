var notewindow = require('./js/notewindow');
$('document').ready(function() {
	$('#plus').click(function() {
		$('#notes').append(new notewindow().node);
	});

});

