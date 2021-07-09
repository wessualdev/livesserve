<?php


    include '../common/ModelDao.php';
    use Dao;
    include '../model/Lives.php';
    use Model\Lives;
    include '../model/Company.php';
    use Model\Company;
    include '../model/Chat.php';
    use Model\Chat;
    include '../model/Users.php';
    use Model\Users;

    $dao = new Dao\Model();

    $method = $_GET["method"];

    switch($method){

        case "getLive":
            getLiveId($dao);
            break;

        case "streaming":
            getStreamingData($dao);
            break;

        default:
            die(http_response_code(404));
        }


        function getLiveId($dao){
    
            $live = new Lives();
            $code = $_GET["code"];
    
            //last method get live by id
            //$live = $dao->getById($id, $live);
            //now get live by code
            $sql = "SELECT * FROM DBTABLE WHERE code = '" . $code . "'";

            $live = $dao->executeCustomQuery($live, $sql)[0];

            $id = $live["id"];
    
            $id_company = $live["company_id"];
            //obtengo la emresa relacionada con el directo
            $companyMod = new Company();
            $company = $dao->getById($id_company, $companyMod);
            $live["company"] = $company;
            //obtengo los mensajes de chat relacionados al directo si el chat está  activo, 
            if($live["chat"] == 1){
                $chat = new Chat();
                $where = "lives_id = " . $id . " AND visible = 1 AND type = 1";
                $allMessages = $dao->getAllWhere($chat, $where);
                $live["chat"] = $allMessages;
            }
            //obtengo el susuario que esta asignado como soporte para tener sus URL
            $id_user = $live["support"];
            $userModel = new Users();
            $user = $dao->getById($id_user, $userModel);
            $user["password"] = null;
            $live["support"] = $user;

            $live["ip"] = getIPAddress();
    
            die(json_encode($live));
        }

      

    function getStreamingData($dao){


            $live = new Lives();
            $id = $_GET["id"];
            //obtengo los datos de cada timeout
            //en primer lugar el estado y el mensaje de warning del directo si lo hubiera
            $sql = "SELECT status, warning, chat FROM DBTABLE WHERE id = " . $id;

            $response = $dao->executeCustomQuery($live, $sql)[0];
            //a continuación obtngo los mensajes asociados aldirecto
            if($response["chat"] == 1){
                $chat = new Chat();
                $where = "lives_id = " . $id. " AND visible = 1 AND type = 1";
                $allMessages = $dao->getAllWhere($chat, $where);
                $response["chat"] = $allMessages;
            }
            $response["ip"] = getIPAddress();

            die(json_encode($response));
        }

     function getIPAddress() {  
        //whether ip is from the share internet  
         if(!empty($_SERVER['HTTP_CLIENT_IP'])) {  
                    $ip = $_SERVER['HTTP_CLIENT_IP'];  
            }  
        //whether ip is from the proxy  
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {  
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];  
         }  
    //whether ip is from the remote address  
        else{  
                 $ip = $_SERVER['REMOTE_ADDR'];  
         }  
         return $ip;  
    }  