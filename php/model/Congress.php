<?php

namespace Model;

class Congress{

    public $table = "congress";
    public $types = ["varchar", "number", "timestamp", "timestamp", "timestamp", "boolean"];
    public $name;
    public $company_id;
    public $date;
    public $init_date;
    public $end_date;
    public $active;
    
    
    function getName() {
        return $this->name;
    }

    function getCompany_id() {
        return $this->company_id;
    }

    function getDate() {
        return $this->date;
    }

    function getInit_date() {
        return $this->init_date;
    }

    function getEnd_date() {
        return $this->end_date;
    }

    function getActive() {
        return $this->active;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setCompany_id($company_id) {
        $this->company_id = $company_id;
    }

    function setDate($date) {
        $this->date = $date;
    }

    function setInit_date($init_date) {
        $this->init_date = $init_date;
    }

    function setEnd_date($end_date) {
        $this->end_date = $end_date;
    }

    function setActive($active) {
        $this->active = $active;
    }


}