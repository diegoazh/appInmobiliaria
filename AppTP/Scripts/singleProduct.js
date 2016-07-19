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
            if ($('#nombre').val() !== "" && $('#apellido').val() !== "") {
                $('#nombre').removeAttr('style');
                $('#apellido').removeAttr('style');
                $('#alert_comentario').addClass('hidden');
                if ($('#nombre').val().toLowerCase() !== $('#apellido').val().toLowerCase()) {
                    $('#nombre').removeAttr('style');
                    $('#apellido').removeAttr('style');
                    $('#alert_comentario').addClass('hidden');
                    if ($('#mail').val() !== "") {
                        $('#mail').removeAttr('style');
                        $('#alert_comentario').addClass('hidden');
                        if ($('#comentario1').val().length > 20) {
                            $('#comentario1').removeAttr('style');
                            $('#frm_single_product').submit();
                        } else {
                            $('#comentario1').attr('style', 'border: 2px solid #FF0000;');
                            $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                            $('#texto_alert_comentario').text('El comentario tiene menos de 20 caracteres o está vacio. Por favor cuentanos un poco más.');
                        }
                    } else {
                        $('#mail').attr('style', 'border: 2px solid #FF0000;');
                        $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                        $('#texto_alert_comentario').text('El campo email no puede quedar vacio.');
                    }
                } else {
                    $('#nombre').attr('style', 'border: 2px solid #FF0000;');
                    $('#apellido').attr('style', 'border: 2px solid #FF0000;');
                    $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                    $('#texto_alert_comentario').text('El apellido y el nombre no pueden ser iguales.');
                }
            } else {
                $('#nombre').attr('style', 'border: 2px solid #FF0000;');
                $('#apellido').attr('style', 'border: 2px solid #FF0000;');
                $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                $('#texto_alert_comentario').text('El apellido y el nombre no pueden quedar vacios.');
            }
        });
    });

    $('div.alert button.close').click(function (event) {
        event.stopPropagation();
        var span = $(event.target);
        var btn = span.parent('button.close');
        var div = btn.parent('div.alert');
        div.addClass('hidden');
    });
});