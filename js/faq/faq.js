$(document).ready(function(){

    code = window.location.href.split('?code=')[1];
    $.ajax({
        url: "php/controller/chatController.php?method=getQuestions&code=" + code, //"jsonExample/session.json",
        type: "GET",
    }).done(function (data) {
        data = JSON.parse(data);
        $('.title').html(data.name);
        $('#mailtoForm').attr( 'action','mailto:' + data.support.email);
        changeColors(data.company);
        $('.logo').attr('src', data.company.logo);
    });

    $('#support').click(function(){
        $('#mailtoForm').removeClass('hidden');
    })

});


function changeColors(company) {
    //modifico el backgrond, color de fuente y svg para el color primrio
    $('.primaryBackground').each(function (index) {

        $(this).css('background-color', company.primary_color);
    });

    $('.primaryBorder').each(function(){
        $(this).css('border-color', company.primary_color);
    });

    $('.textColorPrimary').each(function (index) {

        $(this).css('color', company.primary_color);
    });
    //modifico el backgrond, color de fuente y svg para el color secundario
    $('.secondaryBackground').each(function (index) {

        $(this).css('background-color', company.secondary_color);
    });

    $('.secondaryBorder').each(function(){
        $(this).css('border-color', company.secondary_color);
    });

    $('.textColorSecondary').each(function (index) {

        $(this).css('color', company.secondary_color);
    });

}
