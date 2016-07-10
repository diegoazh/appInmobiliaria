$(document).ready(function () {
    'use strict';
    function cargarSelect(tabla, selection, objetivo) {
        var select = document.getElementById(selection);
        var id = select.options[select.selectedIndex].value;
        var uri = 'http://' + window.location.host + '/admin/cargar_selects?tabla=' + tabla + '&id=' + id;
        $.ajax({
            url: uri,
            type: 'GET',
            dataType: 'json',
        }).done(function (data, textStatus, jqXHR) {
            var resJson = JSON.parse(data);
            var options = "";
            for (var i = 0; i < resJson.length; i++) {
                options += '<option value="' + resJson[i].ID + '">' + resJson[i].Nombre + '</option>';
            }
            $('#' + objetivo).html(options);
        }).error(function (jqXHR, textStatus, errorThrown) {
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
            $('#texto_alert_usuarios').text('Ha ocurrido un error, no se pudo obtener la información del servidor. Mensaje del servidor: ' + textStatus + ' - ' + errorThrown);
        });
    }

    function actualizaLocalidad() {
        cargarSelect('localidades', 'departamento', 'localidad');
    }

    function posicionBtns() {
        var posicion = $('#imagen_' + numFotos).position();
        var width = $('#imagen_' + numFotos).width();
        $('.clonar-inputs-fotos').attr('style', 'top:' + (parseInt(posicion.top) - 5) + 'px; left:' + (parseInt(posicion.left) + parseInt(width) + 50) + 'px');
        for (var i = 1; i <= numFotos; i++) {
            $('.clonar-inputs-fotos button:first-child').attr('name', 'delete');
            $('.clonar-inputs-fotos button:last-child').attr('name', 'add');
            $('button[name="delete"]').click(eliminarFormGroup);
            $('button[name="add"]').click(clonarFormGroup);
        }
    }

    function clonarFormGroup(event) {
        event.preventDefault();
        var btn = $(this);
        var divClone = btn.parent('.clonar-inputs-fotos');
        var divGroup = divClone.parent('.form-group');
        var cols = divGroup.parent('div');
        var row = cols.parent('.row');
        cols.clone(true).appendTo(row);
        numFotos++;
        row.children('div:last-child').children('.form-group').children('.input-group').children('.input-group-addon').html('<i class="fa fa-file-image-o" aria-hidden="true"></i> Imagen ' + numFotos + ': ');
        row.children('div:last-child').children('.form-group').children('.input-group').children('.form-control').attr('id', 'imagen_' + numFotos).attr('name', 'imagen_' + numFotos);
        row.children('div:last-child').children('.form-group').children('.clonar-inputs-fotos').children('button:first-child').removeClass('hidden');
        divClone.children('button:first-child').addClass('hidden');
        divClone.children('button:last-child').addClass('hidden');
    }

    function eliminarFormGroup(event) {
        event.preventDefault();
        var btn = $(this);
        var divClone = btn.parent('.clonar-inputs-fotos');
        var divGroup = divClone.parent('.form-group');
        var cols = divGroup.parent('div');
        var row = cols.parent('.row');
        cols.remove();
        numFotos--;
        if (numFotos !== 1) {
            row.children('div:last-child').children('.form-group').children('.clonar-inputs-fotos').children('button:first-child').removeClass('hidden');
            row.children('div:last-child').children('.form-group').children('.clonar-inputs-fotos').children('button:last-child').removeClass('hidden');
        } else {
            row.children('div:last-child').children('.form-group').children('.clonar-inputs-fotos').children('button:last-child').removeClass('hidden');
        }
    }

    function cargarImagenes() {
        var formData = new FormData();

        for (var i = 1; i <= numFotos; i++) {
            var inputElement = document.getElementById('imagen_' + i);
            var key = inputElement.getAttribute('id');
            var value = inputElement.files[0];
            formData.append(key, value);
        }

        $.ajax({
            url: 'http://' + window.location.host + '/admin/carga_imagenes',
            type: 'POST',
            dataType: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }).done(function (data) {
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-danger alert-info hidden').addClass('alert-success', 'text-center');
            $('#texto_alert_usuarios').text(data);
        });
    }
    
    if (window.location.href === 'http://' + window.location.host + '/admin/alta_producto') {
        var numFotos = 1;
        posicionBtns();

        $(window).on('load', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
            clonarFormGroup();
            eliminarFormGroup();
            eliminarFormGroup();
        });

        $('#provincia').on('change', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
        });

        $('#departamento').on('change', function () {
            cargarSelect('localidades', 'departamento', 'localidad');
        });

        /************ Sección que genera el string de fotos ***********/

        $('#enviar_publicacion').on('click', function (event) {
            event.preventDefault();
            var stringFotos = "";
            for (var i = 1; i <= numFotos; i++) {
                var f = $('#imagen_' + i).val().split('\\');
                f = f[f.length - 1];
                stringFotos += (f + '*');
            }
            $('#fotos').val(stringFotos);

            //cargarImagenes();

            $('#frm_alta_producto').submit();
        });
    }
});