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

    // Permite que pueda aparecer y desaparecer las veces que sea necesario
    alertToogle();

    // Corrige los botones de paginación
    $('.first').html('<span aria-hidden="true"><i class="fa fa-angle-double-left" aria-hidden="true"></i></span>').attr('aria-label', 'First');
    $('.last').html('<span aria-hidden="true"><i class="fa fa-angle-double-right" aria-hidden="true"></i></span>').attr('aria-label', 'Last');
    $('.izq').html('<span aria-hidden="true"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> ' + $('.izq').html() + '</span>').attr('aria-label', 'Recientes');
    $('.der').html('<span aria-hidden="true">' + $('.der').html() + ' <i class="fa fa-chevron-circle-right" aria-hidden="true"></i></span>').attr('aria-label', 'Anteriores');
});