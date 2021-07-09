<?php

namespace Model;

class Lives{

    public $table = "lives";
    public $types = ["text", "text", "text", "number", "text", "text", "text", "number", "timestamp", "timestamp", "timestamp", "timestamp", "timestamp", "number", "number", "number", "text", "boolean", "text", "text", "text", "text", "text", "text", "text"];
    public $id;
    public $name; // form
    public $code; //generate
    public $speaker; 
    public $status; // form
    public $warning; //default ""
    public $program; // form
    public $survey; //form url
    public $chat; // form
    public $date; // form
    public $init_time; // form
    public $end_time; // form
    public $added; //default current date
    public $updated; //default current date
    public $support; // form
    public $company_id; // form
    public $congress_id;
    public $type; // form
    public $active; //default 1
    public $url_front; // form
    public $url_back; // form
    public $url_zoom; // form
    public $copyright; // form
    public $logo_patro; // form
    public $logo_company_alt; // form
    public $podcast_poster_img;
    public $passed_poster_alt;
    public $inactive_poster_alt;
    public $video_poster;
    
    function getId() {
        return $this->id;
    }

    function getName() {
        return $this->name;
    }

    function getCode() {
        return $this->code;
    }

    function getSpeaker() {
        return $this->speaker;
    }

    function getStatus() {
        return $this->status;
    }

    function getWarning() {
        return $this->warning;
    }

    function getProgram() {
        return $this->program;
    }

    function getSurvey() {
        return $this->survey;
    }

    function getChat() {
        return $this->chat;
    }

    function getDate() {
        return $this->date;
    }

    function getInit_time() {
        return $this->init_time;
    }

    function getEnd_time() {
        return $this->end_time;
    }

    function getAdded() {
        return $this->added;
    }

    function getUpdated() {
        return $this->updated;
    }

    function getSupport() {
        return $this->support;
    }

    function getCompany_id() {
        return $this->company_id;
    }

    function getCongress_id() {
        return $this->congress_id;
    }

    function getType() {
        return $this->type;
    }

    function getActive() {
        return $this->active;
    }

    function getUrl_front() {
        return $this->url_front;
    }

    function getUrl_back() {
        return $this->url_back;
    }

    function getUrl_zoom() {
        return $this->url_zoom;
    }

    function getCopyright() {
        return $this->copyright;
    }

    function getLogo_patro() {
        return $this->logo_patro;
    }

    function getLogo_company_alt() {
        return $this->logo_company_alt;
    }

    function getPodcast_poster_img() {
        return $this->podcast_poster_img;
    }

    function getPassed_poster_alt() {
        return $this->passed_poster_alt;
    }

    function getInactive_poster_alt() {
        return $this->inactive_poster_alt;
    }

    function getVideo_poster() {
        return $this->video_poster;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setName($name) {
        $this->name = $name;
    }

    function setCode($code) {
        $this->code = $code;
    }

    function setSpeaker($speaker) {
        $this->speaker = $speaker;
    }

    function setStatus($status) {
        $this->status = $status;
    }

    function setWarning($warning) {
        $this->warning = $warning;
    }

    function setProgram($program) {
        $this->program = $program;
    }

    function setSurvey($survey) {
        $this->survey = $survey;
    }

    function setChat($chat) {
        $this->chat = $chat;
    }

    function setDate($date) {
        $this->date = $date;
    }

    function setInit_time($init_time) {
        $this->init_time = $init_time;
    }

    function setEnd_time($end_time) {
        $this->end_time = $end_time;
    }

    function setAdded($added) {
        $this->added = $added;
    }

    function setUpdated($updated) {
        $this->updated = $updated;
    }

    function setSupport($support) {
        $this->support = $support;
    }

    function setCompany_id($company_id) {
        $this->company_id = $company_id;
    }

    function setCongress_id($congress_id) {
        $this->congress_id = $congress_id;
    }

    function setType($type) {
        $this->type = $type;
    }

    function setActive($active) {
        $this->active = $active;
    }

    function setUrl_front($url_front) {
        $this->url_front = $url_front;
    }

    function setUrl_back($url_back) {
        $this->url_back = $url_back;
    }

    function setUrl_zoom($url_zoom) {
        $this->url_zoom = $url_zoom;
    }

    function setCopyright($copyright) {
        $this->copyright = $copyright;
    }

    function setLogo_patro($logo_patro) {
        $this->logo_patro = $logo_patro;
    }

    function setLogo_company_alt($logo_company_alt) {
        $this->logo_company_alt = $logo_company_alt;
    }

    function setPodcast_poster_img($podcast_poster_img) {
        $this->podcast_poster_img = $podcast_poster_img;
    }

    function setPassed_poster_alt($passed_poster_alt) {
        $this->passed_poster_alt = $passed_poster_alt;
    }

    function setInactive_poster_alt($inactive_poster_alt) {
        $this->inactive_poster_alt = $inactive_poster_alt;
    }

    function setVideo_poster($video_poster) {
        $this->video_poster = $video_poster;
    }



}

?>