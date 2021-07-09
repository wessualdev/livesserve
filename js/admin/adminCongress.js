$(document).ready(function () {

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);

    $('table').bootstrapTable({
        resizable: true
    });

    //pongo a null los parametros de navegaión
    navigationParams = null;

    loadCompanies();
    loadTable();
    events();
});

function events() {

    //eventos cuando se pulsa un check box de la tabla
    $("#congressTable").on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
            enableDisable();
        });

    $('#createCongressButton').click(function () {
        //limpio todos los input
        $('.form-control').val('');
        $('input').removeClass('mandatory-alert');

        $('#congressCreation').modal('show');

        //le pongo es escuchador para crear el nuevo congreso
        $('#congressActionBtn').unbind('click');
        $('#congressActionBtn').click(function () {
            createCongress();
        });
    });

    $('#editCongresss').click(function () {

        //uso el usuario selecionaod en la tabla
        var congress = $('#congressTable').bootstrapTable('getSelections')[0];

        //las key del objeto coinciden con los id de los input
        var keys = Object.keys(congress);

        keys.forEach(key => {

            if (key == "end_date" || key == "init_date") {
                //el formato de la fecha debe ser yyyy-MM-dd
                congress[key] = congress[key].split(' ')[0];
            }

            //pon en cada input el valor de cada ropiedad
            $('#' + key).val(congress[key]);
        });
        $('input').removeClass('mandatory-alert');

        $('#congressCreation').modal('show');

        //le pongo es escuchador para crear el nuevo congreso
        $('#congressActionBtn').unbind('click');
        $('#congressActionBtn').click(function () {
            editCongress();
        });
    });

    //borrar congreso
    $('#deleteCongress').click(function(){
        //abro un modal para asegurarme que deseas borrar los congresos
        var congressNames = "";
        var idCongressList = new Array();
        $('#congressTable').bootstrapTable('getSelections').forEach(congress => {
            //en el texto muestro el nombre de los usuarios y en la lista los id
            congressNames +=  "<br> <strong>" + congress.name + "</strong>";
            idCongressList.push(congress.id);
        });
        //cambio los textos del modal
        $('#warningModal').find('.modal-title').html("Eliminar Congresos");
        $('#warningModal').find('.modal-body').find('p').html("¿Estas seguro que deseas eliminar de forma definitiva los siguientes congresos? " + congressNames);

        //si se pulsa el botón de acción eliminamos los congresos
        $('#actionBtn').unbind('click');
        $('#actionBtn').click(function(){
            deleteCongress(idCongressList);
        });

        $('#warningModal').modal('show');
    });
}

function deleteCongress(idCongressList){
    $.ajax({
        url: "../../php/controller/congressController.php?method=delete",
        type: "POST",
        data: "data=" + JSON.stringify(idCongressList),
        processData: false,
    }).done(function (data) {
        if (data === 'true') {
            $('#warningModal').modal('toggle');
            loadTable();
        }else{
            alert("Fallo al borrar el congreso");
        }
    })
}

function editCongress(){

    var congress = new Object();
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
        congress[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }

    var id = $('#congressTable').bootstrapTable('getSelections')[0].id;
    //guardo el congreso en la base de datos
    $.ajax({
        url: "../../php/controller/congressController.php?method=update",
        type: "POST",
        data: "data=" + JSON.stringify(congress) + "&id=" + id,
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            $('#congressCreation').modal('toggle');
            loadTable();
        } else {
            alert("Fallo al crear el congreso");
        }
    })

}

function enableDisable() {
    if (!$("#congressTable").bootstrapTable('getSelections').length) {
        $('#deleteCongress').prop('disabled', true);
        $('#deleteCongress').removeClass('btn-primary');
    } else {
        $('#deleteCongress').prop('disabled', false);
        $('#deleteCongress').addClass('btn-primary');
    }
    if ($("#congressTable").bootstrapTable('getSelections').length != 1) {
        $('#editCongresss').prop('disabled', true);
        $('#editCongresss').removeClass('btn-primary');
    } else {
        $('#editCongresss').prop('disabled', false);
        $('#editCongresss').addClass('btn-primary');
    }
}

function loadTable() {
    //obtengo todas sal sesiones de directos de la base de datos
    $.ajax({
        url: "../../php/controller/congressController.php?method=getAll",
        type: "GET",
    }).done(function (data) {

        var tableData = JSON.parse(data);

        //pinto los resultados en la tabla
        if (tableData.length > 0) {
            $('#congressTable').bootstrapTable('load', tableData);
        } else {
            $('#congressTable').bootstrapTable('removeAll');
        }

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

        jsonData.forEach(element => {
            //creo un option por cada entrada y lo añado al combobox
            var option = '<option value="' + element.id + '">' + element.name + '</option>';
            $('#company_id').append(option);
        });
    });
}

function createCongress() {
    var congress = new Object();
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
        congress[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }

    //guardo el usuario en la base de datos
    $.ajax({
        url: "../../php/controller/congressController.php?method=create",
        type: "POST",
        data: "data=" + JSON.stringify(congress),
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            $('#congressCreation').modal('toggle');
            loadTable();
        } else {
            alert("Fallo al crear el congreso");
        }
    })
}