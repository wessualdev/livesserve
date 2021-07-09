<?php

    include '../common/ModelDao.php';
    use Dao;
    include '../model/Users.php';
    use Model\Users;

    session_start();
    session_regenerate_id();
   
    if($_SESSION['logedUser'] != null){

        $dao = new Dao\Model();

        $method = $_GET["method"];
        //deoendiendo el metodo llama a una funcion u otra
        switch($method){

            case "getAll":
                getAllUser($dao);
                break;

            case "technical":
                getWithURL($dao);
                break;
            case "create":
                createUser($dao);
                break;
            
            case "update":
                updateUser($dao);
                break;

            case "delete":
                deleteAll($dao);
                break;


            default:
                die(http_response_code(500));
        }

    }else{
        die(http_response_code(401));
    }


    function getAllUser($dao){
        $users = new Users();
       
        die(json_encode($dao->getAll($users)));
    }

    function  getWithURL($dao){
        $users = new Users();

        $where = "url_front != ''";
        $allTechnical = $dao->getAllWhere($users, $where);

        die(json_encode($allTechnical));
    }

    function deleteAll($dao){

        $userIds = json_decode($_POST["data"]);
        $user = new Users();

        //elimina cada uno de los usuarios
        for($i = 0; $i < count($userIds); $i++){

            $dao->virtualDelete($userIds[$i], $user);
        }
        
        die("true");
    }

    function createUser($dao){

        //obtengo el objeto de datos de la petición post y creo el objeto Users
        $userData = json_decode($_POST["data"]);
        $user = new Users();
        $user->setName($userData->name);
        $user->setEmail($userData->email);
        $pass = generateRandomPass();
        $encriptedPass = password_hash($pass, PASSWORD_BCRYPT, array('cost' => 10));
        $user->setPassword($encriptedPass);
        $user->setRole($userData->role);
        $user->setToken("");
        $user->setAdded(date("Y-m-d H:i:s"));
        $user->setActive(true);
        $user->setUrl_back($userData->url_back);
        $user->setUrl_front($userData->url_front);
        $user->setCompany_id($userData->company_id);
        
        $result = $dao->insert($user);

        die(json_encode($result));
    }

    function updateUser($dao){

        $id = $_POST["id"];
        $user = new Users();

        $lastUser = $dao->getById($id, $user);

        //obtengo el objeto de datos de la base de datos y actualizo con los datos que vienen del post
        $userData = json_decode($_POST["data"]);
        
        $user->setName($userData->name);
        $user->setEmail($userData->email);
        $user->setPassword($lastUser["password"]);
        $user->setRole($userData->role);
        $user->setToken($lastUser["token"]);
        $user->setAdded($lastUser["added"]);
        $user->setActive($lastUser["active"]);
        $user->setCompany_id($userData->company_id);
        $user->setUrl_back($userData->url_back);
        $user->setUrl_front($userData->url_front);
        
        $result = $dao->update($user, $id);

        die(json_encode($result));
    }


    function generateRandomPass(){

        $characters .= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < 10; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;

    }
  

    