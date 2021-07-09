$(document).ready(function () {

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);

    $('table').bootstrapTable({
        resizable: true
    });

    loadCompanies();
    loadTable();
    events();
});

function loadTable() {
    //obtengo todo los usuarios de la base de datos
    $.ajax({
        url: "../../php/controller/userController.php?method=getAll",
        type: "GET",
    }).done(function (data) {
        var tableData = JSON.parse(data);

        //pinto los resultados en la tabla
        if (tableData.length > 0) {
            $('#usersTable').bootstrapTable('load', tableData);
        } else {
            $('#usersTable').bootstrapTable('removeAll');
        }

    });
}


function events() {
    $('#createUserButton').click(function () {
        //limpio todos los input
        $('.form-control').val('');
        $('input').removeClass('mandatory-alert');


        //algunos option hay que iniciarlos como null
        $('#company_id').val("null");

        $('#userCreation').modal('show');

        //le pongo es escuchador para crear el nuevo usuario
        $('#userActionBtn').unbind('click');
        $('#userActionBtn').click(function () {
            createUser();
        });
    });

    $('#editUser').click(function () {

        //uso el usuario selecionaod en la tabla
        var user = $('#usersTable').bootstrapTable('getSelections')[0];

        //las key del objeto coinciden con los id de los input
        var keys = Object.keys(user);

        keys.forEach(key => {

            if (key == "date") {
                //el formato de la fecha debe ser yyyy-MM-dd
                user[key] = user[key].split(' ')[0];
            }

            //pon en cada input el valor de cada ropiedad
            $('#' + key).val(user[key]);
        });

        $('input').removeClass('mandatory-alert');
        $('#userCreation').modal('show');

        //le pongo es escuchador para crear el nuevo usuario
        $('#userActionBtn').unbind('click');
        $('#userActionBtn').click(function () {
            editUser();
        });
    });

    //borrar user
    $('#deleteUser').click(function(){
        //abro un modal para asegurarme que deseas borrar los usuarios
        var userNames = "";
        var idUsersList = new Array();
        $('#usersTable').bootstrapTable('getSelections').forEach(user => {
            //en el texto muestro el nombre de los usuarios y en la lista los id
            userNames +=  "<br> <strong>" + user.name + "</strong>";
            idUsersList.push(user.id);
        });
        //cambio los textos del modal
        $('#warningModal').find('.modal-title').html("Eliminar Usuarios");
        $('#warningModal').find('.modal-body').find('p').html("¿Estas seguro que deseas eliminar de forma definitiva los siguientes usuarios? " + userNames);

        //si se pulsa el botón de acción eliminamos los usuarios
        $('#actionBtn').unbind('click');
        $('#actionBtn').click(function(){
            deleteUser(idUsersList);
        });

        $('#warningModal').modal('show');
    });

    //eventos cuando se pulsa un check box de la tabla
    $("#usersTable").on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
            enableDisable();
        });
}

function editUser() {
    var user = new Object();
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
        user[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }

    var id = $('#usersTable').bootstrapTable('getSelections')[0].id;
    //guardo el usuario en la base de datos
    $.ajax({
        url: "../../php/controller/userController.php?method=update",
        type: "POST",
        data: "data=" + JSON.stringify(user) + "&id=" + id,
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            $('#userCreation').modal('toggle');
            loadTable();
        } else {
            alert("Fallo al crear el usuario");
        }
    })
}


function deleteUser(idUsersList){

    $.ajax({
        url: "../../php/controller/userController.php?method=delete",
        type: "POST",
        data: "data=" + JSON.stringify(idUsersList),
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

function enableDisable() {
    if (!$("#usersTable").bootstrapTable('getSelections').length) {
        $('#deleteUser').prop('disabled', true);
        $('#deleteUser').removeClass('btn-primary');
    } else {
        $('#deleteUser').prop('disabled', false);
        $('#deleteUser').addClass('btn-primary');
    }
    if ($("#usersTable").bootstrapTable('getSelections').length != 1) {
        $('#editUser').prop('disabled', true);
        $('#editUser').removeClass('btn-primary');
    } else {
        $('#editUser').prop('disabled', false);
        $('#editUser').addClass('btn-primary');
    }
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


function createUser() {
    var user = new Object();
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
        user[name] = value;
    });

    if(!validate){
        alert("Por favor, complete todos los campos obligatorios");
        return;
    }

    //guardo el usuario en la base de datos
    $.ajax({
        url: "../../php/controller/userController.php?method=create",
        type: "POST",
        data: "data=" + JSON.stringify(user),
        processData: false,
    }).done(function (data) {

        if (data === 'true') {
            $('#userCreation').modal('toggle');
            loadTable();
        } else {
            alert("Fallo al crear el usuario");
        }
    })
}