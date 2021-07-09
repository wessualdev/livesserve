//Identificador de los directos
var id;
var company;
var live;
//Funcion para la carga dinamica del chat sacando los mensajes de la base de datos
function cargeChat(data, ip) {
    var response = data;
    $('.message-chat-content').empty();;
    for (var i = 0; i < response.length; i++) {
        var itemMessage = "";
        if (ip == response[i].ip) {
            itemMessage = $(CHAT_TEMPLATE_DER);
        } else {
            itemMessage = $(CHAT_TEMPLATE_IZQ);
        }
        itemMessage.find('.nameUser').html(response[i].name);
        itemMessage.find('.idMessage').html(response[i].id);
        itemMessage.find('.message').html(response[i].message);
        var date_message = response[i].time.split(" ");
        var date = itemMessage.find('.message-date').html(date_message[1].split(':', 2).join(':'));
        $('.message-chat-content').append(itemMessage);
        $('.message-chat-content').scrollTop($('.message-chat-content').prop("scrollHeight"));

    }
}

//Funcion inicial donde se obtiene la informacion principal del directo, nombres, imagenes, el chat, etc. 
$(document).ready(function() {
    code = window.location.href.split('?')[1];

    $('.faqHREF').click(function() {
        code = window.location.href.split('?')[1];
        window.open('faq.html?code=' + code, "_blank");
    })

    $.ajax({
        url: "php/controller/guestController.php?method=getLive&code=" + code, //"jsonExample/session.json",
        type: "GET",
    }).done(function(data) {
        data = JSON.parse(data);
        live = data;
        id = data.id;
        company = data.company;
        //añadir nombre al title
        $('title').html(data.company.abbreviation + " - " + data.name);
        $('.tituloPonencia').html(data.name);
        if (data.warning != "") {
            $('#aviso').html(data.warning);
            $('#avisoResponsive').html(data.warning);
        }
        var date = data.date.split(" ");
        $('#date').html(date[0]);
        $('#initTime').html(data.init_time);
        $('#infoProgram').html(data.program)
        $('.polls').attr('href', data.survey);
        $('#copyright').append(company.copyright)
        if (Array.isArray(data.chat)) {
            cargeChat(data.chat, data.ip);
        } else if (data.chat == 2) {
            $('#questionChatList').hide();
            $('#disclaimerQuestionChat').show();
        } else {
            $('#chatBoton').hide();
            $('#accordionQuestionChat').hide();
        }
        if (data.logo_patro != "") {
            $('.imgPatron').attr('src', data.logo_patro);
        } else {
            $('.imgPatron').hide();
        }
        if (data.logo_company_alt != "") {
            $('#imgLogo').attr('src', data.logo_company_alt);
        } else {
            $('#imgLogo').attr('src', data.company.logo);
        }
        //Validacion estado del directo y dependiendo de su estado se muestre un poster u otro. Tambien se contempla si el poster es alternativo a los posters de la compañia
        if (data.status == 1) {
            if (data.inactive_poster_alt != "") {
                $('.poster').attr('src', data.inactive_poster_alt);
            } else {
                $('.poster').attr('src', data.company.inactive_poster);
            }
        } else if (data.status == 3) {
            if (data.passed_poster_alt != "") {
                $('.poster').attr('src', data.passed_poster_alt);
            } else {
                $('.poster').attr('src', data.company.passed_poster);
            }
        } else {
            activaDirectoAWS(data.url_front, data.company.default_poster);
        }
        //Validación de si se ha añadido cambios mediante css
        if (data.company.custom_css != null && data.company.custom_css != "") {
            $('style').html(data.company.custom_css);
        }
        obtenerDatos();
        changeColors(data.company);
    });

});


function changeStatus(data) {
    if (data.status == 1) {
        var $poster = $('<img class="poster img-fluid" src=""></img>');
        if (data.warning != "") {
            $('#aviso').html(data.warning);
            $('#avisoResponsive').html(data.warning);
        }
        if (live.inactive_poster_alt != "") {
            $poster.attr('src', live.inactive_poster_alt);
        } else {
            $poster.attr('src', live.company.inactive_poster);
        }
        $('#contenedorVideosGeneral').html($poster);
    } else if (data.status == 3) {
        var $poster = $('<img class="poster img-fluid" src=""></img>')
        if (live.passed_poster_alt != "") {
            $poster.attr('src', live.passed_poster_alt);
        } else {
            $poster.attr('src', live.company.passed_poster);
        }
        $('#contenedorVideosGeneral').html($poster);
    } else {
        if ($('#contenedorVideosGeneral').find('video').get().length == 0) {
            activaDirectoAWS(live.url_front, live.video_poster);
        }
    }
}

//Funcion para generar preguntas a traves del chat
$('#send-question').on('click', function() {
    var name = $('#nameUser').val();
    var message = $('#message-question').val();
    if (message == "") {
        $('#alertEmpty').show();
    } else {
        $('#alertEmpty').hide();
        var chatObject = new Object();
        chatObject.message = message;
        if (name == "") {
            chatObject.name = "Anónimo"; //TODO usar el del formulario
        } else {
            chatObject.name = name;
        }
        chatObject.lives_id = id;
        chatObject.type = 1;
        $.ajax({
            url: 'php/controller/chatController.php?method=saveMessage&id=' + id + '&data=' + JSON.stringify(chatObject),
            type: "GET",
        }).done(function(data) {
            data = JSON.parse(data);
            cargeChat(data.chat, data.ip);
            changeColors(company)
        });
        $('#message-question').val('');
    }
});
//Funcion para ir recordando cada minuto si hay cambios en el chat
function obtenerDatos() {
    setTimeout(function() {
        $.ajax({
            url: 'php/controller/guestController.php?method=streaming&id=' + id,
            type: "GET",
        }).done(function(data) {
            data = JSON.parse(data);
            if (data.chat != 0) {
                cargeChat(data.chat, data.ip);
            }
            obtenerDatos();
            changeColors(company);
            changeStatus(data);
        });
    }, 60000);

}

//Templates para la generacion de maquetacion del chat
var CHAT_TEMPLATE_DER =
    '<li class="dch content-message idMessage">' +
    '<div class="textColorPrimary"><span class="nameUser textColorPrimary"></span> - <span class="message-date"></span></div>' +
    '<div class="message-info primaryBackground row">' +
    '<div class="message "></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</li>';

//Templates para la generacion de maquetacion del chat
var CHAT_TEMPLATE_IZQ =
    '<li class="izq content-message idMessage">' +
    '<div><span class="nameUser"></span> - <span class="message-date"></span></div>' +
    '<div class=" message-info row">' +
    '<div class="message col-10"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</li>';


function activaDirectoAWS(urllive, urlposter) {
    $("#contenedorVideosGeneral").html("<video controls playsinline poster='" + urlposter + "''></video>").promise().done(function() {
        //document.addEventListener('DOMContentLoaded', () => {
        const source = urllive;
        const video = document.querySelector('video');
        // For more options see: https://github.com/sampotts/plyr/#options
        // captions.update is required for captions to work with hls.js
        const player = new Plyr(video, { captions: { active: true, update: true, language: 'en' } });
        if (!Hls.isSupported()) {
            video.src = source;
        } else {
            // For more Hls.js options, see https://github.com/dailymotion/hls.js
            const hls = new Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.debug = true;
            window.hls = hls;
            // Handle changing captions
            player.on('languagechange', () => {
                // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
                setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
            });
        }
        // Expose player so it can be used from the console
        window.player = player;
        window.player.debug = true;

        $('[data-plyr="play"]').on('click', function() {
            $('.plyr__poster').hide()
        })
    });

}

//Funciones de control del sidebar y los acordeones
$(function() {
    // Sidebar toggle behavior
    $('.sidebarCollapse').on('click', function() {
        $('#sidebar, #content,#contenedorVideosGeneral,#headContent').toggleClass('active');
        $('.sidebarCollapse').toggleClass('active');
        $('.accordion').toggleClass('d-none');
        $('.toggleSidebar').toggleClass('d-none');
        $('#sidebarHeader').toggleClass('d-none');
        $('#sidebarHeaderToggle').toggleClass('d-none');
        $('footer').toggleClass('d-none');
    });

    $('#programaBoton').on('click', function() {
        $('#collapseProgram').collapse('show');
    })
    $('#chatBoton').on('click', function() {
        $('#collapseQuestionChat').collapse('show')
    })
    $('#mediaBoton').on('click', function() {
        $('#collapseSocialMedia').collapse('show')
    });
});




function changeColors(company) {
    //modifico el backgrond, color de fuente y svg para el color primrio
    $('.primaryBackground').each(function(index) {
        $(this).css('background-color', company.primary_color);
    });

    $('.primaryBorder').each(function() {
        $(this).css('border-color', company.primary_color);
    })

    $('.svgPrimary').each(function(index) {
        $(this).find('rect').css('fill', company.primary_color)
    });

    $('.textColorPrimary').each(function(index) {
        $(this).css('color', company.primary_color);
    });
    //modifico el backgrond, color de fuente y svg para el color secundario
    $('.secondaryBackground').each(function(index) {
        $(this).css('background-color', company.secondary_color);
    });

    $('.secondaryBorder').each(function() {
        $(this).css('border-color', company.secondary_color);
    })

    $('.svgSecondaryBackground').each(function(index) {
        $(this).find('rect').css('fill', company.secondary_color)
    });
    $('.svgSecondaryColor').each(function(index) {
        $(this).find('path').css('fill', company.secondary_color)
    });

    $('.textColorSecondary').each(function(index) {
        $(this).css('color', company.secondary_color);
    });


    /* Cambio colores player */
    $('.plyr__control--overlaid').each(function(index) {
        $(this).css('color', company.primary_color);
    })
    $('.plyr__control').each(function(index) {
        $(this).css('color', company.primary_color);
    })

    $('.plyr--video .plyr__control').hover(function(index) {
        $(this).css('color', "white");
        $(this).css('background-color', company.primary_color);
    }, function(index) {
        $(this).css('color', company.primary_color);
        $(this).css('background-color', 'transparent');
    });

    $('.plyr__control--overlaid').hover(function(index) {
        $(this).css('color', "white");
        $(this).css('background-color', company.primary_color);
    }, function(index) {
        $(this).css('color', company.primary_color);
        $(this).css('background-color', 'white');
    });

    $('.plyr--full-ui input[type=range]').each(function(index) {
        $(this).css('color', company.primary_color);
    });
    console.log('entra')
}