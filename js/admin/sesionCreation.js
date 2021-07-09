$(document).ready(function () {


    loadCompanies();
    loadUsers();

    //si se mandan datos en la navegación hes una sesión existente y se rellenan los datos
    if (navigationParams != null) {
        loadSessionData(navigationParams);
        $('#save').html('Modificar');
        $('#save').click(function () {
            updateSession();
        });
    } else {
        //si es para crear unno nuevo se ocultan los input de reunión chat y directo
        $('.onlyEdit').attr('style', 'display:none');
        //añado el evento de crear un nuevo directo al boton
        $('#save').click(function () {
            saveSession();
        });
    }

    events();
});

function events() {

    //cuando se añade una imagen se muestra una vista previa
    $('.inputImage').change(function () {
        var output = $(this).parent().parent().find('img')[0];
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }
        $(this).parent().parent().find('.removeImg').removeClass('hidden');
    });

    //cuando se añade el video del poster aquí se carga la vista previa
    $('#video_poster').change(function () {
        var $source = $('#previewVideo');
        $source[0].src = URL.createObjectURL(this.files[0]);
        $source.attr('controls', true)
        $source[0].load();
    });

    $('#support').change(function () {
        //cuando se cambie de usuario de soporte técnico se mostrarán sus URL
        var front = $("#support option:selected").data('front');
        var back = $("#support option:selected").data('back');
        $('#url_front').val(front);
        $('#url_back').val(back);
    });

    $('.live_status').find('button').click(function () {

        $('.live_status').find('button').removeClass('active');
        $(this).addClass('active');
    });

    $('#cancel').click(function () {
        //volver a la pantalla de inicio
        $('#adminMainContainer').load("adminSessions.html");
    });

    $('.removeImg').click(function(){
        //elimino la imagen de la vista previa y la quito de la base de datos
        $(this).parent().find('img').attr('src',"../../assets/imgs/tranparent.png");
        $(this).parent().parent().find('input').data('delete', true);
        $(this).parent().parent().find('input').val('');
        $(this).addClass('hidden');
    });
}


function loadUsers() {

    //cargo de forma dinamica todas las empresas que hay en la plataforma
    $.ajax({
        url: "../../php/controller/userController.php?method=technical",
        type: "GET",
        async: false,
    }).done(function (data) {

        var jsonData = JSON.parse(data);
        //primero vacio el combobox
        $('#support').html('<option value="">Seleciona un técnico</option>');

        jsonData.forEach(element => {
            //creo un option por cada entrada y lo añado al combobox
            var $option = $('<option value="' + element.id + '">' + element.name + '</option>');
            //añado las url del usuario al option
            $option.data('front', element.url_front);
            $option.data('back', element.url_back);

            $('#support').append($option);
        });
    });
}

function loadCompanies() {

    //cargo de forma dinamica todas las empresas que hay en la plataforma
    $.ajax({
        url: "../../php/controller/companyController.php?method=getAll",
        type: "GET",
        async: false,
    }).done(function (data) {

        var jsonData = JSON.parse(data);
        //primero vacio el combobox
        $('#company_id').html('<option value="">Seleciona un empresa</option>');

        jsonData.forEach(element => {
            //creo un option por cada entrada y lo añado al combobox
            var option = '<option value="' + element.id + '" data-abr="' + element.abbreviation + '">' + element.name + '</option>';
            $('#company_id').append(option);
        });
    });
}


function updateSession() {

    var session = new Object();
    //obtengo los datos del formulario
    var validate = true;
    //obtengo los datos del formulario
    $('.form-control').each(function () {
        var value = $(this).val();
        var name = $(this).attr('name');

        //si el campo es obligatorio y esta vacio lo marco en rojo
        if($(this).is(':required') && (value == "" || value == null || value == "null")){
            $(this).addClass('mandatory-alert');
            validate = false;
        }else{
            $(this).removeClass('mandatory-alert');
        }
        session[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }
    $('.form-control').each(function () {
        var value = $(this).val();
        var name = $(this).attr('name');

        session[name] = value;
    });
    session.status = $('.live_status').find('.active').data('value');
    session.code = generateCode();

    imageinObject(session, "logo_patro");
    imageinObject(session, "logo_company_alt");
    imageinObject(session, "passed_poster_alt");
    imageinObject(session, "inactive_poster_alt");

    if ($('#video_poster').val() != "") {
        session.video_poster = imgFolder + $('#video_poster')[0].files[0].name;
        uploadImages("video_poster");
    }


    //guardo la sesión en la base de datos
    $.ajax({
        url: "../../php/controller/livesController.php?method=update",
        type: "POST",
        data: "data=" + JSON.stringify(session) + "&id=" + + navigationParams.id,
        processData: false,
    }).done(function (data) {

        if (data === 'true') {

            //uploadImages("poster_podcast");
            $('#adminMainContainer').load("adminSessions.html");
        } else {
            alert("Fallo al modificar la sessión");
        }
    })
}

function imageinObject(object, param){
    //como todas las imagenes son opcionales comruebo que las hayan añadido para evitar un error
    if ($('#' + param).val() != "") {
        object[param] = imgFolder + $('#' + param)[0].files[0].name;
        uploadImages(param);
    }else{
        //si el data delete es true lo marco para borrarlo en base de datos
        if($('#' + param).data('delete')){
            object[param] = "delete";
        }
    }
}

function saveSession() {

    var session = new Object();
    //obtengo los datos del formulario
    var validate = true;
    //obtengo los datos del formulario
    $('.form-control').each(function () {
        var value = $(this).val();
        var name = $(this).attr('name');

        //si el campo es obligatorio y esta vacio lo marco en rojo
        if($(this).is(':required') && (value == "" || value == null || value == "null")){
            $(this).addClass('mandatory-alert');
            validate = false;
        }else{
            $(this).removeClass('mandatory-alert');
        }
        session[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }
    session.status = $('.live_status').find('.active').data('value');
    session.code = generateCode();

    //como todas las imagenes son opcionales comruebo que las hayan añadido para evitar un error
    //primero obtengo el nombre del recurso y lo añado al objeto del formulario
    //despues subo el recurso al servidor
    if ($('#logo_patro').val() != "") {
        session.logo_patro = imgFolder + $('#logo_patro')[0].files[0].name;
        uploadImages("logo_patro");
    }
    if ($('#logo_company_alt').val() != "") {
        session.logo_company_alt = imgFolder + $('#logo_company_alt')[0].files[0].name;
        uploadImages("logo_company_alt");
    }
    if ($('#passed_poster_alt').val() != "") {
        session.passed_poster_alt = imgFolder + $('#passed_poster_alt')[0].files[0].name;
        uploadImages("passed_poster_alt");
    }
    if ($('#inactive_poster_alt').val() != "") {
        session.inactive_poster_alt = imgFolder + $('#inactive_poster_alt')[0].files[0].name;
        uploadImages("inactive_poster_alt");
    }
    if ($('#video_poster').val() != "") {
        session.video_poster = imgFolder + $('#video_poster')[0].files[0].name;
        uploadImages("video_poster");
    }


    //guardo la sesión en la base de datos
    $.ajax({
        url: "../../php/controller/livesController.php?method=create",
        type: "POST",
        data: "data=" + JSON.stringify(session),
        processData: false,
    }).done(function (data) {

        if (data === 'true') {

            //uploadImages("poster_podcast");
            $('#adminMainContainer').load("adminSessions.html");
        } else {
            alert("Fallo al crear la sessión");
        }
    })
}


function loadSessionData(params) {

    //las key del objeto coinciden con los id de los input
    var keys = Object.keys(params);

    //muestro la vista previa de los logos
    preloadImages(params, "logo_company_alt");
    preloadImages(params, "logo_patro");
    preloadImages(params, "passed_poster_alt");
    preloadImages(params, "inactive_poster_alt");
    if(params.video_poster != null || params.video_poster != ""){
        $("#video_poster").parent().parent().parent().find('video').attr('src', "../../" + params.video_poster);
        $("#video_poster").parent().parent().parent().find('video').attr('controls', true)
    }
    
    keys.forEach(key => {

        try {

            if (key == "date") {
                //el formato de la fecha debe ser yyyy-MM-dd
                params[key] = params[key].split(' ')[0];
            }

            //pon en cada input el valor de cada ropiedad
            $('#' + key).val(params[key]);
        } catch (e) { }
    });
    //dependiendo del stado del directo marcamos un botón u otro
    var status = params.status;
    $('.live_status').find('button').removeClass('active');
    $('.live_status').find("[data-value='" + status + "']").addClass('active');

    var serverUrl = window.location.href.replace('view/admin/adminIndex.html','');
    
    //general la url del directo y del chat dependiendo del id de la reunión
    $('#live_url').val(serverUrl + '/?' + params.code);
    $('#url_chat').val(serverUrl + '/chat.html?code=' + params.code);
}

function preloadImages(params, paramName){

    var element = params[paramName];
    if(element == null || element == ""){
        $("#" +paramName).parent().parent().find('img').attr('src', "../../assets/imgs/tranparent.png");
    }else{
        $("#" +paramName).parent().parent().find('img').attr('src', "../../" + element);
        $("#" +paramName).parent().parent().find('.removeImg').removeClass('hidden');
    }
}

function uploadImages(idInput) {

    var myFormData = new FormData();
    myFormData.append('logo', $('#' + idInput)[0].files[0]);

    $.ajax({
        url: '../../php/controller/imagesController.php',
        type: 'POST',
        processData: false, // important
        contentType: false, // important
        dataType: 'json',
        data: myFormData
    });
}

function generateCode() {

    var abr = $("#company_id option:selected").data('abr');

    //si estamos editando uso como fecha la de creación
    var date = new Date();
    if (navigationParams != null) {
        date = new Date(navigationParams.added);
    }

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var name = $('#name').val().split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');

    var code = abr + year + month + day + name;

    return code;
}