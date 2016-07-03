$(document).ready(function () {
    'use strict';
    function cargarSelect(tabla, selection, objetivo) {
        var select = document.getElementById(selection);
        var id = select.options[select.selectedIndex].value;
        var uri = 'http://localhost:49393/admin/cargar_selects?tabla='+ tabla +'&id=' + id;
        $.ajax({
            url: uri,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                var resJson = JSON.parse(response);
                console.log(resJson);
                var options = "";
                for (var i = 0; i < resJson.length; i++) {
                    options += '<option value="' + resJson[i].ID + '">' + resJson[i].Nombre + '</option>';
                }
                $('#' + objetivo).html(options);
            }
        });
    }

    function actualizaLocalidad() {
        cargarSelect('localidades', 'departamento', 'localidad');
    }
    
    if (window.location.href === "http://localhost:49393/admin/alta_producto") {
        $(window).on('load', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
        });

        $('#select_prov').on('change', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
        });

        $('#select_depto').on('change', function () {
            cargarSelect('localidades', 'departamento', 'localidad');
        });
    }
});