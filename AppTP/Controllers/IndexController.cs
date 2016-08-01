using AppTP.Commons;
using AppTP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AppTP.Controllers
{
    public class IndexController : Controller
    {
        private ElTrebolDBDataContext db = new ElTrebolDBDataContext();

        [HttpGet , AllowAnonymous]
        public ActionResult index(int id = 1, int cantidad = 9)
        {
            
            var consulta = db.Usuario.Single(x=>x.id_usuario == 1);
            if (consulta.pass.Length < 64)
            {
                consulta.pass = UsuarioController.encriptar(consulta.pass);
                db.SubmitChanges();
            }

            ViewBag.cantComent = DatosComunes.cantComent();
            BuscarPublicaciones(id, cantidad);
            return View();
        }

        [HttpGet, AllowAnonymous]
        public ActionResult listadoProductos(int id = 1, int cantidad = 9)
        {
            BuscarPublicaciones(id, cantidad);
            return PartialView("~/Views/Index/listadoProductos/listadoProductos.cshtml");
        }

        public ActionResult casas(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

        public ActionResult departamentos(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

        public ActionResult terrenos(string id)
        {
            ViewBag.id = id;
            return View("Index");
        }

        public void BuscarPublicaciones(int id = 1, int cantidad = 9)
        {
            int? totalPublis = 0;
            var publis = db.paginacion_nuevosPrimero(id, cantidad, ref totalPublis);
            ViewBag.pagina = id;
            ViewBag.totalPaginas = (totalPublis < 1) ? 1 : totalPublis;
            ViewBag.publicaciones = publis.ToArray();
        }
    }
}
