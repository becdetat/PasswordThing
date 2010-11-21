<?php
include('lib/Dropbox-0.4.0/Dropbox/autoload.php');

$key = 'xnqxo43zlikkm1b';
$secret = '4m1cquhugjve5ea';
$email = $_POST['email'];
$pwd = $_POST['pwd'];

$oauth = new Dropbox_OAuth_PEAR($key, $secret);
$dropbox = new Dropbox_API($oauth);
$token = $dropbox->getToken($email, $pwd);


header('Cache-Control: no-cache');
header('Pragma: no-cache');
header('Expires: 0');
echo(json_encode($token))
?>