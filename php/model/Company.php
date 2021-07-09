<?php

namespace Model;

class Company{

    public $table = "company";
    public $types = ["text", "text", "text", "text", "text", "text", "text","text", "text", "text", "text","boolean"];
    public $id;
    public $name;
    public $abbreviation;
    public $primary_color;
    public $secondary_color;
    public $terciary_color;
    public $logo;
    public $copyright;
    public $passed_poster;
    public $inactive_poster;
    public $default_poster;
    public $custom_css;
    public $active;

    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getAbbreviation() {
        return $this->abbreviation;
    }

    function getPrimary_color() {
        return $this->primary_color;
    }

    function getSecondary_color() {
        return $this->secondary_color;
    }

    function getTerciary_color() {
        return $this->terciary_color;
    }

    function getLogo() {
        return $this->logo;
    }

    function getCopyright() {
        return $this->copyright;
    }

    function getPassed_poster() {
        return $this->passed_poster;
    }

    function getInactive_poster() {
        return $this->inactive_poster;
    }

    function getDefault_poster() {
        return $this->default_poster;
    }

    function getCustom_css() {
        return $this->custom_css;
    }

    function getActive() {
        return $this->active;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setAbbreviation($abbreviation) {
        $this->abbreviation = $abbreviation;
    }

    function setPrimary_color($primary_color) {
        $this->primary_color = $primary_color;
    }

    function setSecondary_color($secondary_color) {
        $this->secondary_color = $secondary_color;
    }

    function setTerciary_color($terciary_color) {
        $this->terciary_color = $terciary_color;
    }

    function setLogo($logo) {
        $this->logo = $logo;
    }

    function setCopyright($copyright) {
        $this->copyright = $copyright;
    }

    function setPassed_poster($passed_poster) {
        $this->passed_poster = $passed_poster;
    }

    function setInactive_poster($inactive_poster) {
        $this->inactive_poster = $inactive_poster;
    }

    function setDefault_poster($default_poster) {
        $this->default_poster = $default_poster;
    }

    function setCustom_css($custom_css) {
        $this->custom_css = $custom_css;
    }

    function setActive($active) {
        $this->active = $active;
    }



}

?>