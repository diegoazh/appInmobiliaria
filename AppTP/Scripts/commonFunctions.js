﻿/***********************************************************************************
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

// Crear Cookie
var crearCookie = function (key, value) {
    'use strict';
    var expires = new Date();
    expires.setTime(expires.getTime() + 120000); // Estableces el tiempo de expiración en 2 minutos despues de crearse.
    var cookie = key + "=" + value + ";expires=" + expires.toUTCString();
    return document.cookie = cookie;
}

// Leer Cookie
var leerCookie = function (key) {
    'use strict';
    var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
    if (keyValue) {
        return keyValue[2];
    } else {
        return null;
    }
}

// Eliminar Cookie
var eliminarCookie = function (key) {
    'use strict';
    return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}