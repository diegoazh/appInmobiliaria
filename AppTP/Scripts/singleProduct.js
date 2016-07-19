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

                if ($('#nombre').val().split(' ').join('').toLowerCase() !== $('#apellido').val().split(' ').join('').toLowerCase()) {
                    $('#nombre').removeAttr('style');
                    $('#apellido').removeAttr('style');
                    $('#alert_comentario').addClass('hidden');

                    if ($('#mail').val() !== "" && validarMail('mail')) {
                        $('#mail').removeAttr('style');
                        $('#alert_comentario').addClass('hidden');

                        if ($('#telefono').val() !== "" || $('#celular').val() !== "") {
                            $('#telefono').removeAttr('style');
                            $('#celular').removeAttr('style');
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
                            $('#telefono').attr('style', 'border: 2px solid #FF0000;');
                            $('#celular').attr('style', 'border: 2px solid #FF0000;');
                            $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                            $('#texto_alert_comentario').text('Ambos campos no pueden quedar vacios. Debe completar al menos uno. Debemos saber donde contactarlo.');
                        }
                    } else {
                        $('#mail').attr('style', 'border: 2px solid #FF0000;');
                        $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger text-center');
                        $('#texto_alert_comentario').text('El campo email esta vacio o no es válido, por favor complete el campo o verifique que está bien escrito.');
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

    function validarMail(idCampo) {
        var campo = document.getElementById(idCampo);
        var emailRegEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (emailRegEx.test(campo.value)) {
            return true;
        } else {
            return false;
        }
    }

    $('#comentario1').on('keyup', function (event) {
        var permitidos = 500;
        var restantes = 0;
        restantes = permitidos - $('#comentario1').val().length;
        $('#cant_char').html(restantes);
        var small = $('#cant_char').parent('small');
        if (restantes < 50 && restantes || restantes == 0) {
            small.removeClass('text-info text-warning').addClass('text-danger');
        } else if (restantes > 50 && restantes < 100) {
            small.removeClass('text-info text-danger').addClass('text-warning');
        } else {
            small.removeClass('text-danger text-warning').addClass('text-info');
        }
    });
});