<?php

    session_start();
    session_regenerate_id();

    $method = $_GET["method"];

    //deoendiendo el metodo llama a una funcion u otra
    switch($method){

        case "checkLogin":
            checkLogin();
            break;
        case "login":
            login();  
        case "logout":
            logout(); 


        default:
            die(http_response_code(500));
    }

    function logout(){
        $_SESSION['logedUser'] = null;
        die();
    }

    function checkLogin(){
        //compruebo si existe la cookie de sesión
        if($_SESSION['logedUser'] == null){
            die("false");
        }else{
            die("true");
        }
    }


    function login(){
        //valido si el usuario y la contraseña son correctas
        $email = $_POST["email"];
        $pass = $_POST["pass"];

        //TODO conexión a base de datos
        if($email == "luis.diez@wessual.com" and $pass == "123123"){

            $_SESSION['logedUser'] = "User";

            die("true");
        }
        die("false");
    }
    
?>