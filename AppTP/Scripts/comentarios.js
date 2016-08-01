$(document).ready(function () {
    'use strict'

    if (window.location.pathname === '/Comentarios') {
        alertToogle();
        caracteresTextarea('respuesta', 'cant_char');

        if (leerCookie('cerrado')) {
            $('#alert_backend_usuario').removeClass('hidden').addClass('alert-success');
            $('#texto_alert_usuarios').html(leerCookie('cerrado'));
            eliminarCookie('cerrado');
        }

        $('.cerrar-comentario').on('click', function (event) {
            event.preventDefault();
            var id = $(this).attr('id');
            id = id.split('_');
            id = id[id.length - 1];
            $('#modal_cerrar_comentario').modal('show');
            $('#id_comentario').val(id);
            $('#id_usuario').val(leerCookie('UserId'));
            $('.cerrar-comentario-tt').html('<i class="fa fa-commenting-o" aria-hidden="true"></i> ' + $('#nombre_' + id).text() + ' <small><i class="fa fa-envelope-square" aria-hidden="true"></i> ' + $('#mail_' + id).text() + ' | <i class="fa fa-calendar" aria-hidden="true"></i> ' + $('#fecha_' + id).text() + '</small>');
        
            function setearContenidoComentario(data) {
                var comment = JSON.parse(data);
                var text = comment[0].comentario1.split('*');
                text = text.join('</p><p>');
                $('#contenido_comentario').html(text);
            }
            consultaAjax('/Comentarios/buscar_comentario', 'POST', 'json', { tabla: 'Comentario', id_comentario: parseInt(id) }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, setearContenidoComentario);
            $('#btn_cerrar_comentario').on('click', function () {
                function mensajeServidor(data) {
                    var response = JSON.parse(data);
                    crearCookie('cerrado', response.Data, '/');
                    window.location.href = 'http://' + window.location.host + '/Comentarios';
                }
                consultaAjax('/Comentarios/cerrar_comentario', 'POST', 'json', { id_comentario: $('#id_comentario').val(), respuesta: $('#respuesta').val(), id_usuario: $('#id_usuario').val() }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, mensajeServidor);
                $('#modal_cerrar_comentario').modal('hide');
            });
        });
    }
    if (window.location.pathname === "/Comentarios/Finalizados") {
        if (leerCookie('actualizado') || leerCookie('eliminado')) {
            $('#alert_backend_usuario').removeClass('hidden').addClass('alert-success');
            $('#texto_alert_usuarios').html(leerCookie('actualizado') || leerCookie('eliminado'));
            eliminarCookie('actualizado') || eliminarCookie('eliminado');
        }
        caracteresTextarea('respuesta', 'cant_char');
        $('.ver-cerrado').click(function (event) {
            event.preventDefault();
            var id = $(this).attr('id').split('_');
            id = id[id.length - 1];

            $('#id_comentario').val(id);
            $('#id_usuario').val(parseInt(leerCookie('UserId')));
            function setContentCerrados(data) {
                var comment = JSON.parse(data);
                var text = comment[0].comentario1.split('*');
                text = text.join('<br />');
                var text2 = comment[0].respuesta.split('*');
                text2 = text2.join('<br />');
                $('.ver-cerrados-tt').html('<i class="fa fa-commenting-o" aria-hidden="true"></i> ' + comment[0].apellido + ', ' + comment[0].nombre + ' <small><i class="fa fa-envelope-square" aria-hidden="true"></i> ' + comment[0].mail + ' | <i class="fa fa-calendar" aria-hidden="true"></i> ' + comment[0].fecha_pregunta + '</small>');
                $('#com').html(text);
                $('#resp').html(text2);
                $('#nom').html(comment[0].apellido + ', ' + comment[0].nombre);
                $('#mail').html(comment[0].mail);
                $('#phone').html(comment[0].telefono);
                $('#cel').html(comment[0].celular);
                $('#fecha_com').html(comment[0].fecha_pregunta);
                $('#fecha_resp').html(comment[0].fecha_respuesta);
            }
            consultaAjax('/Comentarios/buscar_comentario', 'POST', 'json', { tabla: 'Comentario', id_comentario: parseInt(id) }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, setContentCerrados);
            $('#ver_cerrados').modal('show');

            $('#btn_cerrar_comentario').click(function () {
                $('#frm_actualizar_respuesta').removeClass('hidden');
                $(this).html('¡Actualizar! <i class="fa fa-refresh" aria-hidden="true"></i>').removeClass('btn-warning').addClass('btn-info').click(function () {
                    function mensajeServidor(data) {
                        var response = JSON.parse(data);
                        crearCookie('actualizado', response.Data, '/');
                        window.location.href = 'http://' + window.location.host + '/Comentarios/Finalizados';
                    }
                    consultaAjax('/Comentarios/cerrar_comentario', 'POST', 'json', { id_comentario: $('#id_comentario').val(), respuesta: $('#respuesta').val(), id_usuario: $('#id_usuario').val() }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, mensajeServidor);
                });
                $('#ver_cerrados').on('hide.bs.modal', function (event) {
                    $('#btn_cerrar_comentario').off('click');
                    $('#frm_actualizar_respuesta').addClass('hidden');
                });
            });
        });

        $('.eliminar-cerrado').click(function (event) {
            event.preventDefault();
            var id = $(this).attr('id').split('_');
            id = id[id.length - 1];
            $('#id_eliminar').val(id);
            function setConfirmDelete(data) {
                var comment = JSON.parse(data);
                $('.confirmar-eliminar').html('<i class="fa fa-commenting-o" aria-hidden="true"></i> ' + comment[0].apellido + ', ' + comment[0].nombre + ' <small><i class="fa fa-envelope-square" aria-hidden="true"></i> ' + comment[0].mail + ' | <i class="fa fa-calendar" aria-hidden="true"></i> ' + comment[0].fecha_pregunta + '</small>');
            }
            consultaAjax('/Comentarios/buscar_comentario', 'POST', 'json', { tabla: 'Comentario', id_comentario: parseInt($('#id_eliminar').val()) }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, setConfirmDelete);
            $('#confirmar_eliminar').modal('show');

            $('#eliminar_permanentemente').on('click', function () {
                function mensajeServidor(data) {
                    var response = JSON.parse(data);
                    crearCookie('eliminado', response.Data, '/');
                    window.location.href = 'http://' + window.location.host + '/Comentarios/Finalizados';
                }
                consultaAjax('/Comentarios/eliminar_comentario', 'POST', 'json', { id_comentario: parseInt($('#id_eliminar').val()) }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, mensajeServidor);
                $('#confirmar_eliminar').modal('hide');
            });
        });
    }
});