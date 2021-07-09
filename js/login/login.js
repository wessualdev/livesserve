$(document).ready(function () {

    $('#loginBtn').click(function () {
        login();
    });
});





function login() {

    //cumpruebo que el usuario y la contraseña son correctos
    var email = $('#email').val();

    var pass = $('#pass').val();

    $.ajax({
        url: "../../php/controller/login.php?method=login",
        type: "POST",
        data: "email=" + email + "&pass=" + pass,
        processData: false,
    }).done(function (data) {
        //si el usuaio y contraseña es correcto cargo la pantalla de admin
        if (data === 'true') {
            $('#appBody').load("adminMain.html");
        } else {
            //si no limpio el login
            $('.loginFolder').val('');
        }

    })
}