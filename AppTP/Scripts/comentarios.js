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
                    crearCookie('cerrado', response.Data);
                    window.location.href = 'http://' + window.location.host + '/Comentarios';
                }
                consultaAjax('/Comentarios/cerrar_comentario', 'POST', 'json', { id_comentario: $('#id_comentario').val(), respuesta: $('#respuesta').val(), id_usuario: $('#id_usuario').val() }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, mensajeServidor);
                $('#modal_cerrar_comentario').modal('hide');
            });
        });
    } else if (window.location.pathname === "/Comentarios/Finalizados") {
        $('.ver-cerrado').click(function (event) {
            event.preventDefault();
            $('#ver_cerrados').modal('show');
        });

        $('.eliminar-cerrado').click(function (event) {
            event.preventDefault();
            $('#confirmar_eliminar').modal('show');
        });
    }
});