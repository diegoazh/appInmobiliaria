/***********************************************************************************
 * Sección de funciones comunes al Front-end y al Back-end
 ***********************************************************************************/
function cuentaCaracteres(cantChar, idTextarea, idSpan) {
    'use strict';
    var permitidos = parseInt(cantChar);
    var porcien25 = 25 / 100 * permitidos;
    var porcien10 = 10 / 100 * permitidos;
    var restantes = 0;
    restantes = permitidos - $('#' + idTextarea).val().length;
    $('#' + idSpan).html(restantes);
    var small = $('#' + idSpan).parent('small');
    if (restantes <= porcien10 || restantes == 0) {
        small.removeClass('text-info text-warning').addClass('text-danger');
    } else if (restantes > porcien10 && restantes <= porcien25) {
        small.removeClass('text-info text-danger').addClass('text-warning');
    } else {
        small.removeClass('text-danger text-warning').addClass('text-info');
    }
}