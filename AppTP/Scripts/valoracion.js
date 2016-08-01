$(document).ready(function () {
    'use strict';

    $('#btn_valoracion').on('mouseover', function () {
        $('i.fa-star-o').mouseover(function () {
            $(this).addClass('fondo-amarillo');
            $(this).click(function () {
                var voto = $(this).attr('id');
                voto = voto.split('_');
                voto = voto[voto.length - 1];
                var idPubli = $('#id_publicacion').text();
                var controller = window.location.pathname;
                controller = controller.split('/');
                controller = controller[0];
                function callback(data) {
                    var dt = JSON.parse(data);
                    $('#alert_producto').removeClass('hidden').addClass('alert-success');
                    $('#texto_alert_product').html(dt.Data);
                }
                consultaAjax('/Valoracion/votar', 'POST', 'json', { estrellas: voto, id_publicacion: idPubli, controller: controller }, false, 'application/x-www-form-urlencoded; charset=UTF-8', true, callback);
            });
        });
        $('i.fa-star-o').mouseout(function () {
            $(this).removeClass('fondo-amarillo');
            $(this).off('click');
        });
    });
});