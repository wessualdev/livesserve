<?php


    include '../common/ModelDao.php';
    use Dao;
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
                createCompany($dao);
                break;

            case "delete":
                deleteAll($dao);
                break;

            case "update":
                updateCompany($dao);
                break;

            default:
                die(http_response_code(500));
            }

    }else{
        die(http_response_code(401));
    }

    function createCompany($dao){
        //obtengo el objeto de datos de la petición post y creo el objeto Users
        $companyData = json_decode($_POST["data"]);
        $company = new Company();
        $company->setName($companyData->name);
        $company->setAbbreviation($companyData->abbreviation);
        $company->setPrimary_color($companyData->primary_color);
        $company->setSecondary_color($companyData->secondary_color);
        $company->setTerciary_color($companyData->terciary_color);
        $company->setLogo($companyData->logo);
        $company->setCopyright($companyData->copyright);
        $company->setInactive_poster($companyData->inactive_poster);
        $company->setPassed_poster($companyData->passed_poster);
        $company->setCustom_css($companyData->custom_css);
        $company->setDefault_poster($companyData->default_poster);
        $company->setActive(true);
        
        $result = $dao->insert($company);

        die(json_encode($result));
    }

    function getAllSession($dao){

        $companyMod = new Company();

        $allCompanies = $dao->getAll($companyMod);
       
        die(json_encode($allCompanies));
    }

    function deleteAll($dao){

        $companyIds = json_decode($_POST["data"]);
        $company = new Company();

        //elimina cada uno de las empresas
        for($i = 0; $i < count($companyIds); $i++){

            $dao->virtualDelete($companyIds[$i], $company);
        }
        
        die("true");
    }

    function updateCompany($dao){

        $id = $_POST["id"];
        $company = new Company();

        $lastCompany = $dao->getById($id, $company);

        //obtengo el objeto de datos de la base de datos y actualizo con los datos que vienen del post
        $companyData = json_decode($_POST["data"]);
        
        $company->setName($companyData->name);
        $company->setAbbreviation($companyData->abbreviation);
        $company->setPrimary_color($companyData->primary_color);
        $company->setSecondary_color($companyData->secondary_color);
        $company->setTerciary_color($companyData->terciary_color);
        //si las imageens son null usar las anteriores
        if($companyData->logo == null || $companyData->logo == ""){
            $company->setLogo($lastCompany["logo"]);
        }else{
            $company->setLogo($companyData->logo);
        }
        
        if($companyData->inactive_poster == null || $companyData->inactive_poster == ""){
            $company->setInactive_poster($lastCompany["inactive_poster"]);
        }else{
            if($companyData->inactive_poster == "delete"){
                $company->setInactive_poster(""); 
            }else{
                $company->setInactive_poster($companyData->inactive_poster);
            }
        }
        if($companyData->passed_poster == null || $companyData->passed_poster == ""){
            $company->setPassed_poster($lastCompany["passed_poster"]);
        }else{
            if($companyData->passed_poster == "delete"){
                $company->setPassed_poster(""); 
            }else{
                $company->setPassed_poster($companyData->passed_poster);
            }
        }
        if($companyData->default_poster == null || $companyData->default_poster == ""){
            $company->setDefault_poster($lastCompany["default_poster"]);
        }else{
            if($companyData->default_poster == "delete"){
                $company->setDefault_poster(""); 
            }else{
                $company->setDefault_poster($companyData->default_poster);
            }
        }

        $company->setCopyright($companyData->copyright);
        $company->setCustom_css($companyData->custom_css);
        $company->setActive($lastCompany["active"]);
        
        $result = $dao->update($company, $id);

        die(json_encode($result));
    }