$(document).ready(function () {
    'use strict';

    function actualizarPasswordAjax(nvoPass, id) {
        var uri = 'http://' + window.location.host + '/Usuario/actualizar_password';
        $.ajax({
            url: uri,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: 'text',
            data: {
                nvo_password: nvoPass,
                id_user: id
            }
        }).done(function (data, textStatus, jqXHR) {
            $('#pass_nvo').val("");
            $('#pass_repet').val("");
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-danger alert-info hidden').addClass('alert-success', 'text-center');
            $('#texto_alert_usuarios').text('La contraseña se actualizó correctamente. Mensaje del servidor: ' + textStatus);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
            $('#texto_alert_usuarios').text('Ha ocurrido un error, la contraseña no ha podido actualizarse. Mensaje del servidor: ' + textStatus + ' ' + errorThrown);
        });
    }

    $('.btn-warning').click(function () {
        var user = $(this).attr('id');
        $('#btn_modal_actualizar').attr('id', 'btn_actualizar-' + user);
        $('#modal_update_pass').modal('show');

        $('#btn_actualizar-update-1').click(function () {
            var id = $(this).attr('id');
            id = id.split('-');
            var idUser = id[id.length - 1];
            console.log(idUser);
            var pass1 = $('#pass_nvo').val();
            var pass2 = $('#pass_repet').val();
            alert('por evaluar');
            if (pass1 === pass2) {
                actualizarPasswordAjax(pass2, idUser);
            }
            else {
                $('#alert_backend_usuario').removeClass('alert-default alert-success alert-danger alert-info hidden').addClass('alert-warning', 'text-center');
                $('#texto_alert_usuarios').text('Las contraseñas no coinciden.');
                $('#pass_nvo').val("");
                $('#pass_repet').val("");
            }
        });
    });

});