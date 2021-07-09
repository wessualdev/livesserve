<?php


    include '../common/ModelDao.php';
    use Dao;
    include '../model/Company.php';
    use Model\Company;
    include '../model/Congress.php';
    use Model\Congress;
   

    session_start();
    session_regenerate_id();

    if($_SESSION['logedUser'] != null){

        $dao = new Dao\Model();

        $method = $_GET["method"];

        //deoendiendo el metodo llama a una funcion u otra
        switch($method){

            case "getAll":
                getAllCongress($dao);
                break;

            case "create":
                createCongress($dao);
                break;

            case "update":
                updateCongress($dao);
                break;
            
            case "delete":
                deleteAll($dao);
                break;

            default:
                die(http_response_code(404));
            }

    }else{
        die(http_response_code(401));
    }

    function updateCongress($dao){

        $id = $_POST["id"];
        //obtengo el objeto de datos de la petición post y creo el objeto Congress
        $congressData = json_decode($_POST["data"]);
        $congress = new Congress();
        //obtengo el congreso por id
        $lastCrongress = $dao->getById($id, $congress);

        $congress->setName($congressData->name);
        $congress->setCompany_id($congressData->company_id);
        $congress->setInit_date($congressData->init_date);
        $congress->setEnd_date($congressData->end_date);
        $congress->setDate($lastCrongress["date"]);
        $congress->setActive($lastCrongress["active"]);
        
        $result = $dao->update($congress, $id);

        die(json_encode($result));


    }

    function deleteAll($dao){

        $congressIds = json_decode($_POST["data"]);
        $congress = new Congress();

        //elimina cada uno de los congresos
        for($i = 0; $i < count($congressIds); $i++){

            $dao->virtualDelete($congressIds[$i], $congress);
        }
        
        die("true");
    }

    function getAllCongress($dao){
        $congress = new Congress();

        $allCongress = $dao->getAll($congress);

        for($i = 0; $i < count($allCongress); $i++){
            $value = $allCongress[$i];

            //obtengo los datos de la empresa
            $id_company = $value["company_id"];
            $companyMod = new Company();
            $company = $dao->getById($id_company, $companyMod);
            $allCongress[$i]["company"] = $company;
        }

       
        die(json_encode($allCongress));
    }

    function createCongress($dao){

        //obtengo el objeto de datos de la petición post y creo el objeto Congress
        $congressData = json_decode($_POST["data"]);
        $congress = new Congress();
        $congress->setName($congressData->name);
        $congress->setCompany_id($congressData->company_id);
        $congress->setInit_date($congressData->init_date);
        $congress->setEnd_date($congressData->end_date);
        $congress->setDate(date("Y-m-d H:i:s"));
        $congress->setActive(true);
        
        $result = $dao->insert($congress);

        die(json_encode($result));


    }