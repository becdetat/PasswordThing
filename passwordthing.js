var pwdthing = {};
pwdthing.webdb = {};
pwdthing.webdb.db = null;
pwdthing.webdb.open = function(){
	pwdthing.webdb.db = openDatabase(
		'pwdthing',
		'0.1',
		'Password Thing',
		1024*1024*5);
};
pwdthing.webdb.createTable = function() {
	pwdthing.webdb.db.transaction(function(t) {
		t.executeSql('CREATE TABLE IF NOT EXISTS things(id INTEGER PRIMARY KEY ASC, title, username, password, website)');
	});
};
pwdthing.webdb.dropTable = function(){
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql('DROP TABLE things');
	});
};
pwdthing.webdb.onError = function(tx, error) {
	alert(error.message);
};

pwdthing.thingTemplate = null;

pwdthing.refreshThings = function(){
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql('SELECT * FROM things ORDER BY title', [], function(tx, rx){
			var html = '';
			for (var i = 0; i < rx.rows.length; i ++) {
				var row = rx.rows.item(i);
				html += '<li><a href="#" thing-id="'+row.id+'">'+row.title+'</a></li>';
			}
			$('ul#things')
				.html(html)
				.listview('refresh');			
		});
	});
};

pwdthing.viewID = null;
pwdthing.viewThing = function(id) {
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql('SELECT * FROM things WHERE id = ?', [id], function(tx, rx) {
			if (rx.rows.length == 0) {
				alert('Error loading item');
			} else {
				pwdthing.viewID = id;
				var row = rx.rows.item(0);
				$('#view h1').text(row.title);
				$('#view-username').val(row.username);
				$('#view-password').val(row.password);
				$('#view-website').val(row.website);
				$.mobile.changePage('#view');
			}
		});
	});
};

pwdthing.deleteThing = function(id) {
	if (confirm('Really delete this item?')) {
		pwdthing.webdb.db.transaction(function(t) {
			t.executeSql('DELETE FROM things WHERE id = ?', [id]);
			pwdthing.refreshThings();
			$.mobile.changePage('#home');
		});
	}
	return false;
}

pwdthing.editThing = function(id) {
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql('SELECT * FROM things WHERE id = ?', [id], function(tx, rx) {
			if (rx.rows.length == 0) {
				alert('Error loading item');
			} else {
				pwdthing.viewID = id;
				var row = rx.rows.item(0);
				$('#edit-title').val(row.title);
				$('#edit-username').val(row.username);
				$('#edit-password').val(row.password);
				$('#edit-website').val(row.website);
				$.mobile.changePage('#edit');
			}
		});
	});
};

pwdthing.saveEditedThing = function(id) {
	var title = $('#edit-title').val();
	var username = $('#edit-username').val();
	var password = $('#edit-password').val();
	var website = $('#edit-website').val();
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql(
			'UPDATE things SET title = ?, username = ?, password = ?, website = ? WHERE id = ?',
			[title, username, password, website, id]);
		pwdthing.refreshThings();
		pwdthing.viewThing(id);
	});
};

pwdthing.addAuth = function(){
	var title = $('#add-title').val();
	var username = $('#add-username').val();
	var password = $('#add-password').val();
	var website = $('#add-website').val();
	pwdthing.webdb.db.transaction(function(t){
		t.executeSql(
			'INSERT INTO things(title, username, password, website) VALUES(?, ?, ?, ?)', 
			[title, username, password, website], 
			function(t, r){ },
			function(t, error) {
				alert(error.message);
			}
		);
	});
	pwdthing.refreshThings();
	$.mobile.changePage('#home');
};

pwdthing.resetDB = function() {
	if (confirm('Really reset the database?')) {
		pwdthing.webdb.dropTable();
		pwdthing.webdb.createTable();
		pwdthing.refreshThings();
	}
	return false;
};

$(function(){
	pwdthing.webdb.open();
	pwdthing.webdb.createTable();
	$('#add form').submit(pwdthing.addAuth);
	$('ul#things li a').live('click', function(){
		pwdthing.viewThing($(this).attr('thing-id'));
		return false;
	});
	$('#reset-db').click(pwdthing.resetDB);
	$('#delete').click(function() {
		pwdthing.deleteThing(pwdthing.viewID);
		return false;
	});
	$('#view-website').click(function(){
		var url = $(this).val();
		if (url == '') return;
		if (url.indexOf('http://') == -1) url = 'http://' + url;
		window.open(url);
	});
	$('#edit').click(function(){
		pwdthing.editThing(pwdthing.viewID);
		return false;
	});
	$('#edit form').submit(function(){
		pwdthing.saveEditedThing(pwdthing.viewID);
		return false;
	});
	pwdthing.refreshThings();	
});
