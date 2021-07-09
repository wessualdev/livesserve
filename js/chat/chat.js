$(document).ready(function(){

    code = window.location.href.split('?code=')[1];
    $.ajax({
        url: "php/controller/chatController.php?method=getQuestions&code=" + code, //"jsonExample/session.json",
        type: "GET",
    }).done(function (data) {
        data = JSON.parse(data);
        $('.title').html(data.name);
        if (Array.isArray(data.questions)) {
            cargeChat(data.questions);
        } 
        changeColors(data.company);
        $('.logo').attr('src', data.company.logo);
    });

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


function cargeChat(response) {
    $('.message-chat-content').empty();;
    for (var i = 0; i < response.length; i++) {
        var itemMessage = $(CHAT_TEMPLATE);
        itemMessage.find('.nameUser').html(response[i].name);
        itemMessage.find('.idMessage').html(response[i].id);
        itemMessage.find('.message').html(response[i].message);
        var date_message = response[i].time.split(" ");
        var date = itemMessage.find('.message-date').html(date_message[1].split(':', 2).join(':'));
        $('.message-chat-content').append(itemMessage);
    }
}


var CHAT_TEMPLATE =

    '<li class="dch content-message idMessage">' +
    '<div class="nameUser textColorPrimary"></div>' +
    '<div class=" message-info row primaryBackground">' +
    '<div class="message col-10"></div>' +
    '<div class="col-2 message-date">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</li>';