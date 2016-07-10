$(document).ready(function () {
    // Menu pegajoso
    var altura = $('#main_menu').offset().top;
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > altura) {
            $('#main_menu').addClass('navbar-fixed-top');
        } else {
            $('#main_menu').removeClass('navbar-fixed-top');
        }
    });

    // Modal login
    $("#btn_login").click(function () {
        $('#modal_login_form').modal("show");
    });

    if (window.location.pathname === '/Producto') {
        $('#btn_comentario').on('click', function () {
            event.preventDefault();

            $('#foto_perfil').val($('#foto_propia').val());

            if ($('#nombre').val() !== $('#apellido').val()) {
                if ($('#comentario1').text().length > 20) {
                    $('#frm_comentario_producto').submit();
                    $('#modal_comentario_producto').modal('hide');
                } else {
                    $('#alert_comentario').removeClass('alert-default alert-danger alert-success alert-info hidden').addClass('alert-warning', 'text-center');
                    $('#texto_alert_comentario').text('El comentario tiene 20 o menos de 20 caracteres. Por favor explayecé un poco más. \n Muchas Gracias.');
                    $('#comentario1').attr('style', 'border: 2px solid #FF0000');
                }
            } else {
                $('#alert_comentario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
                $('#texto_alert_comentario').text('El nombre y el apellido del usuario no pueden ser iguales.');
                $('#nombre').attr('style', 'border: 2px solid #FF0000');
                $('#apellido').attr('style', 'border: 2px solid #FF0000');
            }
        })
    }
});