<?php

namespace App\Models;

namespace Model;

class Chat {

    public $table = "chat";
    public $types = ['number', 'timestamp', 'text', 'text' , 'text', 'boolean', 'boolean'];
    public $id;
    public $lives_id;
    public $time;
    public $message;
    public $name;
    public $ip;
    public $visible;
    public $type;

    
    function getId() {
        return $this->id;
    }

    function getLives_id() {
        return $this->lives_id;
    }

    function getTime() {
        return $this->time;
    }

    function getMessage() {
        return $this->message;
    }

    function getName() {
        return $this->name;
    }

    function getIp() {
        return $this->ip;
    }

    function getVisible() {
        return $this->visible;
    }

    function getType() {
        return $this->type;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setLives_id($lives_id) {
        $this->lives_id = $lives_id;
    }

    function setTime($time) {
        $this->time = $time;
    }

    function setMessage($message) {
        $this->message = $message;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setIp($ip) {
        $this->ip = $ip;
    }

    function setVisible($visible) {
        $this->visible = $visible;
    }

    function setType($type) {
        $this->type = $type;
    }



}

?>