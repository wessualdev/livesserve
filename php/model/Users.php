<?php

namespace Model;


class Users {

    public $table = "users";
    public $types = ["text", "text", "text", "number", "text", "timestamp", "boolean", "number", "text", "text"];
    public $id;
    public $name;
    public $email;
    public $password;
    public $role;
    public $token;
    public $added;
    public $active;
    public $company_id;
    public $url_back;
    public $url_front;

    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getEmail() {
        return $this->email;
    }

    function getPassword() {
        return $this->password;
    }

    function getRole() {
        return $this->role;
    }

    function getToken() {
        return $this->token;
    }

    function getAdded() {
        return $this->added;
    }

    function getActive() {
        return $this->active;
    }

    function getCompany_id() {
        return $this->company_id;
    }

    function getUrl_back() {
        return $this->url_back;
    }

    function getUrl_front() {
        return $this->url_front;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setEmail($email) {
        $this->email = $email;
    }

    function setPassword($password) {
        $this->password = $password;
    }

    function setRole($role) {
        $this->role = $role;
    }

    function setToken($token) {
        $this->token = $token;
    }

    function setAdded($added) {
        $this->added = $added;
    }

    function setActive($active) {
        $this->active = $active;
    }

    function setCompany_id($company_id) {
        $this->company_id = $company_id;
    }

    function setUrl_back($url_back) {
        $this->url_back = $url_back;
    }

    function setUrl_front($url_front) {
        $this->url_front = $url_front;
    }


}

?>