$(document).ready(function () {
    'use strict';

    alertToogle();

    function alertCrearUsuarios(textAlert, tipeAlert) {
        var add, remove = "";
        if (tipeAlert === 'success') {
            add = 'alert-success';
            remove = 'alert-danger';
        } else if (tipeAlert === 'warning') {
            add = 'alert-danger';
            remove = 'alert-success';
        }
        $('#alert_backend_usuario').removeClass('alert-default', 'alert-warning ', remove, 'alert-info hidden').addClass(add, 'text-center');
        $('#texto_alert_usuarios').text(textAlert);
    }

    function crearUsuarios() {
        $('#modal_create_user').modal('show');

        $('#crear').click(function (event) {
            event.preventDefault();

            $('#foto_perfil').val($('#foto_propia').val());

            if ($('#nombre').val() !== $('#apellido').val()) {
                if ($('#password').val() === $('#pass').val()) {
                    $('#frm_crear_usuario').submit();
                    $('#modal_create_user').modal('hide');
                } else {
                    $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
                    $('#texto_alert_usuarios').text('Las contraseñas no coinciden.');
                    $('#password').attr('style', 'border: 2px solid #FF0000');
                    $('#pass').attr('style', 'border: 2px solid #FF0000');
                }
            } else {
                $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
                $('#texto_alert_usuarios').text('El nombre y el apellido del usuario no pueden ser iguales.');
                $('#nombre').attr('style', 'border: 2px solid #FF0000');
                $('#apellido').attr('style', 'border: 2px solid #FF0000');
            }
        });
    }

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

    if (window.location.pathname === '/Usuario') {
        if (leerCookie('crear')) {
            crearUsuarios();
            eliminarCookie('crear');
        }
        else if (leerCookie('IdEdit')) {
            function editUserInfo(data) {
                var user = JSON.parse(data);
                $('#username').val(user.username);
                $('#nombre').val(user.nombre);
                $('#apellido').val(user.apellido);
                $('#mail').val(user.mail);
                $('#telefono').val(user.telefono);
                $('#id_avatar option[value=' + user.id_avatar + ']').attr('selected', 'selected');
                $('#id_rules option[value=' + user.id_rules + ']').attr('selected', 'selected');
                $('#password').attr('disabled', 'disabled');
                $('#pass').attr('disabled', 'disabled');
                $('#frm_crear_usuario').append($('input[type=hidden]').attr('id', 'id_usuario').attr('name', 'id_usuario').val(user.id_usuario));
                $('#crear').html('Editar').removeClass('btn-primary').addClass('btn-warning').on('click', function () {
                    $('#frm_crear_usuario').submit();
                });
                $('#frm_crear_usuario').attr('action', '/Usuario/editar_usuario').attr('method', 'POST');
                $('#modal_create_user').on('hide.bs.modal', function () {
                    $('#username').val('');
                    $('#nombre').val('');
                    $('#apellido').val('');
                    $('#mail').val('');
                    $('#telefono').val('');
                    $('#id_avatar option[value=1]').attr('selected', 'selected');
                    $('#id_rules option[value=1]').attr('selected', 'selected');
                    $('#password').removeAttr('disabled');
                    $('#pass').removeAttr('disabled');
                    $('#crear').html('Crear').removeClass('btn-warning').addClass('btn-primary');
                    $('#frm_crear_usuario').attr('action', '/Usuario/crear_usuario');
                });
            }
            crearUsuarios();
            consultaAjax('/Usuario/editar_usuario', 'GET', 'json', { id: leerCookie('IdEdit') }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, editUserInfo);
            eliminarCookie('IdEdit');
        }

        $('#crear_usuario_lateral').on('click', function (event) {
            event.preventDefault();
            crearUsuarios();
        });

        $('#crear_usuario').on('click', function (event) {
            event.preventDefault();
            crearUsuarios();
        });

        $('.btn-warning').on('click', function () {
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
    } else {
        $('#crear_usuario_lateral').click(function (event) {
            event.preventDefault();
            window.location.href = 'http://' + window.location.host + '/Usuario';
            crearCookie('crear', true);
            //$('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
            //$('#texto_alert_usuarios').text('Debe acceder a la sección de usuarios para dar de alta un usuario.');
        });
    }

    // Perfil de usuario
    if (window.location.pathname.match(/Usuario\/perfil/)) {
        $('#edit_user').on('click', function (event) {
            event.preventDefault();
            var id = window.location.pathname;
            id = id.split('/');
            id = id[id.length - 1];
            window.location.href = 'http://' + window.location.host + '/Usuario';
            crearCookie('IdEdit', id);
        });
    }
});