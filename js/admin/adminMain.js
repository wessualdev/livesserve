//usare esta variable para cuando haya que mandar daos en la navegación
var navigationParams;
var imgFolder = "assets/imgs/";

$(document).ready(function(){

    //eventos de la barra de navegación lateral
    $('#navigationNav').find('nav').find('.navigation').click(function(){
        //obtengo el href del botón pulsado
        var href = $(this).data('href');
        $('.navigation').removeClass('selected');
        $(this).addClass('selected');
        //cargo la vista en el contenedor
        $('#adminMainContainer').load(href);
    });
    //por defecto cargo la página de sessiones
    $('#adminMainContainer').load("adminSessions.html");


    $('#logout').click(function(){
        //elimino la cookie de session y recargo la página

        $.ajax({
            url: "../../php/controller/login.php?method=logout",
            type: "GET",
            async: false,
        }).done(function (data) {
    
            location.reload();
        });
    })
});