<?php
include('lib/Dropbox-0.4.0/Dropbox/autoload.php');

$key = 'xnqxo43zlikkm1b';
$secret = '4m1cquhugjve5ea';
$token = array(
	'token' => $_GET['token'],
	'token_secret' => $_GET['token_secret']);

$oauth = new Dropbox_OAuth_PEAR($key, $secret);
$dropbox = new Dropbox_API($oauth);

$oauth->setToken($token);

header('Content-Type: text/plain');
echo($dropbox->getfile('password_thing_backup.txt'));

?>