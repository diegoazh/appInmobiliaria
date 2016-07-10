$(document).ready(function () {
    'use strict';

    var idPubli = "";

    $('.btn-lg').on('click', function () {
        idPubli = $(this).attr('id').split('_');
        idPubli = idPubli[idPubli.length - 1];

        $('#modal_comentario').modal('show');

        $('#btn_single_comment').on('click', function (event) {
            event.preventDefault();
            $('#id_publicacion').val(idPubli);
            if ($('#nombre').val() !== $('#apellido').val()) {
                if($('#comentario1').val().length > 20) {
                    $('#frm_single_product').submit();
                } else {
                    $('#comentario1').attr('style', 'border: 2px solid #FF0000;');
                    $('#alert_product').removeClass('alert-default', 'alert-warning', 'alert-success', 'alert-info hidden').addClass('alert-danger', 'text-center');
                    $('#alert_product').text('El comentario tiene menos de 20 caracteres. Por favor cuentanos un poco más.');
                }
            } else {
                $('#nombre').attr('style', 'border: 2px solid #FF0000;');
                $('#apellido').attr('style', 'border: 2px solid #FF0000;');
                $('#alert_product').removeClass('alert-default', 'alert-warning', 'alert-success', 'alert-info hidden').addClass('alert-danger', 'text-center');
                $('#alert_product').text('El apellido y el nombre no pueden ser iguales.');
            }
        });
    });
});