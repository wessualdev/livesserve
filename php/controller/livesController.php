<?php


    include '../common/ModelDao.php';
    use Dao;
    include '../model/Lives.php';
    use Model\Lives;
    include '../model/Company.php';
    use Model\Company;
   

    session_start();
    session_regenerate_id();


    if($_SESSION['logedUser'] != null){

        $dao = new Dao\Model();

        $method = $_GET["method"];
        
        //deoendiendo el metodo llama a una funcion u otra
        switch($method){

            case "getAll":
                getAllSession($dao);
                break;

            case "create":
                createLive($dao);
                break;

            case "delete":
                deleteAll($dao);
                break;

            case "update":
                updateLive($dao);
                break;

            case "getOne":
                getById($dao);
                break;

            default:
                die(http_response_code(404));
            }

    }else{
        die(http_response_code(401));
    }


    function deleteAll($dao){

        $liveIds = json_decode($_POST["data"]);
        $lives = new Lives();

        //elimina cada uno de los directos
        for($i = 0; $i < count($liveIds); $i++){

            $dao->virtualDelete($liveIds[$i], $lives);
        }

        
        die("true");
    }

    function getById($dao){

        $live = new Lives();
        $id = $_GET["id"];

        $live = $dao->getById($id, $live);

        $id_company = $live["company_id"];
        $companyMod = new Company();
        $company = $dao->getById($id_company, $companyMod);
        $live["company"] = $company;

        die(json_encode($live));
    }

    function getAllSession($dao){

        $lives = new Lives();

        $allLives = $dao->getAll($lives);

        for($i = 0; $i < count($allLives); $i++){
            $value = $allLives[$i];

            //obtengo los datos de la empresa
            $id_company = $value["company_id"];
            $companyMod = new Company();
            $company = $dao->getById($id_company, $companyMod);
            $allLives[$i]["company"] = $company;
        }

       
        die(json_encode($allLives));
    }

    function createLive($dao){

        //obtengo el objeto de datos de la petición post y creo el objeto Lives
        $liveData = json_decode($_POST["data"]);
        $lives = new Lives();
        $lives->setName($liveData->name);
        $lives->setCode($liveData->code);
        $lives->setSpeaker("Speaker"); //TODO input
        $lives->setStatus($liveData->status);
        $lives->setwarning($liveData->warning);
        $lives->setSurvey($liveData->survey);
        $lives->setProgram($liveData->program);
        $lives->setChat($liveData->chat);
        $lives->setDate($liveData->date);
        $lives->setInit_time($liveData->init_time);
        $lives->setEnd_time($liveData->end_time);
        $lives->setAdded(date("Y-m-d H:i:s"));
        $lives->setUpdated(date("Y-m-d H:i:s"));
        $lives->setSupport($liveData->support);
        $lives->setCompany_id($liveData->company_id);
        $lives->setCongress_id("null"); //TODO congress input
        $lives->setType($liveData->type);
        $lives->setActive(1);
        $lives->setUrl_front($liveData->url_front);
        $lives->setUrl_back($liveData->url_back);
        $lives->setUrl_zoom($liveData->url_zoom);
        $lives->setCopyright(""); //usaremos el copyrigth de la empresa
        $lives->setLogo_company_alt($liveData->logo_company_alt); 
        $lives->setLogo_patro($liveData->logo_patro); 
        $lives->setPodcast_poster_img(null); //TODO poster input
        $lives->setPassed_poster_alt($liveData->passed_poster_alt);
        $lives->setInactive_poster_alt($liveData->inactive_poster_alt);
        $lives->setVideo_poster($liveData->video_poster);
        
        $result = $dao->insert($lives);

        die(json_encode($result));
    }

    function updateLive($dao){

        //obtengo el objeto de datos de la petición post y creo el objeto Lives
        $liveData = json_decode($_POST["data"]);
        $id = $_POST["id"];
        $lives = new Lives();

        $lastLive = $dao->getById($id, $lives);

        $lives->setName($liveData->name);
        $lives->setCode($liveData->code);
        $lives->setSpeaker($lastLive["speaker"]); //TODO input
        $lives->setSurvey($liveData->survey);
        $lives->setStatus($liveData->status);
        $lives->setwarning($liveData->warning); 
        $lives->setProgram($liveData->program);
        $lives->setChat($liveData->chat);
        $lives->setDate($liveData->date);
        $lives->setInit_time($liveData->init_time);
        $lives->setEnd_time($liveData->end_time);
        $lives->setAdded($lastLive["added"]);
        $lives->setUpdated(date("Y-m-d H:i:s"));
        $lives->setSupport($liveData->support);
        $lives->setCompany_id($liveData->company_id);
        if($lastLive->congress_id == null){
            $lives->setCongress_id("null");
        }else{
            $lives->setCongress_id($liveData->congress_id); //TODO congress input
        }
        
        $lives->setType($liveData->type);
        $lives->setActive(1);
        $lives->setUrl_front($liveData->url_front);
        $lives->setUrl_back($liveData->url_back);
        $lives->setUrl_zoom($liveData->url_zoom);
        $lives->setCopyright($liveData->copyright);

        //si las imageens son null es porque no se han modificado en el formulario, por lo que usamos la misma que habia guardada
        if($liveData->logo_company_alt != null || $liveData->logo_company_alt != ""){
            if($liveData->logo_company_alt == "delete"){
                $lives->setLogo_company_alt(""); 
            }else{
                $lives->setLogo_company_alt($liveData->logo_company_alt); 
            }
        }else{
            $lives->setLogo_company_alt($lastLive["logo_company_alt"]); 
        }
        
        if($liveData->logo_patro != null || $liveData->logo_patro != ""){
            if($liveData->logo_patro == "delete"){
                $lives->setLogo_patro(""); 
            }else{
                $lives->setLogo_patro($liveData->logo_patro); 
            }
        }else{
            $lives->setLogo_patro($lastLive["logo_patro"]); 
        }
        
        if($liveData->passed_poster_alt != null || $liveData->passed_poster_alt != ""){
            if($liveData->passed_poster_alt == "delete"){
                $lives->setPassed_poster_alt(""); 
            }else{
                $lives->setPassed_poster_alt($liveData->passed_poster_alt); 
            }
        }else{
            $lives->setPassed_poster_alt($lastLive["passed_poster_alt"]); 
        }
        
        if($liveData->inactive_poster_alt != null || $liveData->inactive_poster_alt != ""){
            if($liveData->inactive_poster_alt == "delete"){
                $lives->setInactive_poster_alt(""); 
            }else{
                $lives->setInactive_poster_alt($liveData->inactive_poster_alt); 
            }
        }else{
            $lives->setInactive_poster_alt($lastLive["inactive_poster_alt"]); 
        }
        
        if($liveData->video_poster != null || $liveData->video_poster != ""){
            $lives->setVideo_poster($liveData->video_poster); 
        }else{
            $lives->setVideo_poster($lastLive["video_poster"]); 
        }
        $lives->setPodcast_poster_img($lastLive["podcast_poster_img"]); //TODO poster input
        //actualizo
        $result = $dao->update($lives, $id);

        die(json_encode($result));
    }