<?php
include('lib/Dropbox-0.4.0/Dropbox/autoload.php');

if (!is_uploaded_file($_FILES['file']['tmp_name'])) {
	// TODO: make this return a 301 for ajax
	echo('Error with password backup file');
	die();
}

$key = 'xnqxo43zlikkm1b';
$secret = '4m1cquhugjve5ea';
$token = array(
	'token' => $_POST['token'],
	'token_secret' => $_POST['token_secret']);

$oauth = new Dropbox_OAuth_PEAR($key, $secret);
$dropbox = new Dropbox_API($oauth);

$oauth->setToken($token);
// TODO: make this return a 301 or whatever on error
if (!$dropbox->putfile('password_thing_backup.txt', $_FILES['file']['tmp_name'])) {
    echo "success";
}

?>