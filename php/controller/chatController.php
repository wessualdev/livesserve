<?php


    include '../common/ModelDao.php';
    use Dao;
    include '../model/Chat.php';
    use Model\Chat;
    include '../model/Lives.php';
    use Model\Lives;
    include '../model/Company.php';
    use Model\Company;
    include '../model/Users.php';
    use Model\Users;

    $dao = new Dao\Model();

    $method = $_GET["method"];

    switch($method){

        case "saveMessage":
            saveMessage($dao);
            break;
        case "getQuestions":
            getQuestions($dao);
            break;
        default:
            die(http_response_code(404));
        }


        function saveMessage($dao){
            //guardo el mensaje en la base de datos
            $messageData = json_decode($_GET["data"]);

            $ip = getIPAddress();
            $chat = new Chat();
            $chat->setLives_id($messageData->lives_id);
            $chat->setTime(date("Y-m-d H:i:s"));
            $chat->setIp($ip);
            $chat->setMessage($messageData->message);
            $chat->setName($messageData->name);
            $chat->setVisible(true);
            $chat->setType($messageData->type);
            
            $result = $dao->insert($chat);

            //como respuesta develvo todos los mensajes para este directo
            $where = "lives_id = " . $messageData->lives_id . " AND visible = 1 AND type = 1";
            $allMessages = $dao->getAllWhere($chat, $where);

            $response["ip"] = $ip;
            $response["chat"] =  $allMessages; 

            die(json_encode($response));
        }

     function getQuestions($dao){
         //optener todas las pregntas de un directo
            $live = new Lives();
            $code = $_GET["code"];
            $sql = "SELECT * FROM DBTABLE WHERE code = '" . $code . "'";

            $live = $dao->executeCustomQuery($live, $sql)[0];
            $id = $live["id"];
            //obtengo el chat mediante su ID
            $chat = new Chat();
            $where = "lives_id = " . $id . " AND type = 1";
            $live["questions"] = $dao->getAllWhere($chat, $where);
            //obtengo la empresa
            $companyMod = new Company();
            $company = $dao->getById($live["company_id"], $companyMod);
            $live["company"] = $company;

            $id_user = $live["support"];
            $userModel = new Users();
            $user = $dao->getById($id_user, $userModel);
            $user["password"] = null;
            $live["support"] = $user;

            die(json_encode($live));
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