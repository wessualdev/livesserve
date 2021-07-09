$(document).ready(function(){
    
    checkLoged();
});

function checkLoged(){
    $.ajax({
        url: "../../php/controller/login.php?method=checkLogin",
        type:"get"
    }).done(function (data) {
        
         //si está logado cargo la pantalla de administración
         if(data === 'true'){
            $('#appBody').load("adminMain.html");
        }else{
            //si no cargo la pantalla de login
            $('#appBody').load("../login/login.html");
        }
    })
}