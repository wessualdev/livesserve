$(document).ready(function () {

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);

    $('table').bootstrapTable({
        resizable: true
    });

    //pongo a null los parametros de navegaión
    navigationParams = null;

    loadTable();
    events();
});

function events() {

    //navega a la pantalla de sesiones para crear una nueva
    $('#createSessiondButton').click(function () {
        $('#adminMainContainer').load("sesionCreation.html");
    });

    //eventos cuando se pulsa un check box de la tabla
    $("#sessionTable").on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
            enableDisable();
        });

    $('#editSession').click(function () {
        var session = $('#sessionTable').bootstrapTable('getSelections');
        //mando los datos de la sessión chequeada
        navigationParams = session[0];
        $('#adminMainContainer').load("sesionCreation.html");
    });

    //borrar sesion
    $('#deleteSession').click(function(){
        //abro un modal para asegurarme que deseas borrar la sesión
        var sesionNames = "";
        var idSessionList = new Array();
        $('#sessionTable').bootstrapTable('getSelections').forEach(session => {
            //en el texto muestro el titulo de las sesiones y en la lista los id
            sesionNames +=  "<br> <strong>" + session.name + "</strong>";
            idSessionList.push(session.id);
        });
        //cambio los textos del modal
        $('#warningModal').find('.modal-title').html("Eliminar Sesiones");
        $('#warningModal').find('.modal-body').find('p').html("¿Estas seguro que deseas eliminar de forma definitiva las siguientes sesiones? " + sesionNames);

        //si se pulsa el botón de acción eliminamos las sesiones
        $('#actionBtn').unbind('click');
        $('#actionBtn').click(function(){
            deleteSessions(idSessionList);
        });

        $('#warningModal').modal('show');
    });
}

function enableDisable() {
    if (!$("#sessionTable").bootstrapTable('getSelections').length) {
        $('#deleteSession').prop('disabled', true);
        $('#deleteSession').removeClass('btn-primary');
    } else {
        $('#deleteSession').prop('disabled', false);
        $('#deleteSession').addClass('btn-primary');
    }
    if ($("#sessionTable").bootstrapTable('getSelections').length != 1) {
        $('#editSession').prop('disabled', true);
        $('#editSession').removeClass('btn-primary');
    } else {
        $('#editSession').prop('disabled', false);
        $('#editSession').addClass('btn-primary');
    }
}


function loadTable() {
    //obtengo todas sal sesiones de directos de la base de datos
    $.ajax({
        url: "../../php/controller/livesController.php?method=getAll",
        type: "GET",
    }).done(function (data) {

        var tableData = JSON.parse(data);

        //pinto los resultados en la tabla
        if (tableData.length > 0) {
            $('#sessionTable').bootstrapTable('load', tableData);
        } else {
            $('#sessionTable').bootstrapTable('removeAll');
        }

    });
}

function deleteSessions(idSessionList){

    $.ajax({
        url: "../../php/controller/livesController.php?method=delete",
        type: "POST",
        data: "data=" + JSON.stringify(idSessionList),
        processData: false,
    }).done(function (data) {
        if (data === 'true') {
            $('#warningModal').modal('toggle');
            loadTable();
        }else{
            alert("Fallo al borrar la sessión");
        }
    })
}

function statusColors(value, row) {
    
    var colors = {
        "1":"rgb(201, 23, 23)",
        "2":"rgb(19, 122, 19)",
        "3":"rgb(21, 21, 190)",
        "4":"rgb(187, 187, 22)"
    }

    return '<div class="circle" style="background-color: '+colors[row.status]+'"></div>';
  }