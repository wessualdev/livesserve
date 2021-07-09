$(document).ready(function () {

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);

    $('table').bootstrapTable({
        resizable: true
    });

    loadCompanies();
    events();
});

function events() {
    $('#createCompanyButton').click(function () {
        //limpio todos los input
        $('.form-control').val('');
        $('.image').attr('src', "../../assets/imgs/tranparent.png");
        $('input').removeClass('mandatory-alert');
        $('.removeImg').addClass('hidden');

        $('#companyCreation').modal('show');

        //le pongo es escuchador para crear el nuevo usuario
        $('#companyActionBtn').unbind('click');
        $('#companyActionBtn').click(function () {
            createCompany();
        });
    });


    $('#editCompany').click(function () {

        //uso la empresa selecionaod en la tabla
        var company = $('#companyTable').bootstrapTable('getSelections')[0];

        //las key del objeto coinciden con los id de los input
        var keys = Object.keys(company);
        keys.forEach(key => {
            if (key != "logo" && key != "passed_poster" && key != "inactive_poster" && key != "default_poster")
                $('#' + key).val(company[key]);
        });
        
        preloadImages(company, "logo");
        preloadImages(company, "passed_poster");
        preloadImages(company, "inactive_poster");
        preloadImages(company, "default_poster");

        $('input').removeClass('mandatory-alert');

        $('#companyCreation').modal('show');

        //le pongo es escuchador para crear la nueva empresa
        $('#companyActionBtn').unbind('click');
        $('#companyActionBtn').click(function () {
            editCompany();
        });
    });

    $('.removeImg').click(function(){
        //elimino la imagen de la vista previa y la quito de la base de datos
        $(this).parent().find('img').attr('src',"../../assets/imgs/tranparent.png");
        $(this).parent().parent().find('input').data('delete', true);
        $(this).parent().parent().find('input').val('');
        $(this).addClass('hidden');
    });

    //cuando se añade una imagen se muestra una vista previa
    $('.inputImage').change(function () {
        var output = $(this).parent().parent().find('img')[0];
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }
        $(this).parent().parent().find('.removeImg').removeClass('hidden');
    });

    //borrar sesion
    $('#deleteCompany').click(function () {
        //abro un modal para asegurarme que deseas borrar las empreas
        var companyNames = "";
        var idCompanyList = new Array();
        $('#companyTable').bootstrapTable('getSelections').forEach(company => {
            //en el texto muestro el nombre de las empresas y en la lista los id
            companyNames += "<br> <strong>" + company.name + "</strong>";
            idCompanyList.push(company.id);
        });
        //cambio los textos del modal
        $('#warningModal').find('.modal-title').html("Eliminar Empresas");
        $('#warningModal').find('.modal-body').find('p').html("¿Estas seguro que deseas eliminar de forma definitiva las siguientes empresas? " + companyNames);

        //si se pulsa el botón de acción eliminamos las empresas
        $('#actionBtn').unbind('click');
        $('#actionBtn').click(function () {
            deleteCompany(idCompanyList);
        });

        $('#warningModal').modal('show');
    });

    //eventos cuando se pulsa un check box de la tabla
    $("#companyTable").on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
            enableDisable();
        });
}

function deleteCompany(idCompanyList) {

    $.ajax({
        url: "../../php/controller/companyController.php?method=delete",
        type: "POST",
        data: "data=" + JSON.stringify(idCompanyList),
        processData: false,
    }).done(function (data) {
        if (data === 'true') {
            $('#warningModal').modal('toggle');
            loadCompanies();
        } else {
            alert("Fallo al eliminar la empresa");
        }
    })
}

function enableDisable() {
    if (!$("#companyTable").bootstrapTable('getSelections').length) {
        $('#deleteCompany').prop('disabled', true);
        $('#deleteCompany').removeClass('btn-primary');
    } else {
        $('#deleteCompany').prop('disabled', false);
        $('#deleteCompany').addClass('btn-primary');
    }
    if ($("#companyTable").bootstrapTable('getSelections').length != 1) {
        $('#editCompany').prop('disabled', true);
        $('#editCompany').removeClass('btn-primary');
    } else {
        $('#editCompany').prop('disabled', false);
        $('#editCompany').addClass('btn-primary');
    }
}

function editCompany() {
    var company = new Object();
    var validate = true;
    //obtengo los datos del formulario
    $('.form-control').each(function () {
        var value = $(this).val();
        var name = $(this).attr('name');

        //si el campo es obligatorio y esta vacio lo marco en rojo
        if ($(this).is(':required') && (value == "" || value == null || value == "null")) {
            $(this).addClass('mandatory-alert');
            validate = false;
        } else {
            $(this).removeClass('mandatory-alert');
        }
        company[name] = value;
    });

    if (!validate) {
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }
    var id = $('#companyTable').bootstrapTable('getSelections')[0].id;

    //si no se han modificado las imagenes no se tiene porque volver a subir
    if ($('#logo').val() != '') {
        company.logo = imgFolder + $('#logo')[0].files[0].name;
        uploadImages('logo');
    }

    imageinObject(company, "inactive_poster");
    imageinObject(company, "passed_poster");
    imageinObject(company, "default_poster");
    //guardo la empresa en la base de datos
    $.ajax({
        url: "../../php/controller/companyController.php?method=update",
        type: "POST",
        data: "data=" + JSON.stringify(company) + "&id=" + id,
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            $('#companyCreation').modal('toggle');
            loadCompanies();
        } else {
            alert("Fallo al modificar la empresa");
        }
    })
}

function createCompany() {
    var company = new Object();
    //obtengo los datos del formulario
    var validate = true;
    //obtengo los datos del formulario
    $('.form-control').each(function () {
        var value = $(this).val();
        var name = $(this).attr('name');

        //si el campo es obligatorio y esta vacio lo marco en rojo
        if ($(this).is(':required') && (value == "" || value == null || value == "null")) {
            $(this).addClass('mandatory-alert');
            validate = false;
        } else {
            $(this).removeClass('mandatory-alert');
        }
        company[name] = value;
    });

    //el logo es obligatorio
    if ($('#logo')[0].files.length == 0) {
        $('#logo').addClass('mandatory-alert');
        validate = false;
    } else {
        $('#logo').removeClass('mandatory-alert');
        company.logo = imgFolder + $('#logo')[0].files[0].name;
    }

    if (!validate) {
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }


    //las imagenes de poster no son obligartorias, por lo tanto si no se añaden no se guardan en el servidor
    if ($('#inactive_poster').val() != '') {
        company.inactive_poster = imgFolder + $('#inactive_poster')[0].files[0].name;
        uploadImages('inactive_poster');
    }
    if ($('#passed_poster').val() != '') {
        company.passed_poster = imgFolder + $('#passed_poster')[0].files[0].name;
        uploadImages('passed_poster');
    }
    if ($('#default_poster').val() != '') {
        company.default_poster = imgFolder + $('#default_poster')[0].files[0].name;
        uploadImages('default_poster');
    }

    //guardo la empresa en la base de datos
    $.ajax({
        url: "../../php/controller/companyController.php?method=create",
        type: "POST",
        data: "data=" + JSON.stringify(company),
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            uploadImages('logo');
            $('#companyCreation').modal('toggle');
            loadCompanies();
        } else {
            alert("Fallo al crear la empresa");
        }
    })
}

function loadCompanies() {

    //cargo de forma dinamica todas las empresas que hay en la plataforma
    $.ajax({
        url: "../../php/controller/companyController.php?method=getAll",
        type: "GET",
        async: false,
    }).done(function (data) {

        var jsonData = JSON.parse(data);

        //pinto los resultados en la tabla
        if (jsonData.length > 0) {
            $('#companyTable').bootstrapTable('load', jsonData);
        } else {
            $('#companyTable').bootstrapTable('removeAll');
        }
    });
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

function preloadImages(params, paramName){
    var element = params[paramName];
    if(element == null || element == ""){
        $("#" +paramName).parent().parent().find('img').attr('src', "../../assets/imgs/tranparent.png");
        $("#" +paramName).parent().parent().find('.removeImg').addClass('hidden');
    }else{
        $("#" +paramName).parent().parent().find('img').attr('src', "../../" + element);
        $("#" +paramName).parent().parent().find('.removeImg').removeClass('hidden');
    }
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