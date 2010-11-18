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
		t.executeSql('SELECT * FROM things', [], function(tx, rx){
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
				alert('Error loading thing');
			} else {
				pwdthing.viewID = id;
				var row = rx.rows.item(0);
				$('#view-title').val(row.title);
				$('#view-username').val(row.username);
				$('#view-password').val(row.password);
				$('#view-website').val(row.website);
				$.mobile.changePage('#view');
			}
		});
	});
};

pwdthing.deleteThing = function(id) {
	if (confirm('Really delete?')) {
		pwdthing.webdb.db.transaction(function(t) {
			t.executeSql('DELETE FROM things WHERE id = ?', [id]);
			pwdthing.refreshThings();
			$.mobile.changePage('#home');
		});
	}
	return false;
}

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
	pwdthing.refreshThings();	
});
