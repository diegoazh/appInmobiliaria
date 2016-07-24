$(document).ready(function () {
    'use strict';
    /***************************************
     * Sección de definición de funciones
     ***************************************/
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
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
        }).done(function (data, textStatus, jqXHR) {
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-danger alert-info hidden').addClass('alert-success', 'text-center');
            $('#texto_alert_usuarios').text(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
            $('#texto_alert_usuarios').text(textStatus + ': ' + errorThrown);
        });
    }

    function setearModal(button, tipoModal) {
        var id = button.attr('id');
        id = id.split('_');
        id = id[id.length - 1];
        if (tipoModal === 'Cerrar') {
            $('#modal_cerrar_publicacion').modal('show');
            $('h4.tt-cerrar').html('<i class="fa fa-times-circle" aria-hidden="true"></i>' + ' ' + tipoModal + ' publicación: ' + $('#tt_publi_' + id).text());
            $('#id_publi_cerrar').attr('value', parseInt(id));
            $('#titulo_publicacion').attr('value', $('#tt_publi_' + id).text());
        } else if (tipoModal === 'Estado') {
            $('#modal_estados_productos').modal('show');
            $('h4.tt-estado').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' + ' ' + tipoModal + ' publicación: ' + $('#tt_publi_' + id).text());
            $('#id_publi_est').attr('value', parseInt(id));
            $('#id_est_publi').attr('value', parseInt(id));
        }
    }

    /***************************************************
     * Alert comportamiento Toogle
     ***************************************************/
    alertToogle();

    /**************************
     * Sección del Admin
     **************************/
    if (window.location.pathname === '/admin' || window.location.pathname === '/Admin') {
        $('a.cerrar-publi').on('click', function (event) {
            event.preventDefault();
            setearModal($(this), 'Cerrar');
            $('#btn_cerrar_publicacion').on('click', function () {
                $('#frm_cerrar_publicacion').submit();
            });
            caracteresTextarea('comentario_cierre', 'cant_char');
        });

        $('a.est-publi').on('click', function (event) {
            event.preventDefault();
            setearModal($(this), 'Estado');
            function callback(data) {
                var response = JSON.parse(data);
                var options = '';
                for (var i = 0; i < response.length; i++) {
                    options += '<option value="' + response[i].id_estado + '">' + response[i].estado1 + '</option>';
                }
                $('#est_publi').html(options);
                if ($('#estado_publi_' + $('#id_publi_est').val()).text().toLowerCase() === 'publicado') {
                    $('#est_publi option[value=1]').attr('selected', 'selected');
                    $('div.input-group-addon i.icon-change').removeClass('fa-toggle-off').addClass('fa-toggle-on')
                } else {
                    $('#est_publi option[value=2]').attr('selected', 'selected');
                    $('div.input-group-addon i.icon-change').removeClass('fa-toggle-on').addClass('fa-toggle-off')
                }
                $('#est_publi').on('change', function () {
                    if ($('#est_publi option[value=1]').is(':selected')) {
                        $('i.icon-change').removeClass('fa-toggle-off').addClass('fa-toggle-on')
                    } else {
                        $('i.icon-change').removeClass('fa-toggle-on').addClass('fa-toggle-off')
                    }
                });
            }
            consultaAjax('/Admin/estados_publicacion', 'GET', 'json', { tabla: 'Estado' }, false, false, true, callback);
            $('#btn_estado_publicacion').on('click', function () {
                $('#frm_estado_publicacion').submit();
                $('#modal_estados_productos').modal('hide');
            });
        });
    }
    
    /***************************
     * Sección de productos
     ***************************/
    if (window.location.pathname === '/admin/alta_producto' || window.location.pathname === '/admin/editar_producto') {
        var numFotos = 1;
        posicionBtns();

        $(window).on('load', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
        });

        $('#provincia').on('change', function () {
            cargarSelect('departamentos', 'provincia', 'departamento');
            setTimeout(actualizaLocalidad, 350);
        });

        $('#departamento').on('change', function () {
            cargarSelect('localidades', 'departamento', 'localidad');
        });

        caracteresTextarea('descripcion', 'cant_char');

        /************ Sección que genera el string de fotos ***********/

        $('#enviar_publicacion').on('click', function (event) {
            event.preventDefault();

            if (window.location.pathname === '/admin/alta_producto' && $('#imagen_1').val() === "") {
                $('#alert_backend_usuario').removeClass('alert-default alert-warning alert-success alert-info hidden').addClass('alert-danger', 'text-center');
                $('#texto_alert_usuarios').text('El campo de foto principal no puede quedar vacio, la publicación debe tener al menos UNA foto.');
                $('#imagen_1').attr('style', 'border: 2px solid #FF0000;');
            } else {
                var stringFotos = "";
                for (var i = 1; i <= numFotos; i++) {
                    if ($('#imagen_' + i).val() !== "") {
                        var f = $('#imagen_' + i).val().split('\\');
                        f = f[f.length - 1];
                        stringFotos += (f + '*');
                    }
                }
                $('#fotos').val(stringFotos);

                //cargarImagenes();

                $('#frm_alta_producto').submit();
            }
        });
    }
});