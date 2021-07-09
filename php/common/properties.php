<?php

define('DB_NAME', 'directos_test');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_HOST', 'localhost:8889');
define('DB_CHARSET', 'utf8mb4');


/*
define('DB_NAME', 'directos_test');
define('DB_USER', 'asampedrol');
define('DB_PASS', 'Wessual2014');
define('DB_HOST', 'wssbbdd1.caljz2dvo8hh.eu-west-1.rds.amazonaws.com:3306');
define('DB_CHARSET', 'utf8mb4');
*/

function getConn(){
    $connection = new mysqli(DB_HOST, DB_USER, DB_PASS);

    return $connection;
}


    