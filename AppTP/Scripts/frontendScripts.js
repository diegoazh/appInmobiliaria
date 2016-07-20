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

    $('div.alert button.close').click(function (event) {
        event.stopPropagation();
        var span = $(event.target);
        var btn = span.parent('button.close');
        var div = btn.parent('div.alert');
        div.addClass('hidden');
    });
});